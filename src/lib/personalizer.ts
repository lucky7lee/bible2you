import {
  ChristianTitle,
  DailyActionItem,
  FaceFeatureDetails,
  FaceMetrics,
  Gender,
  Language,
  LifeStageInfo,
  RecommendedPraise,
  UserProfile,
} from '../types/bible';
import { getLocalDateKey } from './todayStorage';
import { CatalogVerseEntry, VERSE_CATALOG } from './verseCatalog';
import {
  ACTION_POOL_EN,
  ACTION_POOL_KO,
  CORE_MISSIONS_EN,
  CORE_MISSIONS_KO,
  QUESTIONS_EN,
  QUESTIONS_KO,
} from './poolsQuestionsActions';
import {
  HABIT_POOL_EN,
  HABIT_POOL_KO,
  PRAISE_POOL_EN,
  PRAISE_POOL_KO,
  PRAYER_CLOSINGS_EN,
  PRAYER_CLOSINGS_KO,
  PRAYER_MIDDLES_EN,
  PRAYER_MIDDLES_KO,
  PRAYER_OPENINGS_EN,
  PRAYER_OPENINGS_KO,
  PRAYER_TITLES_EN,
  PRAYER_TITLES_KO,
  READING_POOL_EN,
  READING_POOL_KO,
} from './poolsExtras';

const RECENT_VERSES_KEY = 'daybible2u_recent_verses_v2';
const ANTI_REPEAT_DAYS = 60;

interface RecentVerseRecord {
  dateKey: string;
  verseId: string;
}

// 결정론적 해시 (시드 생성)
export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

// 최근 60일 사용된 구절 목록 로드
function loadRecentVerses(): RecentVerseRecord[] {
  try {
    const raw =
      localStorage.getItem(RECENT_VERSES_KEY) ||
      localStorage.getItem('daybible2u_recent_verses_v1');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-ANTI_REPEAT_DAYS);
  } catch {
    return [];
  }
}

// 오늘 선택된 구절 이력 저장 (같은 날이면 갱신, 최근 60일 유지)
function recordVerseUsed(dateKey: string, verseId: string): void {
  try {
    const list = loadRecentVerses().filter((r) => r.dateKey !== dateKey);
    list.push({ dateKey, verseId });
    localStorage.setItem(RECENT_VERSES_KEY, JSON.stringify(list.slice(-ANTI_REPEAT_DAYS)));
  } catch {
    // ignore
  }
}

// 최근 60일 중복을 피하면서 180개 성경 구절 중 오늘의 말씀 선정
export function pickDailyVerse(
  mood: FaceMetrics['dominantMood'],
  seed: number,
  dateKey: string
): CatalogVerseEntry {
  const recent = loadRecentVerses();
  // 어제 이전 최대 60일 동안 나온 구절 ID들 (같은 날 재스캔은 허용)
  const pastUsedIds = new Set(
    recent.filter((r) => r.dateKey !== dateKey).map((r) => r.verseId)
  );

  // 1순위: 현재 얼굴/상태 테마와 일치하면서 최근 60일간 안 나온 구절 (테마당 30개)
  const moodMatches = VERSE_CATALOG.filter((v) => v.mood === mood);
  const freshMoodMatches = moodMatches.filter((v) => !pastUsedIds.has(v.id));

  let chosen: CatalogVerseEntry;
  if (freshMoodMatches.length > 0) {
    chosen = freshMoodMatches[seed % freshMoodMatches.length];
  } else {
    // 2순위: 해당 테마 30개가 최근 60일 내 다 나왔다면 전체 180개 중 최근 60일간 안 나온 구절로 확장
    const freshAny = VERSE_CATALOG.filter((v) => !pastUsedIds.has(v.id));
    if (freshAny.length > 0) {
      chosen = freshAny[seed % freshAny.length];
    } else {
      chosen = moodMatches[seed % moodMatches.length] || VERSE_CATALOG[seed % VERSE_CATALOG.length];
    }
  }

  recordVerseUsed(dateKey, chosen.id);
  return chosen;
}

