import { ChristianTitle, ExpressionKey, Language } from '../types/bible';

const LANG_STORAGE_KEY = 'daybible2u_lang_v1';

// 기기 언어 확인: 한국어(ko)이면 'ko', 그 외 모든 언어는 'en'
export function detectInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') {
      return saved;
    }
  } catch {
    // ignore
  }

  if (typeof navigator !== 'undefined') {
    const primaryLang =
      (Array.isArray(navigator.languages) && navigator.languages[0]) ||
      navigator.language ||
      'en';
    if (primaryLang.toLowerCase().startsWith('ko')) {
      return 'ko';
    }
    return 'en';
  }
  return 'ko';
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export const TITLE_LABELS: Record<Language, Record<ChristianTitle, string>> = {
  ko: {
    성도: '성도',
    청년: '청년',
    형제: '형제',
    자매: '자매',
    집사: '집사',
    권사: '권사',
    장로: '장로',
    목회자: '목회자',
  },
  en: {
    성도: 'Believer',
    청년: 'Youth',
    형제: 'Brother',
    자매: 'Sister',
    집사: 'Deacon',
    권사: 'Deaconess',
    장로: 'Elder',
    목회자: 'Pastor',
  },
};

export const EXPRESSION_LABELS: Record<Language, Record<ExpressionKey, string>> = {
  ko: {
    peaceful: '온화하고 평안한 미소',
    joyful: '밝고 기쁨 넘치는 표정',
    calm: '차분하고 깊은 묵상 표정',
    focused: '진지하고 또렷한 집중',
    tired: '살짝 지치고 쉼이 필요한 상태',
    courageous: '새로운 용기를 품은 결단',
    skipped: '기본 정보 맞춤 묵상',
  },
  en: {
    peaceful: 'Peaceful Smile',
    joyful: 'Joyful & Bright',
    calm: 'Calm & Reflective',
    focused: 'Focused & Earnest',
    tired: 'Weary · Needs Rest',
    courageous: 'Bold & Determined',
    skipped: 'Profile-Based Word',
  },
};

