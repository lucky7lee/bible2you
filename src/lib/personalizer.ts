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

const RECENT_VERSES_KEY = 'daybible2u_recent_verses_v1';

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

// 최근 14일 사용된 구절 목록 로드
function loadRecentVerses(): RecentVerseRecord[] {
  try {
    const raw = localStorage.getItem(RECENT_VERSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-14);
  } catch {
    return [];
  }
}

// 오늘 선택된 구절 이력 저장 (같은 날이면 갱신)
function recordVerseUsed(dateKey: string, verseId: string): void {
  try {
    const list = loadRecentVerses().filter((r) => r.dateKey !== dateKey);
    list.push({ dateKey, verseId });
    localStorage.setItem(RECENT_VERSES_KEY, JSON.stringify(list.slice(-14)));
  } catch {
    // ignore
  }
}

// 최근 14일 중복을 피하면서 오늘의 성경 구절 선정
export function pickDailyVerse(
  mood: FaceMetrics['dominantMood'],
  seed: number,
  dateKey: string
): CatalogVerseEntry {
  const recent = loadRecentVerses();
  // 어제 이전 14일 동안 나온 구절 ID들 (같은 날 재스캔은 허용)
  const pastUsedIds = new Set(
    recent.filter((r) => r.dateKey !== dateKey).map((r) => r.verseId)
  );

  // 1순위: 현재 얼굴/상태 테마와 일치하면서 최근에 안 나온 구절
  const moodMatches = VERSE_CATALOG.filter((v) => v.mood === mood);
  const freshMoodMatches = moodMatches.filter((v) => !pastUsedIds.has(v.id));

  let chosen: CatalogVerseEntry;
  if (freshMoodMatches.length > 0) {
    chosen = freshMoodMatches[seed % freshMoodMatches.length];
  } else {
    // 2순위: 해당 테마가 최근 다 나왔다면 전체 36개 중 최근 안 나온 구절로 확장
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
// 4. 대규모 묵상 질문 풀 (매일 3개 조합)
// =========================================================================
const QUESTIONS_KO: Record<FaceMetrics['dominantMood'], string[]> = {
  rest: [
    '요즘 내 마음을 가장 무겁게 누르고 있는 고민은 무엇인가요?',
    '오늘 하루 동안 나 스스로에게 허락해 줄 10분의 휴식은 언제 가질까요?',
    '내가 꼭 붙잡고 애쓰지 않아도 주님께 맡길 수 있는 일은 무엇인가요?',
    '최근 나를 가장 지치게 했던 생각이나 습관은 무엇이었나요?',
    '오늘 저녁 잠들기 전, 가장 먼저 내려놓고 싶은 걱정은 무엇인가요?',
  ],
  joy: [
    '오늘 아침 눈을 떴을 때 가장 고맙게 느껴진 일은 무엇인가요?',
    '당연하게 여기고 지나쳤지만 사실은 큰 감사였던 일상은 무엇인가요?',
    '오늘 내 안의 기분 좋은 에너지를 누구에게 가장 먼저 나눠줄까요?',
    '최근 내 마음을 웃게 만들었던 작은 순간은 언제였나요?',
    '오늘 하루 불평 대신 감사를 선택할 수 있는 상황은 무엇일까요?',
  ],
  courage: [
    '지금 망설이거나 미루고 있는 일 중 오늘 시작해 볼 한 가지는 무엇인가요?',
    '사람들의 시선이나 걱정 때문에 주저했던 일은 무엇이었나요?',
    '하나님이 내 편이시라는 사실을 기억하면 어떤 마음이 달라지나요?',
    '지난날 어려웠지만 결국 잘 이겨냈던 경험 중 감사한 기억은 무엇인가요?',
    '오늘 믿음으로 한 걸음만 먼저 내딛어 볼 용기 있는 선택은 무엇일까요?',
  ],
  wisdom: [
    '요즘 결정을 내리기 어려워 고민 중인 문제는 무엇인가요?',
    '내 고집이나 조급함 대신 한 번 더 기도하며 기다려야 할 일은 무엇인가요?',
    '오늘 만나는 사람들의 이야기에서 내가 놓치지 말고 귀 기울여야 할 부분은 무엇일까요?',
    '지금 내 삶에서 가장 우선순위를 두어야 할 소중한 일은 무엇인가요?',
    '오늘 하루 정직하고 바른 기준을 지키기 위해 신경 써야 할 선택은 무엇인가요?',
  ],
  love: [
    '오늘 내가 먼저 따뜻한 안부나 고마움을 전하고 싶은 사람은 누구인가요?',
    '요즘 조금 서운했거나 이해하기 어려웠던 사람을 위해 짧게 기도해 볼 수 있을까요?',
    '말로만 아니라 작은 행동으로 사랑을 보여줄 수 있는 기회는 어디에 있을까요?',
    '가족이나 동료에게 최근 칭찬해 주지 못했던 장점은 무엇인가요?',
    '오늘 짜증이 날 수 있는 순간에 한 번 더 부드럽게 말하려면 어떻게 할까요?',
  ],
  peace: [
    '오늘 내 마음의 평안을 흔들려고 하는 작은 걱정은 무엇인가요?',
    '바쁜 일정 속에서 잠시 멈춰 하나님을 떠올릴 수 있는 시간은 언제인가요?',
    '결과에 대한 불안 대신 오늘 내가 성실히 할 수 있는 과정은 무엇인가요?',
    '최근 마음에 깊은 평안을 느꼈던 순간은 언제였나요?',
    '오늘 하루 나의 차분한 태도가 누구에게 편안함을 줄 수 있을까요?',
  ],
};

const QUESTIONS_EN: Record<FaceMetrics['dominantMood'], string[]> = {
  rest: [
    'What weight feels heaviest on your heart right now?',
    'When can you carve out 10 quiet, phone-free minutes to breathe today?',
    'Which responsibility can you safely hand over to God instead of forcing alone?',
    'What habit or worry has been draining your energy most lately?',
    'What concern do you want to lay down before sleeping tonight?',
  ],
  joy: [
    'What simple gift made you grateful when you woke up today?',
    'What ordinary blessing have you recently overlooked?',
    'Who can you brighten with a warm word of thanks today?',
    'What small moment brought a genuine smile to your face recently?',
    'Where can you choose gratitude instead of frustration today?',
  ],
  courage: [
    'What delayed task can you take the first small step on today?',
    'Where has fear of others’ opinions held you back lately?',
    'How does remembering "God is with me" change your view of today’s challenge?',
    'What past hurdle has God already helped you overcome?',
    'What one brave, faithful choice can you make today?',
  ],
  wisdom: [
    'What decision feels unclear or heavy on your mind right now?',
    'Where should you pause and pray instead of rushing ahead?',
    'Whose perspective do you need to listen to more patiently today?',
    'What truly deserves your top priority today?',
    'What honest, wise choice can you make in a small matter today?',
  ],
  love: [
    'Who deserves a warm check-in or thank-you message from you today?',
    'Can you say a brief prayer of blessing for someone who frustrated you?',
    'What small, unseen act of kindness can you do today?',
    'What strength in a family member or coworker can you praise today?',
    'How can you answer gently if a tense moment arises today?',
  ],
  peace: [
    'What small worry is trying to disturb your calm today?',
    'When can you pause for 2 still minutes with God amid your schedule?',
    'How can you focus on faithful effort today instead of anxious outcomes?',
    'When did you last feel God’s steady peace in a busy week?',
    'How can your calm presence bring comfort to someone today?',
  ],
};

export function pickDailyQuestions(
  mood: FaceMetrics['dominantMood'],
  seed: number,
  lang: Language
): string[] {
  const pool = lang === 'en' ? QUESTIONS_EN[mood] : QUESTIONS_KO[mood];
  const result: string[] = [];
  for (let i = 0; i < 3; i++) {
    result.push(pool[(seed + i * 2) % pool.length]);
  }
  return result;
}

// =========================================================================
// 5. 대규모 실천 과제 풀 (매일 중복 없이 3가지 + 핵심 미션 조합)
// =========================================================================
const CORE_MISSIONS_KO: Record<FaceMetrics['dominantMood'], string[]> = {
  rest: [
    '오늘 오후 딱 10분, 휴대폰을 내려놓고 편안히 호흡하며 기도하기',
    '걱정이 떠오를 때마다 "주님께 맡깁니다"라고 짧게 말하고 어깨 힘 풀기',
    '스스로를 너무 몰아붙이지 말고 오늘 꼭 안 해도 될 일 하나 내려놓기',
  ],
  joy: [
    '오늘 만나는 사람들에게 환한 미소로 먼저 인사하고 고마움 전하기',
    '불평이 나오려 할 때 곧바로 감사한 일 3가지 떠올려 보기',
    '오늘 하루 나에게 일어난 기분 좋은 순간 하나를 사진이나 메모로 남기기',
  ],
  courage: [
    '미루어 두었던 일 중 가장 중요한 한 가지를 기도로 바로 시작하기',
    '부담되는 일정 앞에서 30초간 "주님, 힘과 지혜를 주세요" 기도하고 임하기',
    '주눅 들지 않고 당당한 자세와 밝은 목소리로 오늘 하루 보내기',
  ],
  wisdom: [
    '중요한 결정을 내리기 전 1분만 멈춰서 주님의 지혜를 구하기',
    '말하기보다 상대방의 이야기를 끝까지 차분히 들어주기',
    '오늘 할 일 중 가장 중요한 핵심 3가지만 종이에 적어 순서대로 하기',
  ],
  love: [
    '가족이나 가까운 지인 1명에게 진심 어린 감사·응원 메시지 보내기',
    '마음에 걸렸던 사람을 위해 10초간 축복 기도 올려드리기',
    '주변 사람이 알아채지 못해도 좋은 작은 배려 한 가지 실천하기',
  ],
  peace: [
    '바쁜 일상 중에 3분만 눈을 감고 조용히 마음의 속도 늦추기',
    '조급한 마음이 들 때 숨을 천천히 내쉬며 평안한 어조 유지하기',
    '오늘 주신 성경 말씀 한 구절을 마음속으로 3번 천천히 되새기기',
  ],
};

const CORE_MISSIONS_EN: Record<FaceMetrics['dominantMood'], string[]> = {
  rest: [
    'Put down your phone for 10 quiet minutes today and rest in prayer.',
    'Whenever stress rises, unclench your shoulders and whisper, "Lord, I trust You."',
    'Release one non-essential task today and give yourself room to breathe.',
  ],
  joy: [
    'Greet someone first with a warm smile and a sincere word of thanks.',
    'Trade any urge to complain today for three quick words of gratitude.',
    'Capture one joyful ordinary moment today in a note or photo.',
  ],
  courage: [
    'Start one delayed task today right after a 30-second prayer for strength.',
    'Walk into your biggest responsibility today declaring, "God is with me."',
    'Speak clearly and step forward with calm confidence today.',
  ],
  wisdom: [
    'Pause for 1 quiet minute to pray for wisdom before a key choice today.',
    'Listen fully to someone today without interrupting or rushing.',
    'Write down just your top 3 priorities and focus on them calmly.',
  ],
  love: [
    'Send one heartfelt message of appreciation to family or a friend today.',
    'Say a 10-second prayer of blessing for someone on your mind.',
    'Do one quiet, thoughtful favor without expecting credit.',
  ],
  peace: [
    'Take 3 quiet minutes today to slow down and rest in God’s presence.',
    'Respond with an unhurried, gentle tone during busy moments today.',
    'Read today’s verse slowly three times throughout the day.',
  ],
};

const ACTION_POOL_KO: DailyActionItem[] = [
  { id: 'act-k1', title: '따뜻한 차 한 잔과 1분 쉼', description: '잠시 하던 일을 멈추고 따뜻한 물이나 차를 마시며 마음을 쉬게 하기', category: 'prayer' },
  { id: 'act-k2', title: '고마움 메시지 1통 보내기', description: '가족, 친구, 동료 중 한 명에게 "늘 고마워요, 오늘도 힘내세요" 보내기', category: 'love' },
  { id: 'act-k3', title: '오늘의 감사 3가지 적기', description: '휴대폰 메모장에 오늘 감사한 작은 일 3가지를 짧게 기록하기', category: 'thanks' },
  { id: 'act-k4', title: '하늘 보며 깊은 호흡 3번', description: '창밖이나 하늘을 보며 천천히 숨 쉬고 "주님 감사합니다" 고백하기', category: 'prayer' },
  { id: 'act-k5', title: '구체적인 칭찬 한마디 건네기', description: '함께 있는 사람의 좋은 점을 찾아 진심으로 칭찬해 주기', category: 'love' },
  { id: 'act-k6', title: '오늘 말씀 휴대폰에 저장하기', description: '오늘 받은 성경 구절을 메모해 두고 점심때 한 번 더 읽어보기', category: 'word' },
  { id: 'act-k7', title: '식사 전 정성껏 감사 기도', description: '바쁘더라도 식사 전 5초간 눈을 감고 일용할 양식에 감사하기', category: 'thanks' },
  { id: 'act-k8', title: '주변 공간 5분 정리정돈', description: '책상이나 방 한쪽을 깔끔하게 정리하며 마음까지 상쾌하게 정돈하기', category: 'word' },
  { id: 'act-k9', title: '문 잡아주기·작은 배려 실천', description: '엘리베이터나 출입문에서 뒷사람을 배려하는 작은 친절 베풀기', category: 'love' },
  { id: 'act-k10', title: '좋아하는 찬양 1곡 듣기', description: '이동 중이나 쉬는 시간에 마음에 위로가 되는 찬양 한 곡 감상하기', category: 'thanks' },
  { id: 'act-k11', title: '미루던 일 5분만 먼저 시작하기', description: '부담되던 일의 첫 5분만 기도로 가볍게 시작해 보기', category: 'word' },
  { id: 'act-k12', title: '가족에게 따뜻한 안부 전하기', description: '부모님, 배우자, 자녀에게 "오늘 잘 지내시죠? 사랑해요" 표현하기', category: 'love' },
  { id: 'act-k13', title: '감정 올라올 때 5초 멈추기', description: '답답하거나 화날 수 있는 순간 5초만 숨 고르고 부드럽게 말하기', category: 'prayer' },
  { id: 'act-k14', title: '수고하는 분께 인사 건네기', description: '택배기사님, 경비원, 점원 등 오늘 마주치는 분께 밝게 감사 인사하기', category: 'love' },
  { id: 'act-k15', title: '잠들기 전 하루 감사로 마무리', description: '자기 전 오늘 무사히 하루를 보낸 것에 대해 짧은 감사 기도 드리기', category: 'prayer' },
];

const ACTION_POOL_EN: DailyActionItem[] = [
  { id: 'act-e1', title: 'Warm Drink & 1-Minute Pause', description: 'Sip warm water or tea slowly while thanking God for His care.', category: 'prayer' },
  { id: 'act-e2', title: 'Send One Thank-You Text', description: 'Message a friend, family member, or coworker to appreciate them.', category: 'love' },
  { id: 'act-e3', title: 'Note 3 Small Blessings', description: 'Write three ordinary things you are thankful for today.', category: 'thanks' },
  { id: 'act-e4', title: 'Look Up & Take 3 Deep Breaths', description: 'Gaze at the sky for a moment and whisper, "Thank You, Lord."', category: 'prayer' },
  { id: 'act-e5', title: 'Give a Genuine Compliment', description: 'Notice and affirm one real strength in someone you meet today.', category: 'love' },
  { id: 'act-e6', title: 'Re-Read Today’s Verse at Lunch', description: 'Keep today’s verse handy and reflect on it midday.', category: 'word' },
  { id: 'act-e7', title: 'Heartfelt Meal Blessing', description: 'Pause 5 seconds before eating to sincerely thank God.', category: 'thanks' },
  { id: 'act-e8', title: '5-Minute Desk or Room Tidy', description: 'Clear one small space around you to refresh your mind.', category: 'word' },
  { id: 'act-e9', title: 'One Quiet Act of Kindness', description: 'Hold a door open or offer a thoughtful gesture to someone nearby.', category: 'love' },
  { id: 'act-e10', title: 'Listen to One Uplifting Hymn', description: 'Play a peaceful song of praise during a break or commute.', category: 'thanks' },
  { id: 'act-e11', title: 'Focused First 5 Minutes', description: 'Pray briefly and spend 5 focused minutes starting a delayed task.', category: 'word' },
  { id: 'act-e12', title: 'Tell Loved Ones You Care', description: 'Share a warm "I appreciate you" with family today.', category: 'love' },
  { id: 'act-e13', title: '5-Second Calm Pause', description: 'In any stressful moment, pause 5 seconds before responding gently.', category: 'prayer' },
  { id: 'act-e14', title: 'Thank Someone Serving Today', description: 'Offer a warm thank-you to a cashier, driver, or worker you meet.', category: 'love' },
  { id: 'act-e15', title: 'Close Tonight with Thanks', description: 'Before sleeping, thank God for carrying you through today.', category: 'prayer' },
];

export function pickDailyActions(
  mood: FaceMetrics['dominantMood'],
  seed: number,
  lang: Language
): { coreMission: string; items: DailyActionItem[] } {
  const missions = lang === 'en' ? CORE_MISSIONS_EN[mood] : CORE_MISSIONS_KO[mood];
  const coreMission = missions[seed % missions.length];

  const pool = lang === 'en' ? ACTION_POOL_EN : ACTION_POOL_KO;
  const chosen: DailyActionItem[] = [];
  const usedIdx = new Set<number>();
  let cursor = seed;
  while (chosen.length < 3) {
    const idx = cursor % pool.length;
    if (!usedIdx.has(idx)) {
      usedIdx.add(idx);
      chosen.push(pool[idx]);
    }
    cursor += 4;
  }
  return { coreMission, items: chosen };
}

// =========================================================================
// 6. 조합형 1분 기도문 빌더 (수천 가지 자연스러운 현대어 기도문)
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
    const titles: Record<FaceMetrics['dominantMood'], string[]> = {
      rest: ['1-Minute Prayer for Gentle Rest', '1-Minute Prayer for Renewal'],
      joy: ['1-Minute Prayer of Thanksgiving', '1-Minute Prayer for Gladness'],
      courage: ['1-Minute Prayer for Bold Faith', '1-Minute Prayer for Strength'],
      wisdom: ['1-Minute Prayer for Clear Wisdom', '1-Minute Prayer for Guidance'],
      love: ['1-Minute Prayer of Kindness', '1-Minute Prayer for Loving Well'],
      peace: ['1-Minute Prayer for Deep Peace', '1-Minute Prayer of Calm Trust'],
    };
    const openings = [
      `Gracious Heavenly Father, thank You for gifting ${displayName} a brand-new day.`,
      `Loving God, I come before You today with a humble and thankful heart for ${displayName}.`,
      `Faithful Lord, thank You for walking closely with ${displayName} through this ${lifeStage.stage.toLowerCase()} season.`,
    ];
    const rolePrayers = `Bless ${ROLE_CONTEXT_EN[title][gender]} today, and guide every conversation and responsibility.`;
    const moodMiddles: Record<FaceMetrics['dominantMood'], string[]> = {
      rest: [
        'Lift every heavy weight from my shoulders and fill my mind with genuine rest and fresh strength.',
        'Calm my hurried thoughts today and restore my body and spirit beside Your still waters.',
      ],
      joy: [
        'Keep my heart overflowing with gratitude so that my smile and words encourage everyone I meet.',
        'Help me notice Your quiet mercies in ordinary moments and rejoice in Your goodness today.',
      ],
      courage: [
        'Replace every hesitation with bold confidence, knowing You walk ahead of me and uphold me.',
        'Equip me with clarity, endurance, and courage to handle every task before me today.',
      ],
      wisdom: [
        'Grant me clear judgment to choose what is honest, kind, and pleasing to You in every decision.',
        'Quiet my overthinking and light the exact step in front of my feet today.',
      ],
      love: [
        'Fill my heart with patience, forgiveness, and warmth so Christ’s love shines naturally through me.',
        'Open my eyes to small ways I can encourage and serve the people around me today.',
      ],
      peace: [
        'Guard my heart and mind with Your deep shalom that rises above all noise and worry.',
        'Keep my pace unhurried and my heart anchored in Your unchanging peace today.',
      ],
    };
    const closings = [
      `May Your ${verseKeyword.toLowerCase()} stay with me all day long. In Jesus’ name, Amen.`,
      'Thank You for hearing my prayer and walking beside me today. In Jesus’ name, Amen.',
    ];

    return {
      title: titles[mood][seed % titles[mood].length],
      body: `${openings[seed % openings.length]} ${rolePrayers} ${
        moodMiddles[mood][(seed >> 2) % moodMiddles[mood].length]
      } ${closings[(seed >> 4) % closings.length]}`,
    };
  }

  // 한국어 현대어 1분 기도문 조합
  const titlesKo: Record<FaceMetrics['dominantMood'], string[]> = {
    rest: ['지친 마음을 쉬게 하시는 1분 기도', '새 힘을 부어주시는 1분 회복 기도'],
    joy: ['감사와 웃음이 넘치는 1분 기도', '오늘을 기쁘게 여는 1분 감사 기도'],
    courage: ['용기와 담대함을 구하는 1분 기도', '주님의 힘으로 승리하는 1분 기도'],
    wisdom: ['맑은 지혜와 인도를 구하는 1분 기도', '바른 선택을 돕는 1분 지혜 기도'],
    love: ['따뜻한 사랑으로 채우는 1분 기도', '이웃을 품고 섬기는 1분 사랑 기도'],
    peace: ['마음의 평안을 지키는 1분 기도', '걱정을 내려놓는 1분 평강 기도'],
  };

  const openingsKo = [
    `사랑이 많으신 하나님 아버지, 오늘도 ${displayName}에게 소중한 새 하루를 선물해 주셔서 감사합니다.`,
    `언제나 곁을 지켜주시는 하나님 아버지, ${displayName}이 오늘 하루를 감사함으로 시작합니다.`,
    `좋으신 하나님 아버지, ${displayName}의 ${lifeStage.stage}(만 ${lifeStage.age}세)의 날들을 선하게 이끌어 주시니 감사합니다.`,
  ];

  const rolePrayersKo = `특별히 ${ROLE_CONTEXT_KO[title][gender]} 위에 주님의 은혜를 더해 주시고, 오늘 만나는 모든 사람들과 일들 가운데 함께해 주세요.`;

  const moodMiddlesKo: Record<FaceMetrics['dominantMood'], string[]> = {
    rest: [
      '혼자 해결하려 애쓰던 무거운 마음과 피로를 이 시간 주님 앞에 내려놓습니다. 지친 몸과 마음을 따뜻하게 어루만져 주셔서 다시 일어날 새 힘을 얻게 해주세요.',
      '바쁘고 고단한 일상 속에서도 잠시 숨을 고르게 하시고, 목자 되신 주님의 품 안에서 편안한 쉼과 회복을 누리게 해주세요.',
    ],
    joy: [
      '작은 일에도 감사할 줄 아는 넉넉한 마음을 주시고, 제 얼굴의 미소와 따뜻한 말이 주변 사람들에게 좋은 힘이 되게 해주세요.',
      '사소한 일에 불평하지 않게 붙들어 주시고, 주님이 주시는 밝은 기쁨으로 오늘 하루를 활기차게 살아가게 해주세요.',
    ],
    courage: [
      '눈앞의 어려운 일이나 사람들의 시선 때문에 위축되지 않게 하시고, 함께하시는 하나님을 의지하며 당당하게 한 걸음 내딛게 해주세요.',
      '부족한 제 힘만 보지 않고 능력을 주시는 주님을 바라보게 하셔서, 오늘 맡겨진 일들을 담대하고 성실하게 해내게 해주세요.',
    ],
    wisdom: [
      '복잡한 생각과 조급함을 가라앉혀 주시고, 오늘 마주하는 선택들 앞에서 무엇이 가장 바르고 선한 길인지 맑게 분별할 지혜를 주세요.',
      '내 경험만 고집하지 않고 겸손히 주님께 여쭙게 하셔서, 오늘 내딛는 한 걸음 한 걸음이 가장 좋은 길로 이어지게 해주세요.',
    ],
    love: [
      '조금 더 오래 참고, 조금 더 부드럽게 말하는 따뜻한 마음을 부어주셔서 오늘 만나는 이들에게 주님의 사랑이 자연스럽게 전해지게 해주세요.',
      '서운하거나 불편한 마음은 너그럽게 내려놓게 하시고, 대접받기보다 먼저 작은 친절을 베푸는 복된 하루가 되게 해주세요.',
    ],
    peace: [
      '마음속에 스며드는 크고 작은 걱정들을 감사 기도로 주님께 올려드리오니, 세상이 줄 수 없는 잔잔하고 깊은 평안으로 내 마음을 지켜주세요.',
      '주변이 아무리 분주하고 시끄러워도 마음의 중심을 잃지 않게 하시고, 주님과 함께 걷는 든든한 안심 속에서 하루를 보내게 해주세요.',
    ],
  };

  const closingsKo = [
    `오늘 주신 '${verseKeyword}'의 은혜가 하루 종일 삶 속에 살아 움직이게 해주세요. 예수님의 이름으로 기도드립니다. 아멘.`,
    '오늘 하루의 시작부터 끝까지 선하게 지켜주실 주님을 신뢰하며, 예수님의 이름으로 기도드립니다. 아멘.',
  ];

  return {
    title: titlesKo[mood][seed % titlesKo[mood].length],
    body: `${openingsKo[seed % openingsKo.length]} ${rolePrayersKo} ${
      moodMiddlesKo[mood][(seed >> 2) % moodMiddlesKo[mood].length]
    } ${closingsKo[(seed >> 4) % closingsKo.length]}`,
  };
}