// =========================================================================
// 1. 얼굴 이목구비 형태 설명 사전 (쉬운 현대어 + 자연스러운 영어)
// =========================================================================
const FACE_FEATURE_PHRASES_KO = {
  faceShape: {
    oval: '부드럽게 균형 잡힌 계란형 얼굴선',
    round: '친근하고 복스러운 둥근 얼굴선',
    angular: '믿음직스럽고 의지가 느껴지는 단단한 얼굴선',
    long: '차분하고 세련된 분위기의 길쭉한 얼굴선',
    heart: '생기 있고 밝은 인상의 하트형 얼굴선',
  },
  eyeShape: {
    bright: '맑고 에너지가 느껴지는 또렷한 눈매',
    gentle: '사람을 편안하게 만드는 부드럽고 선한 눈매',
    focused: '생각이 깊고 집중력이 돋보이는 차분한 눈매',
    smiling: '보기만 해도 기분 좋아지는 웃음 띤 눈매',
  },
  eyebrowShape: {
    arch: '유연하고 따뜻한 느낌의 아치형 눈썹',
    straight: '반듯하고 정직한 성품이 보이는 일자 눈썹',
    strong: '추진력과 결단력이 느껴지는 선명한 눈썹',
    soft: '여유롭고 너그러운 인상의 완만한 눈썹',
  },
  noseShape: {
    generous: '듬직하고 넉넉한 복이 느껴지는 코',
    defined: '자기 중심이 바르게 잡힌 오똑하고 곧은 코',
    balanced: '전체 얼굴의 중심을 안정감 있게 잡아주는 단정한 코',
  },
  mouthShape: {
    wideSmile: '시원하게 열려 좋은 말을 많이 전할 환한 입매',
    warm: '다정하고 따뜻한 위로가 어울리는 부드러운 입매',
    calm: '신중하고 진심 어린 말을 담는 단정한 입매',
  },
  balance: {
    forehead: '시원하게 트인 이마에서 좋은 아이디어와 지혜가 느껴지는 인상',
    middle: '눈과 코의 중심이 살아 있어 실행력이 돋보이는 인상',
    lower: '입과 턱선이 안정적이어서 끝까지 해내는 끈기가 보이는 인상',
    harmony: '이마·눈코·입턱의 비율이 고르게 어우러진 편안한 인상',
  },
};

const FACE_FEATURE_PHRASES_EN = {
  faceShape: {
    oval: 'a softly balanced oval face shape',
    round: 'a warm, approachable round face shape',
    angular: 'a steady, dependable jawline',
    long: 'a calm, thoughtful face profile',
    heart: 'a bright, lively heart-shaped contour',
  },
  eyeShape: {
    bright: 'clear, energetic eyes',
    gentle: 'kind eyes that put others at ease',
    focused: 'steady, attentive eyes',
    smiling: 'warm eyes carrying a natural smile',
  },
  eyebrowShape: {
    arch: 'gentle arched brows',
    straight: 'honest, steady brows',
    strong: 'determined, expressive brows',
    soft: 'relaxed, easygoing brows',
  },
  noseShape: {
    generous: 'a warm, generous expression at the center of your face',
    defined: 'a clear, focused profile',
    balanced: 'well-balanced features',
  },
  mouthShape: {
    wideSmile: 'an open, cheerful smile ready to encourage others',
    warm: 'a kind, welcoming smile',
    calm: 'a composed, sincere expression',
  },
  balance: {
    forehead: 'an open forehead reflecting clear thought',
    middle: 'strong focus and drive in your expression',
    lower: 'steady endurance and follow-through',
    harmony: 'well-rounded harmony across your features',
  },
};