export const UI_TEXT = {
  ko: {
    appName: '데이바이블2U',
    appTitlePrefix: '데이바이블',
    appTitleAccent: '2U',
    settingsTitle: '설정',
    landingSubtitleBefore: '오늘 나의 표정과 생애주기에 맞춘 ',
    landingSubtitleBold: '말씀·묵상·1분 기도',
    nameLabel: '성명',
    namePlaceholder: '예: 홍길동',
    titleLabel: '직분',
    birthLabel: '생년월일 (양력)',
    yearPlaceholder: '출생년도',
    monthPlaceholder: '월',
    dayPlaceholder: '일',
    yearSuffix: '년',
    monthSuffix: '월',
    daySuffix: '일',
    errNameRequired: '성명(이름)을 입력해 주세요.',
    errBirthRequired: '생년월일을 모두 선택해 주세요.',
    errPhotoNoFace: '사진에서 얼굴을 찾지 못했습니다. 정면이 잘 드러난 선명한 사진을 사용해 주세요.',
    errPhotoLoad: '이미지를 불러오지 못했습니다.',
    errPhotoAnalyze: '사진 분석 중 오류가 발생했습니다.',
    errGenFail: '말씀을 생성하는 도중 오류가 발생했습니다. 다시 시도해 주세요.',
    scanBtnMain: '오늘의 얼굴 스캔하기',
    scanBtnSub: '5초 카메라 스캔으로 은혜의 말씀 찾기',
    uploadBtn: '사진 파일 업로드',
    skipScanBtn: '스캔없이 진행',
    privacyNote: '안심하세요: 얼굴 영상 및 사진은 서버로 전송되지 않습니다.',
    tagWord: '맞춤 성경 말씀',
    tagMeditation: '깊은 묵상',
    tagAction: '작은 실천',
    tagPrayer: '1분 기도',

    // CameraScanner
    backBtn: '뒤로',
    switchCamTitle: '카메라 전환',
    scanHeaderWithUser: (name: string) => `${name}님의 얼굴 스캔`,
    scanHeaderDefault: '오늘의 얼굴 스캔',
    camInitStatus: '카메라와 얼굴 인식 엔진을 여는 중...',
    camReadyStatus: '얼굴 인식 대기 중',
    camNotSupported: '이 브라우저 환경에서는 카메라를 열 수 없습니다. 사진 업로드 기능을 이용해 주세요.',
    camUnknownErr: '알 수 없는 이유로 카메라를 시작하지 못했습니다.',
    camPrep: '준비 중...',
    camFrontalScan: '정면 포착 · 스캔 중',
    camLookFront: '정면을 바라봐 주세요',
    camFindingFace: '얼굴을 찾는 중...',
    camFrontalMatch: '정면 일치',
    camGuideCenter: '화면 중앙 가이드 안에 얼굴을 맞춰주세요',
    camGuideCloser: '카메라에 조금 더 가까이 다가와 주세요',
    camGuideBack: '카메라에서 살짝만 뒤로 물러나 주세요',
    camGuideTurn: '고개를 정면으로 바르게 돌려주세요',
    camGuideDown: '턱을 살짝 내리고 정면을 바라봐 주세요',
    camGuideUp: '고개를 살짝 들어 정면을 바라봐 주세요',
    camCountdownMsg: (sec: number) => `정면 포착! ${sec}초간 가만히 유지해 주세요 ✨`,
    camSecLeft: '초 남음',
    camWaitNote: '잠시만 기다려 주세요 (2~3초 소요)',
    camErrTitle: '카메라를 열 수 없습니다',
    camErrUploadBtn: '사진 찍기 / 앨범에서 선택',
    camErrSkipBtn: '스캔없이 진행하기',
    metricSmile: '오늘의 미소 지수',
    metricVitality: '표정 활력도',

    // Generating
    genTitle: '주님이 예비하신 은혜의 말씀을 찾고 있습니다',
    genDescWithUser: (name: string) => `${name} 성도님의 정보와 오늘의 상태를 살펴`,
    genDescDefault: '입력하신 정보와 오늘의 상태를 살펴',
    genDescLine2: '맞춤 성경 구절과 묵상, 1분 기도문을 준비하고 있습니다.',

    // BibleResult
    ageText: (age: number) => `만 ${age}세`,
    graceScoreLabel: '은혜 지수',
    scoreUnit: '점',
    sec1Title: '나에게 들려주는 오늘의 말씀',
    sec2Title: '오늘의 묵상과 말씀 살피기',
    sec3Title: '오늘 하루 실천해야 할 작은 일',
    sec5Title: '오늘의 추천 찬양',
    sec6Title: '작은 영적 습관 & 성경 읽기',
    themeLabel: '오늘의 테마:',
    meaningTitle: '말씀의 은혜 조명',
    meditationGuideTitle: '묵상 가이드',
    meditationQuestionsTitle: '오늘 하루 마음에 품을 묵상 질문',
    coreMissionTag: '오늘의 핵심 실천',
    checklistTip: '항목을 터치하여 오늘 실천을 체크해 보세요.',
    confessionLabel: '오늘의 고백: ',
    amenBtn: '아멘 (말씀을 마음에 품기) 🙏',
    amenDoneBtn: '아멘으로 화답하셨습니다 🙏',
    habitLabel: '오늘의 작은 영적 습관',
    readingLabel: '추천 성경 본문',
    shareBtn: '오늘의 말씀 & 기도 복사하여 나누기',
    shareCopiedBtn: '말씀과 기도가 복사되었습니다!',
    copyFailAlert: '클립보드 복사에 실패했습니다.',
    homeBtn: '처음으로',
    rescanBtn: '다시 스캔하기',

    // SettingsModal
    settingsHeader: 'AI 영성 분석 설정',
    engineLabel: '생성 엔진 선택',
    engineLocalTitle: '로컬 정밀 엔진 (권장)',
    engineLocalSub: 'API 키 없이 100% 무료 즉시 실행',
    engineGeminiTitle: 'Google Gemini API',
    engineGeminiSub: '실시간 심층 기도문 & 묵상 생성',
    modelLabel: '사용 모델',
    apiKeyNote: 'API 키는 사용자 기기 내부(Local Storage)에만 안전하게 보관됩니다.',
    cancelBtn: '취소',
    saveBtn: '설정 저장',
    savedBtn: '저장 완료!',

    // Footer
    footerSub: '성경 본문: 개역개정 · 말씀과 기도로 거룩해지는 하루',
  },
  en: {
    appName: 'DayBible2U',
    appTitlePrefix: 'DayBible',
    appTitleAccent: '2U',
    settingsTitle: 'Settings',
    landingSubtitleBefore: 'Daily Word, Meditation & ',
    landingSubtitleBold: '1-Min Prayer for You',
    nameLabel: 'Name',
    namePlaceholder: 'e.g. David',
    titleLabel: 'Role',
    birthLabel: 'Birth Date',
    yearPlaceholder: 'Year',
    monthPlaceholder: 'Mon',
    dayPlaceholder: 'Day',
    yearSuffix: '',
    monthSuffix: '',
    daySuffix: '',
    errNameRequired: 'Please enter your name.',
    errBirthRequired: 'Please select your full birth date.',
    errPhotoNoFace: 'No face detected. Please use a clear front-facing photo.',
    errPhotoLoad: 'Failed to load image.',
    errPhotoAnalyze: 'Error analyzing photo.',
    errGenFail: 'Failed to generate today’s word. Please try again.',
    scanBtnMain: 'Scan Face Today',
    scanBtnSub: '5s camera scan for today’s verse',
    uploadBtn: 'Upload Photo',
    skipScanBtn: 'Skip Scan',
    privacyNote: '100% Private: Photos & video never leave your device.',
    tagWord: 'Daily Word',
    tagMeditation: 'Meditation',
    tagAction: 'Action',
    tagPrayer: '1-Min Prayer',

    // CameraScanner
    backBtn: 'Back',
    switchCamTitle: 'Switch Camera',
    scanHeaderWithUser: (name: string) => `${name}'s Face Scan`,
    scanHeaderDefault: 'Face Scan',
    camInitStatus: 'Starting camera & face engine...',
    camReadyStatus: 'Waiting for face...',
    camNotSupported: 'Camera unavailable in this browser. Please upload a photo.',
    camUnknownErr: 'Unable to start camera.',
    camPrep: 'Loading...',
    camFrontalScan: 'Scanning...',
    camLookFront: 'Look straight',
    camFindingFace: 'Finding face...',
    camFrontalMatch: 'Aligned',
    camGuideCenter: 'Center your face inside the circle',
    camGuideCloser: 'Please move a little closer',
    camGuideBack: 'Please step back slightly',
    camGuideTurn: 'Face straight toward the camera',
    camGuideDown: 'Lower your chin slightly',
    camGuideUp: 'Lift your head slightly',
    camCountdownMsg: (sec: number) => `Hold still! ${sec}s remaining ✨`,
    camSecLeft: 'sec',
    camWaitNote: 'Please wait a moment (2-3s)',
    camErrTitle: 'Camera Unavailable',
    camErrUploadBtn: 'Take / Choose Photo',
    camErrSkipBtn: 'Proceed Without Scan',
    metricSmile: 'Smile Index',
    metricVitality: 'Vitality',

    // Generating
    genTitle: 'Preparing Today’s Word of Grace',
    genDescWithUser: (name: string) => `Reflecting on ${name}'s life stage & today's grace`,
    genDescDefault: 'Reflecting on your profile & today’s grace',
    genDescLine2: 'Crafting your verse, meditation, and 1-min prayer.',

    // BibleResult
    ageText: (age: number) => `Age ${age}`,
    graceScoreLabel: 'Grace',
    scoreUnit: 'pts',
    sec1Title: 'Today’s Word for You',
    sec2Title: 'Meditation & Reflection',
    sec3Title: 'Small Acts for Today',
    sec5Title: 'Recommended Praise',
    sec6Title: 'Spiritual Habit & Reading',
    themeLabel: 'Theme:',
    meaningTitle: 'Grace Insight',
    meditationGuideTitle: 'Meditation Guide',
    meditationQuestionsTitle: '3 Questions to Ponder Today',
    coreMissionTag: 'Core Mission',
    checklistTip: 'Tap items to check off your daily actions.',
    confessionLabel: 'Confession: ',
    amenBtn: 'Amen (Hold in Heart) 🙏',
    amenDoneBtn: 'Responded with Amen 🙏',
    habitLabel: 'Today’s Small Habit',
    readingLabel: 'Suggested Scripture',
    shareBtn: 'Copy & Share Word & Prayer',
    shareCopiedBtn: 'Copied to Clipboard!',
    copyFailAlert: 'Failed to copy to clipboard.',
    homeBtn: 'Home',
    rescanBtn: 'Rescan',

    // SettingsModal
    settingsHeader: 'AI Reflection Settings',
    engineLabel: 'Engine',
    engineLocalTitle: 'Local Engine (Recommended)',
    engineLocalSub: '100% free & instant without API key',
    engineGeminiTitle: 'Google Gemini API',
    engineGeminiSub: 'Live personalized prayer & meditation',
    modelLabel: 'Model',
    apiKeyNote: 'Your API key is stored safely only in your device browser.',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    savedBtn: 'Saved!',

    // Footer
    footerSub: 'Scripture: NIV / ESV Style · Walk in Grace Today',
  },
} as const;