// =========================================================================
// 7. 추천 찬양 (24곡), 영적 습관 (18개), 추천 성경 읽기 (18개) 풀
// =========================================================================
const PRAISE_POOL_KO: RecommendedPraise[] = [
  { title: '은혜 (Grace)', artist: '손경민', lyricSnippet: '내가 누려왔던 모든 것들이 지나왔던 모든 시간이 다 은혜였소', theme: '감사' },
  { title: '나의 피난처 예수', artist: '어노인팅', lyricSnippet: '나의 피난처 예수 의지해요 안전한 그 품 날 안으시네', theme: '쉼' },
  { title: '주가 일하시네', artist: '김브라이언', lyricSnippet: '날이 저물어 갈 때 빈들에서 걸을 때 그때가 하나님의 때', theme: '용기' },
  { title: '꽃들도', artist: 'JWorship', lyricSnippet: '꽃들도 구름도 바람도 넓은 바다도 찬양하라 예수를', theme: '기쁨' },
  { title: '원하고 바라고 기도합니다', artist: '찬미워십', lyricSnippet: '이 세상을 살아가는 동안에 나의 힘을 의지할 수 없으니', theme: '지혜' },
  { title: '행복', artist: '손경민', lyricSnippet: '화려하지 않아도 정결하게 사는 삶 가진 것이 적어도 감사하며 사는 삶', theme: '평안' },
  { title: '아 하나님의 은혜로', artist: '찬송가 310장', lyricSnippet: '내가 믿고 또 의지함은 내 모든 형편 아시는 주님', theme: '신뢰' },
  { title: '내 평생에 가는 길', artist: '찬송가 413장', lyricSnippet: '내 영혼 평안해 내 영혼 내 영혼 평안해', theme: '평안' },
  { title: '선한 목자 되신 우리 주', artist: '찬송가 569장', lyricSnippet: '선한 목자 되신 우리 주 항상 인도하시고', theme: '인도' },
  { title: '참 아름다워라', artist: '찬송가 478장', lyricSnippet: '참 아름다워라 주님의 세계는 저 솔로몬의 옷보다 더 고운 백합화', theme: '창조' },
  { title: '주 안에 있는 나에게', artist: '찬송가 370장', lyricSnippet: '주 안에 있는 나에게 딴 근심 있으랴', theme: '안심' },
  { title: '시선', artist: '예수전도단', lyricSnippet: '내게로부터 눈을 들어 주를 보기 시작할 때 주의 일을 보겠네', theme: '믿음' },
  { title: '감사함으로', artist: '마커스워십', lyricSnippet: '주님의 높고 위대하심을 내 영혼이 찬양하네', theme: '감사' },
  { title: '광야를 지나며', artist: '히즈윌', lyricSnippet: '왜 나를 깊은 어둠 속에 홀로 두시는지 그곳에서 주님을 만나네', theme: '위로' },
  { title: '하나님의 사랑을 사모하는 자', artist: '이천', lyricSnippet: '하나님의 사랑을 사모하는 자 하나님의 평화를 바라보는 자', theme: '사랑' },
  { title: '너는 하나님의 선물', artist: '축복송', lyricSnippet: '너는 하나님의 사람 아름다운 주님의 열매', theme: '축복' },
];