// =========================================================================
// 2. 성별 & 직분별 맞춤 격려 문구 (쉬운 현대어 + 영어)
// =========================================================================
const ROLE_CONTEXT_KO: Record<ChristianTitle, { male: string; female: string }> = {
  성도: {
    male: '가정과 일상 속에서 묵묵히 믿음을 지켜가는 모습',
    female: '일상의 작은 자리마다 따뜻한 믿음의 향기를 채워가는 모습',
  },
  청년: {
    male: '앞날의 진로와 꿈을 향해 힘차게 도전하는 청년의 발걸음',
    female: '새로운 가능성과 소망을 품고 걸어가는 청년의 빛나는 하루',
  },
  형제: {
    male: '주변 사람들에게 든든한 힘이 되어 주는 믿음직한 발걸음',
    female: '주변 사람들에게 든든한 힘이 되어 주는 믿음직한 발걸음',
  },
  자매: {
    male: '섬세하고 따뜻한 마음으로 주변을 돌보는 아름다운 발걸음',
    female: '섬세하고 따뜻한 마음으로 주변을 돌보는 아름다운 발걸음',
  },
  집사: {
    male: '교회와 일터에서 성실하게 맡겨진 자리를 섬기는 충성된 모습',
    female: '교회와 가정에서 부지런히 사랑으로 섬기는 귀한 손길',
  },
  안수집사: {
    male: '공동체의 든든한 기둥으로 묵묵히 책임을 감당하는 믿음직한 모습',
    female: '공동체의 든든한 기둥으로 묵묵히 책임을 감당하는 믿음직한 모습',
  },
  권사: {
    male: '깊은 기도와 따뜻한 품으로 이웃을 세워주는 귀한 섬김',
    female: '깊은 기도와 따뜻한 어머니 같은 품으로 주변을 세워주는 귀한 섬김',
  },
  장로: {
    male: '오랜 믿음의 연륜과 지혜로 본을 보이며 공동체를 지키는 든든한 모습',
    female: '오랜 믿음의 연륜과 지혜로 본을 보이며 공동체를 지키는 든든한 모습',
  },
  사모: {
    male: '보이지 않는 자리에서 기도와 사랑으로 동역하는 귀한 헌신',
    female: '보이지 않는 자리에서 기도와 사랑으로 묵묵히 동역하는 귀한 헌신',
  },
  목회자: {
    male: '말씀과 기도로 많은 영혼을 돌보며 앞장서 걸어가는 사명의 발걸음',
    female: '말씀과 기도로 많은 영혼을 돌보며 앞장서 걸어가는 사명의 발걸음',
  },
};

const ROLE_CONTEXT_EN: Record<ChristianTitle, { male: string; female: string }> = {
  성도: {
    male: 'your steady walk of faith in everyday life',
    female: 'the warm grace you bring to everyday moments',
  },
  청년: {
    male: 'your bold steps toward your calling and future',
    female: 'your bright hopes and fresh steps of faith',
  },
  형제: {
    male: 'your dependable strength and encouragement to others',
    female: 'your dependable strength and encouragement to others',
  },
  자매: {
    male: 'your thoughtful care and gentle warmth toward others',
    female: 'your thoughtful care and gentle warmth toward others',
  },
  집사: {
    male: 'your faithful service in both church and workplace',
    female: 'your generous, caring hands serving home and church',
  },
  안수집사: {
    male: 'your steady leadership as a pillar of your community',
    female: 'your steady leadership as a pillar of your community',
  },
  권사: {
    male: 'your faithful prayers and warm encouragement for others',
    female: 'your faithful prayers and warm, nurturing spirit',
  },
  장로: {
    male: 'your seasoned wisdom and steady example of faith',
    female: 'your seasoned wisdom and steady example of faith',
  },
  사모: {
    male: 'your quiet devotion and faithful prayers behind the scenes',
    female: 'your quiet devotion and faithful prayers behind the scenes',
  },
  목회자: {
    male: 'your dedicated calling to shepherd and care for souls',
    female: 'your dedicated calling to shepherd and care for souls',
  },
};

