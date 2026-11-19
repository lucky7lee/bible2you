export type ExpressionType =
  | '온화하고 평안한 미소'
  | '밝고 기쁨 넘치는 표정'
  | '차분하고 깊은 묵상 표정'
  | '진지하고 또렷한 집중'
  | '살짝 지치고 쉼이 필요한 상태'
  | '새로운 용기를 품은 결단';

export interface FaceMetrics {
  smileScore: number; // 미소 & 기쁨 지수 (0~100)
  vitalityScore: number; // 눈빛 영적 활력 (0~100)
  symmetryScore: number; // 얼굴 조화 및 평강도 (0~100)
  calmScore: number; // 고요함과 평온함 (0~100)
  fatigueScore: number; // 피로도 / 안식 필요도 (0~100)

  expression: ExpressionType;
  faceHighlights: string[]; // 얼굴에서 읽어낸 은혜의 특징 3가지
  dominantMood: 'peace' | 'joy' | 'rest' | 'courage' | 'wisdom' | 'love';

  capturedAt: string;
  snapshotDataUrl?: string;
  isDemo?: boolean;
}

export type ChristianTitle =
  | '성도'
  | '청년'
  | '형제'
  | '자매'
  | '집사'
  | '권사'
  | '장로'
  | '목회자';

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  title?: ChristianTitle;
}

export interface LifeStageInfo {
  stage: '어린이·청소년' | '청년' | '장년' | '중년' | '시니어';
  age: number;
  stageMessage: string;
  prayerFocus: string;
}

export interface BibleVerse {
  reference: string; // 예: "빌립보서 4장 6-7절"
  testament: '구약' | '신약';
  book: string;
  chapter: number;
  verseRange: string;
  text: string;
  context: string; // 말씀 배경 및 영적 의미
  keyword: string; // 키워드: 평안, 능력, 사랑 등
}

export interface DailyActionItem {
  id: string;
  title: string;
  description: string;
  category: 'word' | 'love' | 'prayer' | 'thanks';
}

export interface RecommendedPraise {
  title: string;
  artist: string;
  lyricSnippet: string;
  theme: string;
}

export interface BibleResultData {
  user: UserProfile;
  lifeStage: LifeStageInfo;
  todayDateText: string;
  todayTheme: string;
  themeSubtitle: string;
  spiritualScore: number; // 오늘의 은혜 지수 (0~100)
  
  // 1. 오늘의 성경 말씀
  verse: BibleVerse;

  // 2. 오늘 해야 할 묵상 내용
  meditation: {
    faceSpiritualDiagnosis: string;
    reflectionText: string;
    questions: string[];
  };

  // 3. 오늘 하루 실천해야 할 작은 일
  action: {
    coreMission: string;
    items: DailyActionItem[];
  };

  // 4. 오늘의 1분 기도문
  prayer: {
    title: string;
    body: string;
    oneLineConfession: string;
  };

  // 5. 기독교인이 오늘 해야 할 일 (찬양, 감사, 영적 습관)
  christianDaily: {
    recommendedPraise: RecommendedPraise;
    gratitudePrompt: string;
    spiritualHabit: string;
    readingSuggestion: string;
  };

  metrics: FaceMetrics;
  source: 'local-engine' | 'gemini-api';
}

export interface AppSettings {
  engine: 'local' | 'gemini';
  geminiApiKey: string;
  geminiModel: string;
}