const PRAISE_POOL_EN: RecommendedPraise[] = [
  { title: 'Amazing Grace', artist: 'Traditional Hymn', lyricSnippet: 'Amazing grace, how sweet the sound.', theme: 'Grace' },
  { title: 'What a Friend We Have in Jesus', artist: 'Traditional Hymn', lyricSnippet: 'Take it to the Lord in prayer.', theme: 'Rest' },
  { title: 'It Is Well with My Soul', artist: 'Traditional Hymn', lyricSnippet: 'Whatever my lot, Thou hast taught me to say, it is well.', theme: 'Peace' },
  { title: 'Be Thou My Vision', artist: 'Traditional Hymn', lyricSnippet: 'Be Thou my wisdom, and Thou my true word.', theme: 'Wisdom' },
  { title: 'Joyful, Joyful, We Adore Thee', artist: 'Traditional Hymn', lyricSnippet: 'Hearts unfold like flowers before Thee.', theme: 'Joy' },
  { title: 'A Mighty Fortress Is Our God', artist: 'Traditional Hymn', lyricSnippet: 'A mighty fortress is our God, a bulwark never failing.', theme: 'Courage' },
  { title: 'Great Is Thy Faithfulness', artist: 'Traditional Hymn', lyricSnippet: 'Morning by morning new mercies I see.', theme: 'Faithfulness' },
  { title: 'This Is My Father’s World', artist: 'Traditional Hymn', lyricSnippet: 'This is my Father’s world, all nature sings.', theme: 'Creation' },
  { title: 'Like a River Glorious', artist: 'Traditional Hymn', lyricSnippet: 'Like a river glorious is God’s perfect peace.', theme: 'Peace' },
  { title: 'Love Divine, All Loves Excelling', artist: 'Traditional Hymn', lyricSnippet: 'Joy of heaven, to earth come down.', theme: 'Love' },
  { title: 'Guide Me, O Thou Great Jehovah', artist: 'Traditional Hymn', lyricSnippet: 'I am weak, but Thou art mighty; hold me with Thy powerful hand.', theme: 'Guidance' },
  { title: 'Holy, Holy, Holy', artist: 'Traditional Hymn', lyricSnippet: 'Early in the morning our song shall rise to Thee.', theme: 'Worship' },
];

