export type Language = 'ko' | 'en' | 'es';

export type Gender = 'male' | 'female';

export type ExpressionKey =
  | 'peaceful'
  | 'joyful'
  | 'calm'
  | 'focused'
  | 'tired'
  | 'courageous'
  | 'skipped';

export type ExpressionType =
  | '온화하고 평안한 미소'
  | '밝고 기쁨 넘치는 표정'
  | '차분하고 깊은 묵상 표정'
  | '진지하고 또렷한 집중'
  | '살짝 지치고 쉼이 필요한 상태'
  | '새로운 용기를 품은 결단'
  | '기본 정보 맞춤 묵상';

export interface FaceFeatureDetails {
  faceShapeKey: 'oval' | 'round' | 'angular' | 'long' | 'heart';
  eyeShapeKey: 'bright' | 'gentle' | 'focused' | 'smiling';
  eyebrowShapeKey: 'arch' | 'straight' | 'strong' | 'soft';
  noseShapeKey: 'generous' | 'defined' | 'balanced';
  mouthShapeKey: 'wideSmile' | 'warm' | 'calm';
  balanceKey: 'forehead' | 'middle' | 'lower' | 'harmony';
}

export interface FaceMetrics {
  smileScore: number; // 미소 & 기쁨 지수 (0~100)
  vitalityScore: number; // 눈빛 활력도 (0~100)
  symmetryScore: number; // 얼굴 좌우 균형도 (0~100)
  calmScore: number; // 평온함과 차분함 (0~100)
  fatigueScore: number; // 피로도 / 쉼 필요도 (0~100)

  expression: ExpressionType;
  expressionKey?: ExpressionKey;
  faceHighlights: string[];
  faceFeatures?: FaceFeatureDetails;
  dominantMood: 'peace' | 'joy' | 'rest' | 'courage' | 'wisdom' | 'love';

  capturedAt: string;
  snapshotDataUrl?: string;
  isDemo?: boolean;
  isSkippedScan?: boolean; // 스캔없이 기본 정보만으로 진행한 경우
}

export type ChristianTitle =
  | '성도'
  | '청년'
  | '형제'
  | '자매'
  | '집사'
  | '안수집사'
  | '권사'
  | '장로'
  | '사모'
  | '목회자';

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender?: Gender;
  title?: ChristianTitle;
}

export interface LifeStageInfo {
  stage: string;
  age: number;
  stageMessage: string;
  prayerFocus: string;
}

export interface BibleVerse {
  reference: string;
  testament: string; // '구약' | '신약' | 'OT' | 'NT'
  book: string;
  chapter: number;
  verseRange: string;
  text: string;
  context: string;
  keyword: string;
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

export interface BonusGraceData {
  // 7. 연관 성경 구절 & 성경 인물 이야기
  companionVerseRef: string;
  companionVerseText: string;
  biblicalFigureName: string;
  biblicalFigureStory: string;

  // 8. 인간관계 & 일터(학업)의 지혜
  relationshipWisdom: string;
  workWisdom: string;

  // 9. 오늘의 감사 키워드 3가지 & 마음 다스림
  gratitudeSeeds: string[];
  peaceTip: string;

  // 10. 하루를 마감하는 저녁 축복 기도문
  eveningPrayerTitle: string;
  eveningPrayerBody: string;
  eveningBlessingLine: string;
}

export interface BibleResultData {
  lang: Language;
  user: UserProfile;
  lifeStage: LifeStageInfo;
  todayDateText: string;
  todayTheme: string;
  themeSubtitle: string;
  spiritualScore: number;

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

  // 5~6. 기독교인이 오늘 해야 할 일 (찬양, 감사, 영적 습관)
  christianDaily: {
    recommendedPraise: RecommendedPraise;
    gratitudePrompt: string;
    spiritualHabit: string;
    readingSuggestion: string;
  };

  // 7~10. 보상형 광고 시청 후 열리는 심층 은혜 4가지
  bonus: BonusGraceData;

  metrics: FaceMetrics;
  source: 'local-engine' | 'gemini-api';
}

export interface AppSettings {
  engine: 'local' | 'gemini';
  geminiApiKey: string;
  geminiModel: string;
}
