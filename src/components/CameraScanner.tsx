import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SwitchCamera,
  ArrowLeft,
  ImagePlus,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { FaceMetrics } from '../types/bible';
import {
  checkIsFaceFrontal,
  drawGracefulOverlay,
  extractFaceMetrics,
  getVideoFaceLandmarker,
} from '../lib/faceAnalyzer';

interface CameraScannerProps {
  userName: string;
  onComplete: (metrics: FaceMetrics) => void;
  onCancel: () => void;
  onUploadPhoto: (file: File) => void;
  onTryDemo: () => void;
}

const SCAN_DURATION_MS = 3000; // 정면 유지 시 3초 스캔

export const CameraScanner: React.FC<CameraScannerProps> = ({
  userName,
  onComplete,
  onCancel,
  onUploadPhoto,
  onTryDemo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [statusText, setStatusText] = useState('카메라와 얼굴 인식 엔진 준비 중...');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const [faceDetected, setFaceDetected] = useState(false);
  const [isFrontal, setIsFrontal] = useState(false);
  const [guideMessage, setGuideMessage] = useState('황금빛 가이드 원 안에 얼굴을 맞춰주세요');
  const [scanProgress, setScanProgress] = useState(0);
  const [countdownSec, setCountdownSec] = useState<number | null>(null);

  const [liveSmile, setLiveSmile] = useState<number | null>(null);
  const [liveVitality, setLiveVitality] = useState<number | null>(null);

  const latestMetricsRef = useRef<FaceMetrics | null>(null);
  const completedRef = useRef(false);
  const frontalStartTimeRef = useRef<number | null>(null);

  // 스냅샷 썸네일 캡처
  const captureSnapshot = useCallback(
    (isMirrored: boolean): string | undefined => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return undefined;

      const size = 260;
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const ctx = off.getContext('2d');
      if (!ctx) return undefined;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const minSide = Math.min(vw, vh);
      const sx = (vw - minSide) / 2;
      const sy = (vh - minSide) / 2;

      ctx.save();
      if (isMirrored) {
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, minSide, minSide, 0, 0, size, size);
      ctx.restore();
      return off.toDataURL('image/jpeg', 0.85);
    },
    []
  );

  const finalizeScan = useCallback(
    (metrics: FaceMetrics) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const isMirrored = facingMode === 'user';
      const snap = captureSnapshot(isMirrored);
      if (snap) {
        metrics.snapshotDataUrl = snap;
      }
      onComplete(metrics);
    },
    [captureSnapshot, facingMode, onComplete]
  );

  // 카메라 스트림 및 MediaPipe 루프 구동
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animId: number | null = null;
    let isCancelled = false;

    async function initCamera() {
      setStatus('loading');
      setStatusText('카메라 연결 중...');
      setErrorDetail(null);

      try {
        const landmarker = await getVideoFaceLandmarker();
        if (isCancelled) return;

        setStatusText('카메라 스트림 시작 중...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 720 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        await video.play();

        if (isCancelled) return;
        setStatus('ready');
        setStatusText('화면 중앙을 편안하게 응시해 주세요');

        // 프레임 루프
        let lastVideoTime = -1;
        const renderLoop = () => {
          if (isCancelled) return;

          const currentVideo = videoRef.current;
          const canvas = canvasRef.current;

          if (currentVideo && canvas && currentVideo.readyState >= 2 && currentVideo.videoWidth > 0) {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const cw = Math.max(1, Math.round(rect.width * dpr));
            const ch = Math.max(1, Math.round(rect.height * dpr));
            if (canvas.width !== cw || canvas.height !== ch) {
              canvas.width = cw;
              canvas.height = ch;
            }

            const ctx = canvas.getContext('2d');
            if (ctx && currentVideo.currentTime !== lastVideoTime) {
              lastVideoTime = currentVideo.currentTime;
              const startTimeMs = performance.now();
              const result = landmarker.detectForVideo(currentVideo, startTimeMs);

              const hasFace = !!(result && result.faceLandmarks && result.faceLandmarks.length > 0);
              setFaceDetected(hasFace);

              // 비디오 object-fit: cover 보정 계산 (화면 찌그러짐 원천 방지)
              const videoAspect = currentVideo.videoWidth / currentVideo.videoHeight;
              const canvasAspect = cw / ch;
              let drawW = cw;
              let drawH = ch;
              let offsetX = 0;
              let offsetY = 0;
              if (videoAspect > canvasAspect) {
                drawH = ch;
                drawW = ch * videoAspect;
                offsetX = (cw - drawW) / 2;
              } else {
                drawW = cw;
                drawH = cw / videoAspect;
                offsetY = (ch - drawH) / 2;
              }

              if (hasFace) {
                const landmarks = result.faceLandmarks[0];
                const blendshapes = result.faceBlendshapes?.[0]?.categories;

                const frontalCheck = checkIsFaceFrontal(landmarks);
                setIsFrontal(frontalCheck.isFrontal);
                setGuideMessage(frontalCheck.message);

                const metrics = extractFaceMetrics(landmarks, blendshapes);
                latestMetricsRef.current = metrics;

                setLiveSmile(metrics.smileScore);
                setLiveVitality(metrics.vitalityScore);

                // 3초 정면 유지 시 스캔 진행
                if (frontalCheck.isFrontal) {
                  if (frontalStartTimeRef.current === null) {
                    frontalStartTimeRef.current = performance.now();
                  }
                  const elapsed = performance.now() - frontalStartTimeRef.current;
                  const ratio = Math.min(1, elapsed / SCAN_DURATION_MS);
                  setScanProgress(ratio);

                  const remainingSec = Math.max(1, Math.ceil((SCAN_DURATION_MS - elapsed) / 1000));
                  setCountdownSec(remainingSec);

                  ctx.clearRect(0, 0, cw, ch);
                  ctx.save();
                  ctx.translate(offsetX, offsetY);
                  drawGracefulOverlay(
                    ctx,
                    landmarks,
                    drawW,
                    drawH,
                    ratio,
                    true,
                    facingMode === 'user'
                  );
                  ctx.restore();

                  if (ratio >= 1 && !completedRef.current) {
                    finalizeScan(metrics);
                    return;
                  }
                } else {
                  frontalStartTimeRef.current = null;
                  setScanProgress(0);
                  setCountdownSec(null);

                  ctx.clearRect(0, 0, cw, ch);
                  ctx.save();
                  ctx.translate(offsetX, offsetY);
                  drawGracefulOverlay(
                    ctx,
                    landmarks,
                    drawW,
                    drawH,
                    0,
                    false,
                    facingMode === 'user'
                  );
                  ctx.restore();
                }
              } else {
                frontalStartTimeRef.current = null;
                setIsFrontal(false);
                setScanProgress(0);
                setCountdownSec(null);
                setGuideMessage('얼굴이 인식되지 않았습니다. 화면 중앙을 바라봐 주세요.');
                setLiveSmile(null);
                setLiveVitality(null);

                ctx.clearRect(0, 0, cw, ch);
                ctx.save();
                ctx.translate(offsetX, offsetY);
                drawGracefulOverlay(
                  ctx,
                  undefined,
                  drawW,
                  drawH,
                  0,
                  false,
                  facingMode === 'user'
                );
                ctx.restore();
              }
            }
          }

          animId = requestAnimationFrame(renderLoop);
        };

        animId = requestAnimationFrame(renderLoop);
      } catch (err: any) {
        if (isCancelled) return;
        console.error('Camera init error:', err);
        setStatus('error');
        if (err?.name === 'NotAllowedError') {
          setErrorDetail('카메라 권한이 차단되었습니다. 브라우저 설정에서 카메라 권한을 허용해 주세요.');
        } else if (err?.name === 'NotFoundError') {
          setErrorDetail('사용 가능한 카메라 기기를 찾을 수 없습니다.');
        } else {
          setErrorDetail(err?.message || '카메라를 시작하는 도중 오류가 발생했습니다.');
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (animId) cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, finalizeScan]);

  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleManualCapture = () => {
    if (latestMetricsRef.current) {
      finalizeScan(latestMetricsRef.current);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
      e.target.value = '';
    }
  };

  return (
    <div className="scanner-container">
      {/* 상단 내비게이션 바 */}
      <header className="scanner-header">
        <button type="button" className="icon-nav-button" onClick={onCancel} title="처음으로">
          <ArrowLeft size={18} />
          <span>취소</span>
        </button>

        <div className="scanner-header-title">
          <strong>{userName ? `${userName}님의 ` : ''}얼굴 상태 스캔</strong>
        </div>

        <button
          type="button"
          className="icon-nav-button"
          onClick={handleToggleFacingMode}
          title="카메라 전환"
          disabled={status !== 'ready'}
        >
          <SwitchCamera size={18} />
        </button>
      </header>

      {/* 비디오 뷰파인더 랩 */}
      <div className="viewfinder-wrapper">
        <video
          ref={videoRef}
          className={`scanner-video ${facingMode === 'user' ? 'mirrored' : ''}`}
          muted
          autoPlay
          playsInline
        />
        <canvas
          ref={canvasRef}
          className={`scanner-overlay-canvas ${facingMode === 'user' ? 'mirrored' : ''}`}
        />

        {/* 로딩 인디케이터 */}
        {status === 'loading' && (
          <div className="scanner-overlay-message">
            <div className="sacred-spinner" />
            <p className="scanner-loading-text">{statusText}</p>
          </div>
        )}

        {/* 에러 상태 안내 및 폴백 */}
        {status === 'error' && (
          <div className="scanner-error-card">
            <AlertTriangle size={36} color="#f59e0b" />
            <h3>카메라를 연결할 수 없습니다</h3>
            <p>{errorDetail}</p>
            <div className="error-actions">
              <button
                type="button"
                className="btn-gold-fill"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={16} />
                <span>사진 파일로 분석하기</span>
              </button>
              <button type="button" className="btn-outline" onClick={onTryDemo}>
                <Sparkles size={16} />
                <span>체험 데모로 진행하기</span>
              </button>
            </div>
          </div>
        )}

        {/* 정면 유지 3초 카운트다운 뱃지 */}
        {status === 'ready' && countdownSec !== null && (
          <div className="countdown-pill">
            <Sparkles size={14} className="pulse-icon" />
            <span>은혜의 빛 스캔 중... {countdownSec}초 ({Math.round(scanProgress * 100)}%)</span>
          </div>
        )}

        {/* 실시간 감지 피드백 뱃지 */}
        {status === 'ready' && faceDetected && (
          <div className="live-metrics-bar">
            {liveSmile !== null && (
              <span className="live-metric-chip">
                화평 & 미소 <strong>{liveSmile}%</strong>
              </span>
            )}
            {liveVitality !== null && (
              <span className="live-metric-chip">
                영적 활력 <strong>{liveVitality}%</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 하단 가이드 및 제어 패널 */}
      <footer className="scanner-footer">
        <div className={`guide-message-box ${isFrontal ? 'frontal' : ''}`}>
          {isFrontal ? (
            <CheckCircle2 size={16} color="#34d399" />
          ) : (
            <AlertTriangle size={16} color="#fbbf24" />
          )}
          <span>{guideMessage}</span>
        </div>

        {/* 수동 촬영 버튼 (정면 확인 시 즉시 촬영 가능) */}
        {status === 'ready' && (
          <div className="scanner-controls">
            <button
              type="button"
              className="btn-outline-small"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={14} />
              <span>사진 업로드</span>
            </button>

            {faceDetected && (
              <button
                type="button"
                className="btn-gold-small"
                onClick={handleManualCapture}
              >
                <span>지금 바로 말씀 받기</span>
              </button>
            )}

            <button type="button" className="btn-outline-small" onClick={onTryDemo}>
              <Sparkles size={14} />
              <span>데모 체험</span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </footer>
    </div>
  );
};