// =========================================================================
// 3. 맞춤형 진단 문장 조합 빌더 (얼굴 스캔 vs 스캔없이 진행)
// =========================================================================
export function buildPersonalizedDiagnosis(
  displayName: string,
  user: UserProfile,
  lifeStage: LifeStageInfo,
  metrics: FaceMetrics,
  seed: number,
  lang: Language
): string {
  const gender: Gender = user.gender || 'male';
  const title: ChristianTitle = user.title || '성도';

  if (metrics.isSkippedScan || !metrics.faceFeatures) {
    // 스캔없이 진행: 이름, 성별, 나이, 직분, 오늘 요일만으로 다채롭게 조합
    const roleMsg =
      lang === 'en' ? ROLE_CONTEXT_EN[title][gender] : ROLE_CONTEXT_KO[title][gender];

    if (lang === 'en') {
      const openings = [
        `Today, God sees ${roleMsg} as a ${lifeStage.stage.toLowerCase()} (age ${lifeStage.age}).`,
        `Thinking of ${displayName}'s season as a ${lifeStage.stage.toLowerCase()} (age ${lifeStage.age}), today’s Scripture speaks directly to ${roleMsg}.`,
        `On this new day, the Lord warmly encourages ${displayName} in ${roleMsg}.`,
      ];
      return `${openings[seed % openings.length]} ${lifeStage.stageMessage}`;
    }

    const openingsKo = [
      `오늘 ${displayName}의 소중한 나이(${lifeStage.stage}, 만 ${lifeStage.age}세)와 ${roleMsg}을 하나님께서 따뜻하게 지켜보고 계십니다.`,
      `새로운 하루를 여는 ${displayName}(${lifeStage.stage}, 만 ${lifeStage.age}세)의 ${roleMsg} 위에 주님이 꼭 필요한 말씀을 보내주셨습니다.`,
      `${displayName}이 오늘 살아가는 ${lifeStage.stage}(만 ${lifeStage.age}세)의 자리와 ${roleMsg}을 응원하며 오늘의 말씀을 준비했습니다.`,
    ];
    return `${openingsKo[seed % openingsKo.length]} ${lifeStage.stageMessage}`;
  }

  // 얼굴 스캔 진행 시: 실제 이목구비(얼굴형, 눈, 눈썹, 코, 입, 균형) + 표정 + 성별/직분 조합!
  const f: FaceFeatureDetails = metrics.faceFeatures;
  const roleMsg =
    lang === 'en' ? ROLE_CONTEXT_EN[title][gender] : ROLE_CONTEXT_KO[title][gender];

  if (lang === 'en') {
    const p = FACE_FEATURE_PHRASES_EN;
    const featurePool = [
      p.faceShape[f.faceShapeKey],
      p.eyeShape[f.eyeShapeKey],
      p.eyebrowShape[f.eyebrowShapeKey],
      p.noseShape[f.noseShapeKey],
      p.mouthShape[f.mouthShapeKey],
      p.balance[f.balanceKey],
    ];
    const f1 = featurePool[seed % featurePool.length];
    const f2 = featurePool[(seed + 2) % featurePool.length];

    const moodTail: Record<FaceMetrics['dominantMood'], string[]> = {
      rest: [
        `Behind ${f1} and ${f2}, there is honest tiredness from giving your best. Today, God invites you to pause and rest deeply in Him.`,
        `Your scan shows ${f1} paired with ${f2}. You have worked faithfully—let the Lord refresh your spirit today.`,
      ],
      joy: [
        `Your ${f1} and ${f2} radiate genuine warmth today. May your bright energy bless everyone around you.`,
        `With ${f1} and ${f2}, your cheerful countenance shines brightly—carry that gratitude into ${roleMsg}.`,
      ],
      courage: [
        `Your ${f1} and ${f2} reflect quiet determination today. Step forward boldly in ${roleMsg} knowing God walks with you.`,
        `There is real focus in your ${f2} and ${f1}. Trust the Lord to back every brave step you take today.`,
      ],
      wisdom: [
        `Your ${f1} and ${f2} reveal a thoughtful, discerning spirit today. Invite God into every choice before you.`,
        `With ${f2} and ${f1}, you are ready for clear judgment today—ask God freely for wisdom in ${roleMsg}.`,
      ],
      love: [
        `Your ${f1} and ${f2} carry genuine kindness today. Your gentle words can bring real comfort in ${roleMsg}.`,
        `There is welcoming warmth in your ${f2} and ${f1}. Let Christ’s love flow naturally through you today.`,
      ],
      peace: [
        `Your ${f1} and ${f2} show a calm, grounded spirit today. Guard that peace as you walk through ${roleMsg}.`,
        `With ${f1} and ${f2}, God’s quiet shalom rests upon you today—move at an unhurried, trusting pace.`,
      ],
    };

    const options = moodTail[metrics.dominantMood] || moodTail.peace;
    return options[(seed >> 2) % options.length];
  }

  // 한국어: 자연스럽고 다정한 현대어 이목구비 + 표정 + 직분 조합
  const p = FACE_FEATURE_PHRASES_KO;
  const featurePool = [
    p.faceShape[f.faceShapeKey],
    p.eyeShape[f.eyeShapeKey],
    p.eyebrowShape[f.eyebrowShapeKey],
    p.noseShape[f.noseShapeKey],
    p.mouthShape[f.mouthShapeKey],
    p.balance[f.balanceKey],
  ];
  const f1 = featurePool[seed % featurePool.length];
  const f2 = featurePool[(seed + 2) % featurePool.length];

  const moodTailKo: Record<FaceMetrics['dominantMood'], string[]> = {
    rest: [
      `오늘 ${displayName}의 ${f1}과 ${f2} 속에 성실하게 애써온 피로가 살짝 비칩니다. ${roleMsg}을 잘 감당하시느라 수고가 많으셨어요. 오늘은 무리하지 말고 주님 안에서 잠깐 숨을 고르며 편안히 쉬어가세요.`,
      `스캔된 ${displayName}의 ${f2}에서 요즘 마음과 몸이 조금 지쳐 있음이 느껴집니다. ${f1}이 주는 편안함처럼, 오늘만큼은 무거운 짐을 주님께 내려놓고 넉넉한 위로를 누리시길 축복합니다.`,
    ],
    joy: [
      `오늘 ${displayName}의 ${f1}과 ${f2}에서 기분 좋은 밝은 에너지가 환하게 전해집니다! ${roleMsg} 가운데 넘치는 감사와 미소가 주변 사람들까지 행복하게 만드는 복된 하루가 될 것입니다.`,
      `${displayName}의 ${f2}와 ${f1}이 오늘 유난히 밝고 생기 있어 보입니다. 하나님이 주신 이 즐거운 마음을 소중히 간직하며, 만나는 이들에게 따뜻한 응원을 나눠 보세요.`,
    ],
    courage: [
      `오늘 ${displayName}의 ${f1}과 ${f2}에서 어떤 일도 해낼 수 있을 것 같은 단단한 의지가 느껴집니다. ${roleMsg} 앞에서 망설이지 말고, 함께하시는 하나님을 믿으며 힘차게 한 걸음 내딛어 보세요.`,
      `${displayName}의 ${f2} 속에 새로운 도전을 향한 맑은 결단이 보입니다. ${f1}이 주는 든든함처럼, 오늘 마주하는 일들마다 주님이 지혜와 용기를 넉넉히 채워주실 것입니다.`,
    ],
    wisdom: [
      `오늘 ${displayName}의 ${f1}과 ${f2}에서 깊이 생각하고 바르게 판단하려는 진중한 분위기가 느껴집니다. ${roleMsg}에서 고민되는 선택이 있다면 혼자 애쓰지 말고 주님께 지혜를 구해 보세요.`,
      `스캔된 ${displayName}의 ${f2}와 ${f1}은 차분하고 맑은 집중력을 보여줍니다. 오늘 서두르지 않고 한 번 더 생각하며 주님께 여쭐 때 가장 좋은 길이 열릴 것입니다.`,
    ],
    love: [
      `오늘 ${displayName}의 ${f1}과 ${f2}에서 사람을 편안하게 해주는 따뜻한 온기가 느껴집니다. ${roleMsg} 속에서 건네는 다정한 말 한마디가 누군가에게 큰 힘이 되는 하루가 될 것입니다.`,
      `${displayName}의 ${f2}와 ${f1}이 참 부드럽고 친근합니다. 오늘 주변의 가족이나 이웃에게 먼저 웃으며 안부를 건넬 때, 주님의 사랑이 자연스럽게 흘러갈 것입니다.`,
    ],
    peace: [
      `오늘 ${displayName}의 ${f1}과 ${f2}에서 흔들리지 않는 차분하고 안정된 평안이 느껴집니다. ${roleMsg} 가운데 바쁜 일이 생기더라도 이 고요한 중심을 잃지 않고 평온하게 하루를 보내세요.`,
      `스캔된 ${displayName}의 ${f2}와 ${f1}은 편안하고 조화로운 상태를 보여줍니다. 오늘 마음에 잔잔히 흐르는 하나님의 평강을 누리면서 감사함으로 하루를 채워 보세요.`,
    ],
  };

  const optionsKo = moodTailKo[metrics.dominantMood] || moodTailKo.peace;
  return optionsKo[(seed >> 2) % optionsKo.length];
}

