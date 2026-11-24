import { useState, useCallback, useEffect } from 'react';
import { Settings } from 'lucide-react';
import {
  AppSettings,
  BibleResultData,
  FaceMetrics,
  Language,
  UserProfile,
} from './types/bible';
import {
  createProfileOnlyMetrics,
  extractFaceMetrics,
  getImageFaceLandmarker,
} from './lib/faceAnalyzer';
import { generateBibleResult, generateLocalBibleResult } from './lib/bibleEngine';
import { detectInitialLanguage, saveLanguage, UI_TEXT } from './lib/i18n';
import {
  getLocalDateKey,
  loadTodayRecord,
  saveTodayRecord,
  TodaySavedRecord,
  updateTodayProgress,
} from './lib/todayStorage';
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
        gender: parsed.gender === 'female' ? 'female' : 'male',
        title: typeof parsed.title === 'string' ? parsed.title : '성도',
      };
    }
  } catch {
    // ignore
  }
  return {
    name: '',
    birthDate: '',
    gender: 'male',
    title: '성도',
  };
}

export default function App() {
  const [lang, setLang] = useState<Language>(detectInitialLanguage);
  const [step, setStep] = useState<AppStep>('landing');
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [user, setUser] = useState<UserProfile>(loadUserProfile);

  // 오늘(현지 시간) 저장된 말씀 기록 (자정 지나면 자동 null)
  const [todayRecord, setTodayRecord] = useState<TodaySavedRecord | null>(() => loadTodayRecord());
  const [lastMetrics, setLastMetrics] = useState<FaceMetrics | null>(
    () => loadTodayRecord()?.metrics ?? null
  );
  const [resultData, setResultData] = useState<BibleResultData | null>(
    () => loadTodayRecord()?.resultData ?? null
  );

  const [showSettings, setShowSettings] = useState(false);
  const [isPhotoAnalyzing, setIsPhotoAnalyzing] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const t = UI_TEXT[lang];

  // 언어 변경 시 HTML lang 속성 & 문서 타이틀 업데이트
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'en'
        ? 'DayBible2U - Daily Bible Word, Meditation & Prayer'
        : '데이바이블2U - 오늘의 맞춤 성경 말씀 & 묵상·기도';
  }, [lang]);

  // 화면 전환 시 항상 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // 현지 시간 기준 자정(새로운 하루 시작) 감지 및 자동 비활성화 처리
  useEffect(() => {
    const verifyDateFreshness = () => {
      const todayKey = getLocalDateKey();
      setTodayRecord((prev) => {
        if (prev && prev.dateKey !== todayKey) {
          loadTodayRecord(); // 스토리지 정리
          return null;
        }
        return prev;
      });
    };

    const intervalId = window.setInterval(verifyDateFreshness, 30000); // 30초마다 체크
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        verifyDateFreshness();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', verifyDateFreshness);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', verifyDateFreshness);
    };
  }, []);

  const handleSelectLanguage = (nextLang: Language) => {
    if (nextLang === lang) return;
    setLang(nextLang);
    saveLanguage(nextLang);
    setPhotoError(null);

    // 결과 화면에서 언어를 변경하면 즉시 새 언어로 결과를 갱신
    if (step === 'result' && lastMetrics) {
      const updated = generateLocalBibleResult(user, lastMetrics, nextLang);
      setResultData(updated);
      const saved = saveTodayRecord(
        user,
        lastMetrics,
        updated,
        todayRecord?.checkedActions || {},
        todayRecord?.hasAmenClicked || false,
        todayRecord?.hasUnlockedBonus || false
      );
      setTodayRecord(saved);
    }
  };

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

  // 분석 실행 및 결과 생성 (생성 완료 시 오늘의 기록으로 저장·갱신)
  const runGeneration = useCallback(
    async (metrics: FaceMetrics) => {
      setLastMetrics(metrics);
      setStep('generating');
      try {
        const data = await generateBibleResult(user, metrics, settings, lang);
        setResultData(data);
        const saved = saveTodayRecord(user, metrics, data, {}, false, false);
        setTodayRecord(saved);
        setStep('result');
      } catch (err) {
        console.error('Generation error:', err);
        alert(UI_TEXT[lang].errGenFail);
        setStep('landing');
      }
    },
    [user, settings, lang]
  );

  // "오늘 말씀 확인하기" 클릭: 저장된 오늘의 최신 결과와 체크 상태를 그대로 표시
  const handleViewTodayWord = useCallback(() => {
    const fresh = loadTodayRecord();
    if (!fresh) {
      setTodayRecord(null);
      return;
    }

    setLastMetrics(fresh.metrics);
    if (fresh.resultData.lang !== lang) {
      const translated = generateLocalBibleResult(fresh.user, fresh.metrics, lang);
      setResultData(translated);
      const updated = saveTodayRecord(
        fresh.user,
        fresh.metrics,
        translated,
        fresh.checkedActions,
        fresh.hasAmenClicked,
        fresh.hasUnlockedBonus
      );
      setTodayRecord(updated);
    } else {
      setResultData(fresh.resultData);
      setTodayRecord(fresh);
    }
    setStep('result');
  }, [lang]);

  // 결과 화면에서 실천사항 체크/아멘/보상형 보너스 잠금 해제 시 실시간 저장
  const handleProgressChange = useCallback(
    (
      checkedActions: Record<string, boolean>,
      hasAmenClicked: boolean,
      hasUnlockedBonus: boolean
    ) => {
      updateTodayProgress(checkedActions, hasAmenClicked, hasUnlockedBonus);
      setTodayRecord((prev) =>
        prev ? { ...prev, checkedActions, hasAmenClicked, hasUnlockedBonus } : prev
      );
    },
    []
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
          img.onerror = () => reject(new Error(UI_TEXT[lang].errPhotoLoad));
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

        const result = imageLandmarker.detect(img);
        URL.revokeObjectURL(objectUrl);

        if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
          setPhotoError(UI_TEXT[lang].errPhotoNoFace);
          setIsPhotoAnalyzing(false);
          return;
        }

        const landmarks = result.faceLandmarks[0];
        const blendshapes = result.faceBlendshapes?.[0]?.categories;
        const metrics = extractFaceMetrics(landmarks, blendshapes, snapshotUrl);

        setIsPhotoAnalyzing(false);
        runGeneration(metrics);
      } catch (err: unknown) {
        console.error('Photo analysis error:', err);
        const msg = err instanceof Error ? err.message : UI_TEXT[lang].errPhotoAnalyze;
        setPhotoError(msg);
        setIsPhotoAnalyzing(false);
      }
    },
    [runGeneration, lang]
  );

  // 스캔없이 진행 (입력한 기본 정보만을 바탕으로 분석)
  const handleSkipScan = useCallback(() => {
    const profileMetrics = createProfileOnlyMetrics(
      user.name,
      user.birthDate,
      user.gender || 'male',
      user.title || '성도'
    );
    runGeneration(profileMetrics);
  }, [user.name, user.birthDate, user.gender, user.title, runGeneration]);

  const hasTodayWord = !!todayRecord && todayRecord.dateKey === getLocalDateKey();

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
          <span className="brand-title">{t.appName}</span>
        </div>

        <div className="navbar-actions">
          {/* 설정 버튼 바로 앞쪽: 한글 / ENG 언어 선택 버튼 */}
          <div className="lang-toggle-group" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-toggle-btn ${lang === 'ko' ? 'active' : ''}`}
              onClick={() => handleSelectLanguage('ko')}
            >
              한글
            </button>
            <button
              type="button"
              className={`lang-toggle-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => handleSelectLanguage('en')}
            >
              ENG
            </button>
          </div>

          <button
            type="button"
            className="btn-icon-setting"
            onClick={() => setShowSettings(true)}
            title={t.settingsTitle}
            aria-label={t.settingsTitle}
          >
            <Settings size={17} />
          </button>
        </div>
      </nav>

      {/* 단계별 메인 뷰 */}
      {step === 'landing' && (
        <LandingView
          lang={lang}
          user={user}
          hasTodayWord={hasTodayWord}
          onChangeUser={handleChangeUser}
          onStartCamera={() => setStep('scanning')}
          onViewTodayWord={handleViewTodayWord}
          onUploadPhoto={handleUploadPhoto}
          onSkipScan={handleSkipScan}
          isPhotoAnalyzing={isPhotoAnalyzing}
          photoError={photoError}
        />
      )}

      {step === 'scanning' && (
        <CameraScanner
          lang={lang}
          userName={user.name}
          onComplete={runGeneration}
          onCancel={() => setStep('landing')}
          onUploadPhoto={handleUploadPhoto}
          onSkipScan={handleSkipScan}
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
            <h2>{t.genTitle}</h2>
            <p>
              {user.name ? t.genDescWithUser(user.name) : t.genDescDefault}
              <br />
              {t.genDescLine2}
            </p>
          </div>
        </main>
      )}

      {step === 'result' && resultData && (
        <BibleResult
          key={`${resultData.metrics.capturedAt}_${resultData.lang}`}
          lang={lang}
          data={resultData}
          initialCheckedActions={todayRecord?.checkedActions}
          initialAmenClicked={todayRecord?.hasAmenClicked}
          initialBonusUnlocked={todayRecord?.hasUnlockedBonus}
          onProgressChange={handleProgressChange}
          onRescan={() => {
            try {
              const bridge = (window as unknown as { DayBibleAndroid?: { showInterstitial?: () => void } }).DayBibleAndroid;
              bridge?.showInterstitial?.();
            } catch {
              // ignore on web
            }
            setStep('scanning');
          }}
          onGoHome={() => setStep('landing')}
        />
      )}

      {/* 설정 모달 */}
      {showSettings && (
        <SettingsModal
          lang={lang}
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 푸터 */}
      <footer className="global-footer">
        <p>
          {t.appName} &copy; {new Date().getFullYear()}
        </p>
        <p className="footer-sub">{t.footerSub}</p>
      </footer>
    </div>
  );
}
