import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SwitchCamera,
  ArrowLeft,
  ImagePlus,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { FaceMetrics, Language } from '../types/bible';
import {
  checkIsFaceFrontal,
  drawMysticalOverlay,
  extractFaceMetrics,
  getVideoFaceLandmarker,
} from '../lib/faceAnalyzer';
import { UI_TEXT } from '../lib/i18n';

interface CameraScannerProps {
  lang: Language;
  userName: string;
  onComplete: (metrics: FaceMetrics) => void;
  onCancel: () => void;
  onUploadPhoto: (file: File) => void;
  onSkipScan: () => void;
}

const SCAN_DURATION_MS = 5000; // 정확히 5초 동안 정면 유지

export const CameraScanner: React.FC<CameraScannerProps> = ({
  lang,
  userName,
  onComplete,
  onCancel,
  onUploadPhoto,
  onSkipScan,
}) => {
  const t = UI_TEXT[lang];
  const langRef = useRef<Language>(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [statusText, setStatusText] = useState<string>(t.camInitStatus);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const [faceDetected, setFaceDetected] = useState(false);
  const [isFrontal, setIsFrontal] = useState(false);
  const [guideMessage, setGuideMessage] = useState<string>(t.camGuideCenter);
  const [scanProgress, setScanProgress] = useState(0);
  const [countdownSec, setCountdownSec] = useState<number | null>(null);

  const [liveSmile, setLiveSmile] = useState<number | null>(null);
  const [liveVitality, setLiveVitality] = useState<number | null>(null);

  const latestMetricsRef = useRef<FaceMetrics | null>(null);
  const completedRef = useRef(false);
  const frontalStartTimeRef = useRef<number | null>(null);

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
      const snapshot = captureSnapshot(facingMode === 'user');
      onComplete({
        ...metrics,
        snapshotDataUrl: snapshot,
      });
    },
    [captureSnapshot, facingMode, onComplete]
  );

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;
    let rafId = 0;
    let lastVideoTime = -1;

    completedRef.current = false;
    frontalStartTimeRef.current = null;
    setScanProgress(0);
    setCountdownSec(null);
    setFaceDetected(false);
    setIsFrontal(false);
    setStatus('loading');
    setErrorDetail(null);
    setStatusText(UI_TEXT[langRef.current].camInitStatus);

    async function init() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(UI_TEXT[langRef.current].camNotSupported);
        }

        const [mediaStream, landmarker] = await Promise.all([
          navigator.mediaDevices.getUserMedia({
            video: {
              facingMode,
              width: { ideal: 720 },
              height: { ideal: 960 },
            },
            audio: false,
          }),
          getVideoFaceLandmarker(),
        ]);

        if (!active) {
          mediaStream.getTracks().forEach((tTrack) => tTrack.stop());
          return;
        }

        stream = mediaStream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = mediaStream;
        await video.play();

        if (!active) return;
        setStatus('ready');
        setStatusText(UI_TEXT[langRef.current].camReadyStatus);

        const loop = () => {
          if (!active || completedRef.current) return;

          const curT = UI_TEXT[langRef.current];
          const v = videoRef.current;
          const canvas = canvasRef.current;
          if (v && canvas && v.readyState >= 2 && v.videoWidth > 0) {
            if (v.currentTime !== lastVideoTime) {
              lastVideoTime = v.currentTime;

              const rect = canvas.getBoundingClientRect();
              const dpr = Math.min(window.devicePixelRatio || 1, 2);
              const cw = Math.max(1, Math.round(rect.width * dpr));
              const ch = Math.max(1, Math.round(rect.height * dpr));
              if (canvas.width !== cw || canvas.height !== ch) {
                canvas.width = cw;
                canvas.height = ch;
              }

              const ctx = canvas.getContext('2d');
              const now = performance.now();
              const result = landmarker.detectForVideo(v, now);

              if (result.faceLandmarks && result.faceLandmarks.length > 0 && ctx) {
                const landmarks = result.faceLandmarks[0];
                const blendshapes = result.faceBlendshapes?.[0]?.categories;

                const frontalCheck = checkIsFaceFrontal(landmarks, langRef.current);
                const metrics = extractFaceMetrics(landmarks, blendshapes);
                latestMetricsRef.current = metrics;
                setFaceDetected(true);
                setLiveSmile(metrics.smileScore);
                setLiveVitality(metrics.vitalityScore);

                if (frontalCheck.isFrontal) {
                  // 정면이 정확하게 포착되었을 때 5초 타이머 동작
                  setIsFrontal(true);
                  if (frontalStartTimeRef.current === null) {
                    frontalStartTimeRef.current = now;
                  }
                  const elapsed = now - frontalStartTimeRef.current;
                  const progress = Math.min(1, elapsed / SCAN_DURATION_MS);
                  const remaining = Math.max(1, Math.ceil((SCAN_DURATION_MS - elapsed) / 1000));

                  setScanProgress(progress);
                  setCountdownSec(remaining);
                  setGuideMessage(curT.camCountdownMsg(remaining));

                  // 비디오 object-fit: cover 보정
                  const videoAspect = v.videoWidth / v.videoHeight;
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

                  ctx.clearRect(0, 0, cw, ch);
                  ctx.save();
                  ctx.translate(offsetX, offsetY);
                  drawMysticalOverlay(
                    ctx,
                    landmarks,
                    drawW,
                    drawH,
                    progress,
                    true,
                    facingMode === 'user'
                  );
                  ctx.restore();

                  if (progress >= 1) {
                    finalizeScan(metrics);
                    return;
                  }
                } else {
                  frontalStartTimeRef.current = null;
                  setIsFrontal(false);
                  setScanProgress(0);
                  setCountdownSec(null);
                  setGuideMessage(frontalCheck.message);

                  if (ctx) ctx.clearRect(0, 0, cw, ch);
                }
              } else {
                frontalStartTimeRef.current = null;
                setScanProgress(0);
                setCountdownSec(null);
                setFaceDetected(false);
                setIsFrontal(false);
                setGuideMessage(curT.camGuideCenter);
                if (ctx) ctx.clearRect(0, 0, cw, ch);
              }
            }
          }

          rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
      } catch (err: unknown) {
        if (!active) return;
        setStatus('error');
        const msg =
          err instanceof Error
            ? err.message
            : UI_TEXT[langRef.current].camUnknownErr;
        setErrorDetail(msg);
      }
    }

    init();

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((tTrack) => tTrack.stop());
      }
    };
  }, [facingMode, finalizeScan]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
      e.target.value = '';
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 상단 툴바 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
          style={{
            padding: '7px 12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 999,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>{t.backBtn}</span>
        </button>

        <span style={{ fontSize: 13.5, color: 'var(--gold-light)', fontWeight: 600 }}>
          {userName ? t.scanHeaderWithUser(userName) : t.scanHeaderDefault}
        </span>

        <button
          type="button"
          className="icon-btn"
          onClick={() =>
            setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
          }
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label={t.switchCamTitle}
          title={t.switchCamTitle}
        >
          <SwitchCamera size={18} />
        </button>
      </div>

      {/* 카메라 뷰파인더 스테이지 */}
      <div className="camera-stage">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`camera-video ${facingMode === 'user' ? 'mirrored' : ''}`}
        />
        <canvas ref={canvasRef} className="camera-canvas" />

        {/* 정면 아닐 때 나타나는 둥근 원형 가이드 */}
        {status === 'ready' && !isFrontal && (
          <div className="camera-guide-oval">
            <div className="guide-oval-shape" />
          </div>
        )}

        {/* 상단 상태 HUD 뱃지 */}
        <div className="camera-hud-top">
          <div className="status-pill">
            <span className={`live-dot ${isFrontal ? '' : 'warn'}`} />
            <span>
              {status === 'loading'
                ? t.camPrep
                : isFrontal
                ? t.camFrontalScan
                : faceDetected
                ? t.camLookFront
                : t.camFindingFace}
            </span>
          </div>

          {isFrontal && (
            <div className="status-pill" style={{ color: '#34d399', borderColor: '#34d399' }}>
              <CheckCircle2 size={13} />
              <span>{t.camFrontalMatch}</span>
            </div>
          )}
        </div>

        {/* 5초 카운트다운 중앙 대형 원형 뱃지 */}
        {isFrontal && countdownSec !== null && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 15,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'rgba(11, 13, 23, 0.78)',
                border: '3px solid #fde68a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(253, 230, 138, 0.5)',
              }}
            >
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: '#fef08a',
                  lineHeight: 1,
                }}
              >
                {countdownSec}
              </span>
              <span style={{ fontSize: 11, color: 'var(--gold-light)', marginTop: 2 }}>
                {t.camSecLeft}
              </span>
            </div>
          </div>
        )}

        {/* 로딩 상태 화면 */}
        {status === 'loading' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 11, 20, 0.88)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div className="sacred-spinner" style={{ width: 52, height: 52 }} />
            <strong style={{ color: 'var(--gold-light)', fontSize: 15 }}>
              {statusText}
            </strong>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              {t.camWaitNote}
            </span>
          </div>
        )}

        {/* 카메라 에러 화면 */}
        {status === 'error' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 11, 20, 0.94)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 22,
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={36} color="#fbbf24" />
            <strong style={{ fontSize: 16 }}>{t.camErrTitle}</strong>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.55,
                color: 'var(--text-secondary)',
              }}
            >
              {errorDetail}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn-gold-fill"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: 6, width: '100%', maxWidth: 240 }}
            >
              <ImagePlus size={18} />
              <span>{t.camErrUploadBtn}</span>
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={onSkipScan}
              style={{ width: '100%', maxWidth: 240 }}
            >
              <Sparkles size={16} />
              <span>{t.camErrSkipBtn}</span>
            </button>
          </div>
        )}

        {/* 하단 실시간 안내 말풍선 */}
        {status === 'ready' && (
          <div className="commentary-bubble">
            <p style={{ textAlign: 'center', fontWeight: 600 }}>{guideMessage}</p>
          </div>
        )}
      </div>

      {/* 5초 진행 바 */}
      <div className="scan-progress-track">
        <div
          className="scan-progress-fill"
          style={{ width: `${Math.round(scanProgress * 100)}%` }}
        />
      </div>

      {/* 실시간 수치 칩 (미소 지수, 표정 활력도) */}
      <div className="live-metrics-bar">
        <div className="metric-chip">
          <span className="metric-chip-label">{t.metricSmile}</span>
          <span className="metric-chip-val">
            {liveSmile !== null && faceDetected ? `${liveSmile}%` : '--'}
          </span>
        </div>
        <div className="metric-chip">
          <span className="metric-chip-label">{t.metricVitality}</span>
          <span className="metric-chip-val">
            {liveVitality !== null && faceDetected ? `${liveVitality}%` : '--'}
          </span>
        </div>
      </div>
    </section>
  );
};