// =========================================================================
// 4. 대규모 묵상 질문 풀 (5배 확장: 150개 중 매일 중복 없이 3개 조합)
// =========================================================================
export function pickDailyQuestions(
  mood: FaceMetrics['dominantMood'],
  seed: number,
  lang: Language
): string[] {
  const pool = lang === 'en' ? QUESTIONS_EN[mood] : QUESTIONS_KO[mood];
  const result: string[] = [];
  const used = new Set<number>();
  const stride = (seed % 7) + 3; // 3~9 사이의 서로소 간격으로 매일 다른 조합
  let cursor = seed % pool.length;
  while (result.length < 3 && used.size < pool.length) {
    const idx = cursor % pool.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(pool[idx]);
    }
    cursor += stride;
  }
  return result;
}

// =========================================================================
// 5. 대규모 실천 과제 풀 (5배 확장: 핵심 미션 90개 + 일상 과제 75개 중 3개 조합)
// =========================================================================
export function pickDailyActions(
  mood: FaceMetrics['dominantMood'],
  seed: number,
  lang: Language
): { coreMission: string; items: DailyActionItem[] } {
  const missions = lang === 'en' ? CORE_MISSIONS_EN[mood] : CORE_MISSIONS_KO[mood];
  const coreMission = missions[(seed >>> 1) % missions.length];

  const pool = lang === 'en' ? ACTION_POOL_EN : ACTION_POOL_KO;
  const chosen: DailyActionItem[] = [];
  const usedIdx = new Set<number>();
  const stride = ((seed >>> 3) % 11) + 7; // 7~17 간격으로 매일 새로운 3가지 조합
  let cursor = seed % pool.length;
  while (chosen.length < 3 && usedIdx.size < pool.length) {
    const idx = cursor % pool.length;
    if (!usedIdx.has(idx)) {
      usedIdx.add(idx);
      chosen.push(pool[idx]);
    }
    cursor += stride;
  }
  return { coreMission, items: chosen };
}

