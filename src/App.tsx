import { useState, useCallback } from 'react';
import { Settings } from 'lucide-react';
import {
  AppSettings,
  BibleResultData,
  FaceMetrics,
  UserProfile,
} from './types/bible';
import {
  createDemoFaceMetrics,
  extractFaceMetrics,
  getImageFaceLandmarker,
} from './lib/faceAnalyzer';
import { generateBibleResult } from './lib/bibleEngine';
import { LandingView } from './components/LandingView';
import { CameraScanner } from './components/CameraScanner';
import { BibleResult } from './components/BibleResult';
import { SettingsModal } from './components/SettingsModal';

type AppStep = 'landing' | 'scanning' | 'generating' | 'result';

const SETTINGS_KEY = 'bible2you_settings_v1';
const USER_PROFILE_KEY = 'bible2you_user_profile_v1';

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        engine: parsed.engine === 'gemini' ? 'gemini' : 'local',
        geminiApiKey: typeof parsed.geminiApiKey === 'string' ? parsed.geminiApiKey : '',
        geminiModel:
          typeof parsed.geminiModel === 'string' && parsed.geminiModel
            ? parsed.geminiModel
            : 'gemini-2.5-flash',
      };
    }
  } catch {
    // ignore
  }
  return {
    engine: 'local',
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash',
  };
}

function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        name: typeof parsed.name === 'string' ? parsed.name : '',
        birthDate: typeof parsed.birthDate === 'string' ? parsed.birthDate : '',
        title: typeof parsed.title === 'string' ? parsed.title : '성도',
      };
    }
  } catch {
    // ignore
  }
  return {
    name: '',
    birthDate: '',
    title: '성도',
  };
}

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [resultData, setResultData] = useState<BibleResultData | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [isPhotoAnalyzing, setIsPhotoAnalyzing] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleSaveSettings = (next: AppSettings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleChangeUser = (next: UserProfile) => {
    setUser(next);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // 분석 실행 및 결과 생성
  const runGeneration = useCallback(
    async (metrics: FaceMetrics) => {
      setStep('generating');
      try {
        const data = await generateBibleResult(user, metrics, settings);
        setResultData(data);
        setStep('result');
      } catch (err) {
        console.error('Generation error:', err);
        alert('말씀을 생성하는 도중 오류가 발생했습니다. 다시 시도해 주세요.');
        setStep('landing');
      }
    },
    [user, settings]
  );

  // 사진 업로드 분석
  const handleUploadPhoto = useCallback(
    async (file: File) => {
      setIsPhotoAnalyzing(true);
      setPhotoError(null);

      try {
        const imageLandmarker = await getImageFaceLandmarker();
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
          img.src = objectUrl;
        });

        // 썸네일 데이터 생성
        const thumbCanvas = document.createElement('canvas');
        const size = 260;
        thumbCanvas.width = size;
        thumbCanvas.height = size;
        const tctx = thumbCanvas.getContext('2d');
        if (tctx) {
          const minSide = Math.min(img.naturalWidth, img.naturalHeight);
          const sx = (img.naturalWidth - minSide) / 2;
          const sy = (img.naturalHeight - minSide) / 2;
          tctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        }
        const snapshotUrl = thumbCanvas.toDataURL('image/jpeg', 0.85);

        // MediaPipe FaceLandmarker로 이미지 분석
        const result = imageLandmarker.detect(img);
        URL.revokeObjectURL(objectUrl);

        if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
          setPhotoError('사진에서 얼굴을 찾지 못했습니다. 정면이 잘 드러난 선명한 사진을 사용해 주세요.');
          setIsPhotoAnalyzing(false);
          return;
        }

        const landmarks = result.faceLandmarks[0];
        const blendshapes = result.faceBlendshapes?.[0]?.categories;
        const metrics = extractFaceMetrics(landmarks, blendshapes, snapshotUrl);

        setIsPhotoAnalyzing(false);
        runGeneration(metrics);
      } catch (err: any) {
        console.error('Photo analysis error:', err);
        setPhotoError(err?.message || '사진 분석 중 오류가 발생했습니다.');
        setIsPhotoAnalyzing(false);
      }
    },
    [runGeneration]
  );

  // 데모 체험
  const handleTryDemo = useCallback(() => {
    const demoMetrics = createDemoFaceMetrics();
    runGeneration(demoMetrics);
  }, [runGeneration]);

  return (
    <div className="app-shell">
      {/* 글로벌 상단 브랜드 내비게이션 바 */}
      <nav className="global-navbar">
        <div className="brand-logo" onClick={() => setStep('landing')}>
          <div className="logo-cross-symbol">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M12 2 L12 22 M6 8 L18 8"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="brand-title">오늘 성경 말씀 To You</span>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="btn-icon-setting"
            onClick={() => setShowSettings(true)}
            title="설정"
          >
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* 단계별 메인 뷰 */}
      {step === 'landing' && (
        <LandingView
          user={user}
          onChangeUser={handleChangeUser}
          onStartCamera={() => setStep('scanning')}
          onUploadPhoto={handleUploadPhoto}
          onTryDemo={handleTryDemo}
          isPhotoAnalyzing={isPhotoAnalyzing}
          photoError={photoError}
        />
      )}

      {step === 'scanning' && (
        <CameraScanner
          userName={user.name}
          onComplete={runGeneration}
          onCancel={() => setStep('landing')}
          onUploadPhoto={handleUploadPhoto}
          onTryDemo={handleTryDemo}
        />
      )}

      {step === 'generating' && (
        <main className="generating-view">
          <div className="sacred-generating-spinner">
            <div className="spinner-halo" />
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
              <path
                d="M20 6 L20 34 M11 15 L29 15"
                stroke="#fbbf24"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="generating-text-group">
            <h2>주님이 예비하신 은혜의 말씀을 찾고 있습니다</h2>
            <p>
              {user.name ? `${user.name} 성도님의 생애주기와 ` : ''}
              오늘 스캔된 얼굴 상태를 살펴
              <br />
              맞춤 성경 구절과 묵상, 1분 기도문을 조합하고 있습니다.
            </p>
          </div>
        </main>
      )}

      {step === 'result' && resultData && (
        <BibleResult
          data={resultData}
          onRescan={() => setStep('scanning')}
          onGoHome={() => setStep('landing')}
        />
      )}

      {/* 설정 모달 */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 푸터 */}
      <footer className="global-footer">
        <p>
          오늘 성경 말씀 To You · Bible To You &copy; {new Date().getFullYear()}
        </p>
        <p className="footer-sub">
          성경 본문: 개역개정 (대한성서공회) · 말씀과 기도로 거룩해지는 하루
        </p>
      </footer>
    </div>
  );
}