const HABIT_POOL_KO = [
  '아침에 휴대폰 알림을 보기 전에 오늘 성경 구절 먼저 한 번 읽기',
  '식사 전 5초간 눈을 감고 오늘 주신 음식과 건강에 진심으로 감사하기',
  '걷거나 이동할 때 속으로 "주님, 오늘도 감사합니다" 3번 고백하기',
  '거울을 볼 때마다 미소 지으며 "오늘도 주님의 은혜가 충분합니다" 말하기',
  '잠자리에 들기 전 오늘 고마웠던 일 1가지를 떠올리며 감사 기도하기',
  '답답한 일이 생길 때 말하기 전 5초만 멈추고 마음속으로 짧게 기도하기',
  '오늘 만나는 사람 중 한 명의 이름을 떠올리며 조용히 축복 기도하기',
  '하루 중 3분만 조용히 앉아 휴대폰을 내려놓고 마음을 정돈하기',
  '누군가를 비판하고 싶을 때 그 사람의 장점 2가지를 먼저 떠올리기',
  '집이나 사무실 문을 나서며 "주님, 오늘 하루도 함께해 주세요" 고백하기',
  '식사 자리에서 옆 사람의 물잔이나 수저를 먼저 챙겨주는 작은 섬김 실천하기',
  '자연(하늘, 나무, 바람)을 볼 때마다 창조주 하나님께 감사 인사하기',
];

