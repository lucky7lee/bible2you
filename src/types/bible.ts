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

export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type DailyRhythmType = 'support' | 'harmony' | 'express' | 'refine' | 'growth';

export interface GraceColorInfo {
  name: string;
  hex: string;
  meaning: string;
  reminderText: string;
}

export interface CreationProvidenceData {
  // 내부 계산 키 (화면에는 노출하지 않고 개인화 시드/해석에만 활용)
  birthElement: FiveElement;
  todayElement: FiveElement;
  rhythmType: DailyRhythmType;
  constellationIndex: number;

  // 화면에 기독교적 프레임으로 노출되는 4대 창조 섭리 요소
  spiritualWeatherTitle: string;     // 오늘의 영적 기상도 (예: '맑고 포근한 봄바람의 결')
  temperamentBadge: string;          // 창조 기질 배지 (예: '생명과 성장의 결')
  heartClimateSummary: string;       // ① 오늘의 마음 기후와 창조 기질 풀이
  nightSkyTitle: string;             // ② 밤하늘의 시편 (계절의 별과 창조 묵상)
  nightSkyMeditation: string;        // 성경 속 별과 하늘의 질서 묵상
  graceColor: GraceColorInfo;        // ③ 오늘의 묵상 컬러 (Grace Color)
  spiritualAnchorTitle: string;      // ④ 오늘의 영적 닻 (Spiritual Anchor)
  spiritualAnchorGuide: string;      // 마음을 붙잡아 줄 작은 영적 습관/매개체
  verseConnectionLine: string;       // "지금 당신의 마음에 ~하기 때문에 이 말씀을 드립니다" 연결 문장
}

export interface BonusGraceData {
  // 7. 연관 성경 구절 & 성경 인물 이야기
  companionVerseRef: string;
  companionVerseText: string;
  biblicalFigureName: string;
  biblicalFigureStory: string;

  // 8. 오늘의 창조 기질 심층 풀이 & 시간대별 영적 기상도 (오전/오후/저녁)
  temperamentDeepInsight?: string;
  timeRhythm?: {
    morning: string;
    afternoon: string;
    evening: string;
  };

  // 9. 오늘의 이웃 사랑 가이드 & 일터·청지기 지혜
  relationshipWisdom: string;
  workWisdom: string;

  // 10. 오늘의 감사 키워드 3가지 & 마음 다스림
  gratitudeSeeds: string[];
  peaceTip: string;

  // 11. 하루를 마감하는 저녁 축복 기도문
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

  // 창조 섭리와 기질 묵상 (생년월일·계절·하늘의 질서 기반 기독교적 개인화)
  providence?: CreationProvidenceData;

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