// =========================================================================
// 6. 조합형 1분 기도문 빌더 (5배 확장: 제목 60 × 도입 15 × 본문 60 × 맺음 10 = 수만 가지)
// =========================================================================
export function buildPersonalizedPrayer(
  displayName: string,
  user: UserProfile,
  lifeStage: LifeStageInfo,
  mood: FaceMetrics['dominantMood'],
  verseKeyword: string,
  seed: number,
  lang: Language
): { title: string; body: string } {
  const gender: Gender = user.gender || 'male';
  const title: ChristianTitle = user.title || '성도';

  if (lang === 'en') {
    const titles = PRAYER_TITLES_EN[mood] || PRAYER_TITLES_EN.peace;
    const openings = PRAYER_OPENINGS_EN(displayName, lifeStage.stage, lifeStage.age);
    const rolePrayers = `Bless ${ROLE_CONTEXT_EN[title][gender]} today, and guide every conversation and responsibility.`;
    const middles = PRAYER_MIDDLES_EN[mood] || PRAYER_MIDDLES_EN.peace;
    const closings = PRAYER_CLOSINGS_EN(verseKeyword);

    return {
      title: titles[seed % titles.length],
      body: `${openings[(seed >>> 1) % openings.length]} ${rolePrayers} ${
        middles[(seed >>> 3) % middles.length]
      } ${closings[(seed >>> 5) % closings.length]}`,
    };
  }

  const titlesKo = PRAYER_TITLES_KO[mood] || PRAYER_TITLES_KO.peace;
  const openingsKo = PRAYER_OPENINGS_KO(displayName, lifeStage.stage, lifeStage.age);
  const rolePrayersKo = `특별히 ${ROLE_CONTEXT_KO[title][gender]} 위에 주님의 은혜를 더해 주시고, 오늘 만나는 모든 사람들과 일들 가운데 함께해 주세요.`;
  const middlesKo = PRAYER_MIDDLES_KO[mood] || PRAYER_MIDDLES_KO.peace;
  const closingsKo = PRAYER_CLOSINGS_KO(verseKeyword);

  return {
    title: titlesKo[seed % titlesKo.length],
    body: `${openingsKo[(seed >>> 1) % openingsKo.length]} ${rolePrayersKo} ${
      middlesKo[(seed >>> 3) % middlesKo.length]
    } ${closingsKo[(seed >>> 5) % closingsKo.length]}`,
  };
}

// =========================================================================
// 7. 추천 찬양 (60곡), 영적 습관 (60개), 추천 성경 읽기 (70개) 풀 (5배 확장)
// =========================================================================
export function pickDailyExtras(seed: number, lang: Language): {
  praise: RecommendedPraise;
  habit: string;
  reading: string;
} {
  const praises = lang === 'en' ? PRAISE_POOL_EN : PRAISE_POOL_KO;
  const habits = lang === 'en' ? HABIT_POOL_EN : HABIT_POOL_KO;
  const readings = lang === 'en' ? READING_POOL_EN : READING_POOL_KO;
  return {
    praise: praises[seed % praises.length],
    habit: habits[(seed >>> 2) % habits.length],
    reading: readings[(seed >>> 4) % readings.length],
  };
}

export function getTodayLocalKey(): string {
  return getLocalDateKey();
}