const HABIT_POOL_EN = [
  'Read today’s Bible verse once before checking phone notifications.',
  'Pause 5 seconds before each meal to give sincere thanks.',
  'Whisper "Thank You, Lord" three times while walking or commuting.',
  'Smile in the mirror and say, "God’s grace is enough for me today."',
  'Recall one blessing from today before falling asleep tonight.',
  'Pause 5 seconds for a silent prayer before responding in tense moments.',
  'Silently pray a blessing for one person you meet today.',
  'Sit quietly for 3 phone-free minutes to let your heart settle.',
  'Think of two strengths in someone whenever frustration rises.',
  'Say "Lord, walk with me today" as you step out the door.',
  'Serve someone else first at the table today.',
  'Pause outdoors for a moment to thank God for the sky and breeze.',
];

const READING_POOL_KO = [
  '시편 23편 (여호와는 나의 목자)',
  '시편 121편 (천지를 지으신 나의 도움)',
  '잠언 3장 (마음을 다해 주님을 신뢰하라)',
  '빌립보서 4장 (주 안에서 항상 기뻐하라)',
  '마태복음 5장 (산상수훈 팔복)',
  '요한복음 14장 (마음에 근심하지 말라)',
  '로마서 8장 (하나님의 사랑에서 끊을 수 없느니라)',
  '고린도전서 13장 (사랑장)',
  '이사야 40장 (새 힘을 얻으리니)',
  '여호수아 1장 (강하고 담대하라)',
  '시편 100편 (기쁨으로 여호와를 섬기라)',
  '창세기 1장 (빛이 있으라)',
  '야고보서 1장 (후히 주시는 지혜)',
  '갈라디아서 5장 (성령의 열매)',
];

const READING_POOL_EN = [
  'Psalm 23 (The Lord Is My Shepherd)',
  'Psalm 121 (My Help Comes from the Lord)',
  'Proverbs 3 (Trust in the Lord)',
  'Philippians 4 (Rejoice in the Lord Always)',
  'Matthew 5 (The Beatitudes)',
  'John 14 (Do Not Let Your Hearts Be Troubled)',
  'Romans 8 (More Than Conquerors)',
  '1 Corinthians 13 (The Way of Love)',
  'Isaiah 40 (Renewed Strength)',
  'Joshua 1 (Be Strong and Courageous)',
  'Psalm 100 (Serve the Lord with Gladness)',
  'Genesis 1 (Let There Be Light)',
  'James 1 (Ask God for Wisdom)',
  'Galatians 5 (Fruit of the Spirit)',
];

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
    habit: habits[(seed >> 2) % habits.length],
    reading: readings[(seed >> 4) % readings.length],
  };
}

export function getTodayLocalKey(): string {
  return getLocalDateKey();
}
