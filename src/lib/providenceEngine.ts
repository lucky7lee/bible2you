import {
  CreationProvidenceData,
  DailyRhythmType,
  FiveElement,
  GraceColorInfo,
  Language,
} from '../types/bible';

// =========================================================================
// 내부 계산 엔진: 실제 생년월일 일간(오행), 오늘 일진(오행), 상생·상극 관계,
// 및 실제 생일 계절 별자리(12궁)를 정밀 계산하되,
// 화면에 출력되는 모든 언어는 100% 기독교적 창조 섭리·기질 이해·묵상 프레임으로 치환!
// (금기어: 운세, 사주, 팔자, 액운, 횡재, 부적, 미신, 점괘 등 일절 미사용)
// =========================================================================

// 그레고리력 날짜 -> 율리우스 일수(JDN) -> 60갑자 인덱스(0~59) 계산
function getGanjiIndex(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  // 1900-01-01은 갑술일(인덱스 10), JDN=2415021
  return (((jdn - 2415021 + 10) % 60) + 60) % 60;
}

// 10천간(0~9) -> 오행 매핑: 갑을(목), 병정(화), 무기(토), 경신(금), 임계(수)
function stemToElement(ganjiIndex: number): FiveElement {
  const stem = ganjiIndex % 10;
  if (stem <= 1) return 'wood';
  if (stem <= 3) return 'fire';
  if (stem <= 5) return 'earth';
  if (stem <= 7) return 'metal';
  return 'water';
}

// 생년월일 일간 오행 vs 오늘 일진 오행의 상호작용(상생·비화·설기·극출·피극) 계산
function computeDailyRhythm(birth: FiveElement, today: FiveElement): DailyRhythmType {
  if (birth === today) return 'harmony'; // 같은 결의 동행
  const generates: Record<FiveElement, FiveElement> = {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood',
  };
  if (generates[today] === birth) return 'support'; // 오늘이 나를 돕는 채움의 날
  if (generates[birth] === today) return 'express'; // 내가 밖으로 흘려보내는 나눔의 날
  const controls: Record<FiveElement, FiveElement> = {
    wood: 'earth',
    earth: 'water',
    water: 'fire',
    fire: 'metal',
    metal: 'wood',
  };
  if (controls[birth] === today) return 'refine'; // 중심을 잡고 절제·결단하는 날
  return 'growth'; // 깎이고 다듬어지며 성숙해지는 날
}

// 실제 생일(월/일) -> 12계절 별자리 인덱스 (0~11)
function getConstellationIndex(month: number, day: number): number {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return 0; // 봄의 시작 (양자리 시즌)
  if (md >= 420 && md <= 520) return 1; // 짙어지는 봄 (황소자리 시즌)
  if (md >= 521 && md <= 621) return 2; // 초여름의 빛 (쌍둥이자리 시즌)
  if (md >= 622 && md <= 722) return 3; // 한여름의 품 (게자리 시즌)
  if (md >= 723 && md <= 822) return 4; // 뜨거운 태양 (사자자리 시즌)
  if (md >= 823 && md <= 922) return 5; // 추수의 준비 (처녀자리 시즌)
  if (md >= 923 && md <= 1022) return 6; // 가을의 균형 (천칭자리 시즌)
  if (md >= 1023 && md <= 1122) return 7; // 깊은 가을밤 (전갈자리 시즌)
  if (md >= 1123 && md <= 1221) return 8; // 소망의 겨울 (사수자리 시즌)
  if (md >= 1222 || md <= 119) return 9; // 고요한 한겨울 (염소자리 시즌)
  if (md >= 120 && md <= 218) return 10; // 새벽 샘물 (물병자리 시즌)
  return 11; // 봄을 기다리는 바다 (물고기자리 시즌)
}

// =========================================================================
// 1. 창조 기질(5가지 마음의 결) & 오늘의 리듬(5가지) = 25가지 마음 기후 해석
// =========================================================================
const TEMPERAMENT_BADGE: Record<Language, Record<FiveElement, string>> = {
  ko: {
    wood: '생명과 성장의 결',
    fire: '온기와 열정의 결',
    earth: '든든한 대지의 결',
    metal: '맑은 분별의 결',
    water: '깊은 지혜의 결',
  },
  en: {
    wood: 'Spring Growth Temperament',
    fire: 'Warm Sunlight Temperament',
    earth: 'Steady Ground Temperament',
    metal: 'Clear Discernment Temperament',
    water: 'Deep Wisdom Temperament',
  },
  es: {
    wood: 'Carácter de Primavera y Vida',
    fire: 'Carácter de Luz y Calidez',
    earth: 'Carácter de Tierra Firme',
    metal: 'Carácter de Claridad',
    water: 'Carácter de Sabiduría Serena',
  },
};

const WEATHER_TITLES: Record<Language, Record<DailyRhythmType, string[]>> = {
  ko: {
    support: ['단비처럼 은혜가 채워지는 날', '따뜻한 햇살이 마음을 감싸는 날', '새 힘이 고요히 스며드는 날'],
    harmony: ['마음의 결이 편안히 맞닿는 날', '잔잔한 호수처럼 중심이 서는 날', '익숙한 평안이 깊어지는 날'],
    express: ['따뜻한 사랑이 흘러가는 날', '선한 열매가 밖으로 펼쳐지는 날', '밝은 온기를 나누기 좋은 날'],
    refine: ['맑은 분별과 절제가 빛나는 날', '생각이 정돈되고 길이 보이는 날', '차분한 결단이 열매를 맺는 날'],
    growth: ['단단하게 다듬어지며 성숙하는 날', '잠시 멈춰 지혜를 구하기 좋은 날', '겸손 속에 새 길을 발견하는 날'],
  },
  en: {
    support: ['Gentle Rain of Renewal', 'Warm Sunlight Over Your Soul', 'Quiet Strength Flowing In'],
    harmony: ['Calm Alignment & Inner Peace', 'Still Waters & Steady Heart', 'Grounded in Quiet Grace'],
    express: ['Overflowing Warmth & Kindness', 'Sharing Light with Others', 'Fruitful Steps of Love'],
    refine: ['Clear Discernment & Focus', 'Crisp Clarity for Key Choices', 'Steady Wisdom in Action'],
    growth: ['Refined Through Calm Patience', 'A Pause for Deeper Wisdom', 'Growing Stronger in Humility'],
  },
  es: {
    support: ['Lluvia Suave de Renovación', 'Luz Cálida Sobre Tu Alma', 'Fuerzas Nuevas en Calma'],
    harmony: ['Armonía Serena y Paz Interior', 'Aguas Tranquilas y Corazón Firme', 'Afirmado en Gracia'],
    express: ['Calidez y Amor que Fluyen', 'Compartiendo Luz con Otros', 'Pasos Fecundos de Bondad'],
    refine: ['Claridad y Buen Discernimiento', 'Enfoque Firme para Decidir', 'Sabiduría Serena en Acción'],
    growth: ['Madurando con Paciencia', 'Pausa para Mayor Sabiduría', 'Creciendo en Humildad'],
  },
};

const HEART_CLIMATE_KO: Record<FiveElement, Record<DailyRhythmType, string>> = {
  wood: {
    support: '하나님께서 심어주신 생명력 넘치는 봄바람 같은 기질 위에, 오늘은 마른 땅을 적시는 단비처럼 위로와 새 힘이 넉넉히 채워지는 흐름입니다. 감사함으로 이 에너지를 받아 누려 보세요.',
    harmony: '타고난 성장과 도전의 마음이 오늘의 차분한 흐름과 나란히 호흡하는 날입니다. 서두르지 않고 계획한 일들을 하나씩 성실히 이어갈 때 기분 좋은 진전이 열립니다.',
    express: '마음속에 자라난 선한 아이디어와 따뜻한 격려를 주변으로 흘려보내기 좋은 날입니다. 다만 열정이 넘쳐 조금 바빠질 수 있으니 중간중간 숨을 고르며 평안을 지키세요.',
    refine: '새로운 시도를 향한 마음이 크지만, 오늘은 가지를 단정히 다듬듯 우선순위를 정리할 때 더 큰 열매가 맺힙니다. 꼭 필요한 핵심 일에 집중하며 지혜를 구해 보세요.',
    growth: '예상과 다른 속도에 마음이 잠시 흔들릴 수 있지만, 바람을 맞으며 나무뿌리가 깊어지듯 주님 안에서 내면이 한층 단단해지는 성숙의 시간입니다.',
  },
  fire: {
    support: '하나님이 주신 밝고 따뜻한 햇살 같은 기질에 오늘 든든한 응원과 활력이 더해집니다. 주변 분위기를 환하게 밝히며 기쁨의 통로로 쓰임 받기 좋은 하루입니다.',
    harmony: '열정과 진심이 살아 숨 쉬는 오늘, 마음의 온도가 유난히 따뜻하게 유지됩니다. 이 밝은 에너지를 가까운 가족이나 동료에게 다정한 인사로 나눠 보세요.',
    express: '다른 사람을 돕고 섬기고 싶은 따뜻한 마음이 자연스럽게 표현되는 날입니다. 다만 모든 일을 한꺼번에 해결하려다 지치지 않도록 내 마음의 쉼도 함께 챙기세요.',
    refine: '빠르게 움직이고 싶은 마음이 앞서기 쉬운 날입니다. 중요한 말이나 결정을 앞두고 10초만 숨을 고르며 주님의 평안을 구하면 훨씬 지혜로운 결과가 따릅니다.',
    growth: '열심히 달려온 마음이 잠시 식거나 피곤하게 느껴질 수 있는 날입니다. 억지로 불을 지피기보다 주님 품에서 잠시 쉬며 조용히 새 힘을 얻는 편이 훨씬 좋습니다.',
  },
  earth: {
    support: '하나님이 빚으신 든든하고 포근한 대지 같은 기질 위로 따뜻한 햇살이 비추는 하루입니다. 맡겨진 가정과 일터의 자리를 차분히 지켜낼 넉넉한 안심이 채워집니다.',
    harmony: '변덕 없는 성실함과 신뢰의 결이 오늘 하루의 안정된 흐름과 잘 어우러집니다. 묵묵히 해오던 일들 속에서 작지만 확실한 감사의 열매를 발견하게 됩니다.',
    express: '넉넉한 품으로 주변 사람들의 고민을 들어주고 다독여 줄 기회가 찾아오는 날입니다. 내 마음을 먼저 주님의 은혜로 채운 뒤 나누면 훨씬 편안합니다.',
    refine: '익숙한 방식을 지키려다 마음이 다소 무거워질 수 있는 날입니다. 주님께 새로운 관점과 유연한 지혜를 구할 때 답답했던 매듭이 부드럽게 풀립니다.',
    growth: '주변 변화가 조금 빠르게 느껴질 수 있지만, 땅이 비를 머금어 새싹을 틔우듯 오늘의 작은 변화는 내일의 풍성한 복을 준비하는 과정입니다.',
  },
  metal: {
    support: '하나님이 주신 맑고 단정한 분별의 기질이 오늘 든든한 뒷받침을 얻어 한층 빛납니다. 복잡했던 생각이 깔끔하게 정리되고 바른 선택이 선명해지는 하루입니다.',
    harmony: '원칙과 정직을 소중히 여기는 마음의 결이 오늘의 맑은 흐름과 잘 맞아떨어집니다. 스스로에게나 이웃에게 너무 엄격해지지 않도록 따뜻한 여유만 한 스푼 더해 보세요.',
    express: '명쾌한 통찰과 성실한 실행력이 주변에 큰 도움이 되는 날입니다. 옳은 말이라도 부드럽고 다정한 어조로 건넬 때 사람의 마음이 활짝 열립니다.',
    refine: '옳고 그름을 분명히 가리고 싶은 마음이 강해질 수 있습니다. 판단을 조금 늦추고 주님의 긍휼한 시선으로 한 번 더 바라볼 때 평화가 지켜집니다.',
    growth: '내 기준대로 풀리지 않는 일 앞에서 긴장할 수 있지만, 정금이 불을 지나 더 맑아지듯 오늘의 인내가 내 마음을 한 단계 더 깊게 빚어줍니다.',
  },
  water: {
    support: '하나님이 주신 깊고 유연한 샘물 같은 지혜 위에 오늘 맑은 영감과 평온이 더해집니다. 조용히 묵상하고 기도하는 시간 속에 가장 선한 답이 떠오릅니다.',
    harmony: '잔잔하고 깊이 생각하는 마음의 결이 오늘 하루를 평온하게 감싸줍니다. 서두르는 세상 속에서도 나만의 고요한 중심을 지키며 감사히 걸어갈 수 있습니다.',
    express: '섬세한 공감 능력과 따뜻한 위로가 누군가에게 큰 힘이 되는 날입니다. 생각에만 머무르지 말고 짧은 안부나 작은 친절로 마음을 표현해 보세요.',
    refine: '여러 생각이 꼬리를 물며 마음이 잠시 복잡해질 수 있는 날입니다. 걱정은 기도로 주님께 넘겨드리고, 오늘 눈앞의 한 걸음에만 가볍게 집중해 보세요.',
    growth: '주변 상황에 맞춰 애쓰느라 내 마음이 다소 지칠 수 있습니다. 오늘은 남을 맞추기 전에 주님 안에서 나 자신의 마음을 먼저 따뜻하게 돌보아 주세요.',
  },
};

const HEART_CLIMATE_EN: Record<FiveElement, Record<DailyRhythmType, string>> = {
  wood: {
    support: 'God placed a vibrant, spring-like spirit of growth within you, and today brings refreshing grace like gentle rain over dry ground.',
    harmony: 'Your natural drive for growth aligns calmly with today’s rhythm—steady, unhurried steps will bear joyful fruit.',
    express: 'Good ideas and encouragement flow easily from you today. Pause briefly between tasks so enthusiasm stays peaceful.',
    refine: 'Like pruning a healthy branch for richer fruit, focusing on just your top priorities today will bring surprising clarity.',
    growth: 'If plans move slower than hoped, remember that wind deepens a tree’s roots—God is strengthening you within.',
  },
  fire: {
    support: 'Your warm, sunlight-like temperament receives fresh energy and encouragement today—let your joy brighten the room.',
    harmony: 'Your sincerity and warmth shine naturally today. Share an encouraging greeting with family or a coworker.',
    express: 'Your generous heart wants to lift everyone around you today; remember to guard a quiet pocket of rest for yourself too.',
    refine: 'Energy moves fast today—pausing 10 seconds to pray before big replies will turn zeal into gentle wisdom.',
    growth: 'If your energy feels quieter than usual, do not force it. Rest beside the Lord and let Him gently renew your spark.',
  },
  earth: {
    support: 'God shaped you with a steady, grounding spirit, and today wraps your home and work in reassuring calm.',
    harmony: 'Your quiet faithfulness fits smoothly with today’s pace—notice the small, dependable blessings blooming around you.',
    express: 'People feel safe around your warmth today. Fill your own heart with God’s grace first, then pour out freely.',
    refine: 'When routines feel heavy, ask God for fresh flexibility—a slight shift in perspective will lighten your load.',
    growth: 'Changes around you may feel brisk, yet just as rain softens soil for new life, today prepares tomorrow’s harvest.',
  },
  metal: {
    support: 'Your clear, discerning spirit gains steady support today—complex thoughts settle into clean, honest choices.',
    harmony: 'Your love for integrity aligns well with today’s clarity. Pair high standards with a gentle, forgiving smile.',
    express: 'Your thoughtful insight helps others solve real problems today; deliver truth with warmth and kindness.',
    refine: 'Pause before judging a frustrating detail—looking through Christ’s mercy protects peace in every conversation.',
    growth: 'When things do not go neatly to plan, trust that patience refines character like gold into lasting strength.',
  },
  water: {
    support: 'God gifted you with deep, thoughtful wisdom, and today brings fresh clarity during quiet moments of prayer.',
    harmony: 'Your calm, reflective rhythm anchors you amid busy noise—walk steadily in gratitude today.',
    express: 'Your empathy is a quiet gift to someone near you today; turn a caring thought into one small kind gesture.',
    refine: 'If thoughts start circling too fast, hand the worry to God and focus lightly on the single step right in front of you.',
    growth: 'Adapting to everyone else can drain your spirit—take time today to rest honestly in God’s care.',
  },
};

const HEART_CLIMATE_ES: Record<FiveElement, Record<DailyRhythmType, string>> = {
  wood: {
    support: 'Dios sembró en ti un espíritu vital como la primavera, y hoy llega gracia fresca como lluvia suave que renueva tus fuerzas.',
    harmony: 'Tu impulso natural de crecer fluye en calma con el ritmo de hoy; pasos firmes y sin prisa darán buen fruto.',
    express: 'Buenas ideas y palabras de ánimo brotan con facilidad hoy; haz breves pausas para mantener la paz.',
    refine: 'Como podar una rama para dar mejor fruto, enfocarte hoy en tus prioridades clave traerá gran claridad.',
    growth: 'Si algo avanza más lento de lo esperado, recuerda que el viento profundiza las raíces: Dios fortalece tu interior.',
  },
  fire: {
    support: 'Tu carácter cálido y luminoso recibe hoy aliento y vigor renovados; deja que tu alegría ilumine tu entorno.',
    harmony: 'Tu sinceridad y calidez brillan con naturalidad hoy; comparte un saludo amable con familia o colegas.',
    express: 'Tu corazón generoso desea ayudar a todos hoy; recuerda cuidar también un momento tranquilo de descanso para ti.',
    refine: 'El entusiasmo corre rápido hoy: pausar 10 segundos en oración antes de responder convertirá el impulso en sabiduría.',
    growth: 'Si sientes menos energía de lo habitual, no te fuerces; descansa en el Señor y deja que Él renueve tu ánimo.',
  },
  earth: {
    support: 'Dios formó en ti un espíritu firme y acogedor, y hoy envuelve tu hogar y trabajo con serena seguridad.',
    harmony: 'Tu fidelidad constante encaja muy bien con el día de hoy; nota las bendiciones sencillas que florecen cerca.',
    express: 'Las personas hallan abrigo en tu trato hoy; llena primero tu corazón de la gracia de Dios y comparte en paz.',
    refine: 'Si la rutina pesa un poco, pide a Dios flexibilidad fresca; un pequeño cambio de mirada aliviará tu carga.',
    growth: 'Los cambios cercanos pueden parecer rápidos, pero así como la lluvia prepara la tierra, hoy prepara buenos frutos.',
  },
  metal: {
    support: 'Tu espíritu claro y ordenado recibe hoy un firme respaldo: las ideas complejas se aclaran en decisiones rectas.',
    harmony: 'Tu amor por la honestidad brilla hoy; acompaña tus principios con una sonrisa amable y comprensiva.',
    express: 'Tu criterio claro será de gran ayuda para otros hoy; ofrece la verdad con tacto y calidez.',
    refine: 'Pausa antes de juzgar un detalle molesto: mirar con la misericordia de Cristo guarda la paz.',
    growth: 'Cuando algo no salga exactamente como planeabas, confía en que la paciencia pule el carácter como oro fino.',
  },
  water: {
    support: 'Dios te dio una sabiduría serena y profunda, y hoy trae claridad fresca en breves momentos de oración.',
    harmony: 'Tu ritmo reflexivo te sostiene en paz en medio del ruido diario; camina hoy con gratitud.',
    express: 'Tu empatía será un consuelo real para alguien hoy; convierte un buen pensamiento en un pequeño gesto amable.',
    refine: 'Si los pensamientos giran demasiado rápido, entrega esa inquietud a Dios y enfócate en el paso de ahora.',
    growth: 'Adaptarte a todos puede cansarte; regálate hoy un espacio honesto de descanso en el cuidado de Dios.',
  },
};

// =========================================================================
// 2. 밤하늘의 시편 (12계절 별자리 -> 시편 19편, 아브라함의 뭇별, 욥기의 별 등 성경적 묵상)
// =========================================================================
const NIGHT_SKY_KO: Array<{ title: string; body: string }> = [
  { title: '새봄의 첫 별 · 새로운 시작의 섭리', body: '겨울을 깨우고 새 계절을 여는 봄하늘의 별처럼, 하나님은 오늘 당신의 일상에도 새 일을 시작하십니다. "보라 내가 새 일을 행하리라" 하신 창조주의 약속을 기대하며 하루를 열어 보세요.' },
  { title: '푸른 5월의 별 · 흔들리지 않는 성실의 질서', body: '봄밤을 묵묵히 지키는 욥기의 묘성(플레이아데스)처럼, 하나님이 세우신 창조의 질서는 한결같습니다. 오늘 묵묵히 지켜내는 작은 성실함 위에 주님의 든든한 복이 머뭅니다.' },
  { title: '초여름의 쌍별 · 동행과 소통의 빛', body: '밤하늘에서 나란히 반짝이는 두 별처럼, 하나님은 우리가 홀로 걷지 않고 서로 격려하며 동행하도록 지으셨습니다. 오늘 만나는 이들과 따뜻한 대화를 나누는 복된 통로가 되어 보세요.' },
  { title: '한여름 은하수 · 가정과 품의 보호', body: '아브라함에게 밤하늘의 뭇별을 보여주며 자손과 가정을 축복하신 하나님을 기억합니다. 오늘 당신의 가정과 사랑하는 이들의 자리마다 주님의 포근한 보호가 가득하길 기도해 보세요.' },
  { title: '한낮의 태양과 별 · 당당한 빛의 사명', body: '시편 19편은 하늘이 하나님의 영광을 선포하고 해가 기뻐하며 제 길을 달린다고 노래합니다. 오늘 주님이 주신 당당한 빛으로 어두운 곳을 환하게 밝히는 하루가 되길 응원합니다.' },
  { title: '초가을 수확의 별 · 섬세한 돌봄과 열매', body: '들판의 곡식을 익게 하시는 추수의 계절처럼, 그동안 정성껏 뿌린 기도와 수고는 결코 헛되지 않습니다. 작은 디테일까지 세심히 살피시는 하나님의 손길을 신뢰해 보세요.' },
  { title: '가을 하늘의 저울 · 조화와 화평의 질서', body: '낮과 밤이 고르게 균형을 이루는 계절의 하늘처럼, 하나님은 무질서가 아니라 화평의 하나님이십니다. 오늘 일과 쉼, 관계와 마음 사이에 평화로운 균형을 누려 보세요.' },
  { title: '깊은 가을밤의 별 · 깊은 통찰과 회복', body: '밤이 깊을수록 별빛은 더욱 선명하게 빛납니다. 겉으로 보이는 소음보다 내면의 진실을 보시는 하나님 앞에서, 오늘 깊은 평온과 맑은 통찰을 누리는 시간을 가져 보세요.' },
  { title: '초겨울 소망의 별 · 멀리 바라보는 비전', body: '동방박사들을 베들레헴으로 인도했던 빛나는 별처럼, 하나님은 당신의 앞길에도 소망의 이정표를 두셨습니다. 눈앞의 작은 걱정을 넘어 더 큰 은혜를 바라보며 걸어가세요.' },
  { title: '겨울밤의 오리온 · 흔들리지 않는 인내', body: '욥기에서 하나님이 친히 언급하신 겨울밤의 삼성(오리온)처럼, 추운 계절에도 변함없이 제자리를 지키는 믿음이 아름답습니다. 오늘 끝까지 해내는 든든한 인내를 응원합니다.' },
  { title: '새벽을 여는 별 · 맑은 지혜와 새로움', body: '어둠 끝에 가장 먼저 떠오르는 새벽별처럼, 예수님은 우리 마음에 맑은 지혜와 새 소망을 비추어 주십니다. 고정관념을 잠시 내려놓고 주님이 주시는 신선한 지혜를 구해 보세요.' },
  { title: '봄을 품은 밤하늘 · 따뜻한 긍휼과 위로', body: '겨울 끝자락에서 봄의 온기를 품고 빛나는 밤하늘처럼, 하나님은 연약한 마음을 가장 먼저 어루만지십니다. 오늘 당신의 따뜻한 공감 한마디가 누군가에게 큰 위로가 됩니다.' },
];

const NIGHT_SKY_EN: Array<{ title: string; body: string }> = [
  { title: 'Star of Early Spring · Fresh Beginnings', body: 'Like the first bright stars welcoming spring, God delights in doing a new thing in your life. Open today trusting the Creator who makes all things fresh.' },
  { title: 'Pleiades of Late Spring · Faithful Order', body: 'Just as the Pleiades mentioned in Job keep their steady place in heaven, God’s faithful order upholds your quiet diligence today.' },
  { title: 'Twin Lights of Early Summer · Fellowship', body: 'Like companion stars shining side by side, God designed us for encouragement and fellowship. Be a warm light in someone’s conversation today.' },
  { title: 'Midsummer Milky Way · Sheltered Home', body: 'Remember God showing Abraham the night sky to promise blessing over his household. Pray His gentle shelter over your home and loved ones today.' },
  { title: 'Summer Sun & Stars · Radiant Calling', body: 'Psalm 19 declares that the heavens proclaim God’s glory like a joyful sun running its course. Let your steady kindness shine brightly today.' },
  { title: 'Harvest Season Sky · Careful Fruitfulness', body: 'Just as autumn skies watch over a ripening harvest, none of your quiet prayers or faithful labor goes unnoticed by God.' },
  { title: 'Autumn Equinox Sky · Balance & Peace', body: 'Like the balanced light of autumn, God is a God of peace and harmony. Welcome a calm balance between work, rest, and relationships today.' },
  { title: 'Deep Autumn Stars · Clear Insight', body: 'The darker the evening sky, the clearer the stars shine. Step past surface noise today and rest in God’s quiet, steady clarity.' },
  { title: 'Winter Star of Hope · Guided Vision', body: 'Like the star that guided the wise men toward Christ, God places hopeful signposts along your path. Lift your eyes beyond today’s small worries.' },
  { title: 'Orion of Midwinter · Steadfast Endurance', body: 'Like Orion named in the Book of Job, faithful steadiness shines brightest in demanding seasons. Walk with calm perseverance today.' },
  { title: 'Morning Star of Dawn · Fresh Wisdom', body: 'Like the morning star rising before daybreak, Christ brings fresh clarity to weary minds. Ask Him for clear, creative wisdom today.' },
  { title: 'Late Winter Sky · Gentle Compassion', body: 'Holding the quiet promise of spring, the night sky reminds us that God comforts tender hearts first. Let your empathy bless someone today.' },
];

const NIGHT_SKY_ES: Array<{ title: string; body: string }> = [
  { title: 'Estrella de Primavera · Nuevos Comienzos', body: 'Como las estrellas que anuncian la primavera, Dios hace cosas nuevas en tu vida. Abre hoy confiando en el Creador que renueva cada paso.' },
  { title: 'Pléyades de Primavera · Orden Fiel', body: 'Así como las Pléyades mencionadas en Job guardan su lugar en el cielo, el orden fiel de Dios sostiene hoy tu esfuerzo silencioso.' },
  { title: 'Luces Gemelas · Compañía y Encuentro', body: 'Como estrellas que brillan juntas, Dios nos creó para animarnos mutuamente. Sé una palabra cálida en tus conversaciones hoy.' },
  { title: 'Vía Láctea de Verano · Abrigo del Hogar', body: 'Recuerda cuando Dios mostró las estrellas a Abraham para bendecir su hogar. Pide hoy Su protección tierna sobre tu familia.' },
  { title: 'Sol y Estrellas · Luz con Propósito', body: 'El Salmo 19 canta que los cielos cuentan la gloria de Dios. Deja que tu bondad firme ilumine hoy cada lugar donde estés.' },
  { title: 'Cielo de Cosecha · Frutos Fieles', body: 'Como el cielo de la cosecha cuida el fruto maduro, ninguna oración ni esfuerzo sincero tuyo pasa inadvertido ante Dios.' },
  { title: 'Equilibrio de Otoño · Armonía y Paz', body: 'Como la luz equilibrada del otoño, Dios es Dios de paz y orden. Disfruta hoy un sano equilibrio entre labor y descanso.' },
  { title: 'Estrellas de Otoño · Claridad Interior', body: 'Cuanto más serena es la noche, más claras brillan las estrellas. Aléjate un momento del ruido y descansa en la verdad de Dios.' },
  { title: 'Estrella de Esperanza · Visión Guiada', body: 'Como la estrella que guió a los sabios hacia Cristo, Dios pone señales de esperanza en tu camino. Mira más allá de la prisa de hoy.' },
  { title: 'Orión de Invierno · Perseverancia Firme', body: 'Como la constelación de Orión citada en Job, la fe constante brilla más en temporadas exigentes. Camina hoy con paciencia firme.' },
  { title: 'Estrella de la Mañana · Sabiduría Fresca', body: 'Como el lucero del alba antes del amanecer, Cristo trae claridad fresca. Pídele hoy sabiduría sencilla y oportuna.' },
  { title: 'Cielo hacia la Primavera · Compasión', body: 'Guardando la promesa cercana de la primavera, el cielo recuerda que Dios abraza primero a los corazones tiernos.' },
];

// =========================================================================
// 3. 오늘의 묵상 컬러 (12 Grace Colors — 주술적 행운색 X, 말씀 리마인더 컬러 O)
// =========================================================================
const GRACE_COLORS_KO: GraceColorInfo[] = [
  { name: '포레스트 그린', hex: '#22c55e', meaning: '푸른 풀밭과 안식', reminderText: '오늘 주변에서 초록빛을 볼 때마다 "여호와는 나의 목자시니 내게 부족함이 없으리로다"를 조용히 떠올려 보세요.' },
  { name: '딥 사파이어 블루', hex: '#3b82f6', meaning: '하늘의 평강과 신뢰', reminderText: '파란 하늘이나 푸른 소품을 마주칠 때마다 "평안을 너희에게 주노라" 하신 예수님의 약속을 기억해 보세요.' },
  { name: '골든 앰버', hex: '#f59e0b', meaning: '말씀의 빛과 지혜', reminderText: '따뜻한 금빛이나 노을빛을 볼 때마다 "주의 말씀은 내 발에 등이요 내 길에 빛이니이다"를 마음속으로 고백해 보세요.' },
  { name: '올리브 리프', hex: '#84cc16', meaning: '화평과 회복의 표징', reminderText: '노아의 비둘기가 물어온 올리브 잎처럼, 부드러운 연둣빛을 볼 때마다 가정과 일터의 화평을 짧게 기도해 보세요.' },
  { name: '스카이 세레니티', hex: '#38bdf8', meaning: '맑은 호흡과 여유', reminderText: '맑은 하늘빛을 볼 때마다 어깨의 힘을 툭 풀고 "주님, 오늘도 나와 함께해 주세요"라고 3초간 숨을 고르세요.' },
  { name: '로즈 블로섬', hex: '#f43f5e', meaning: '따뜻한 사랑과 긍휼', reminderText: '부드러운 분홍빛이나 꽃을 볼 때마다 오늘 만나는 이웃에게 먼저 따뜻한 말 한마디를 건네기로 다짐해 보세요.' },
  { name: '에메랄드 시드', hex: '#10b981', meaning: '새 생명과 성장', reminderText: '싱그러운 에메랄드빛을 마주할 때마다 오늘 심는 작은 순종이 아름다운 열매로 자랄 것을 기대해 보세요.' },
  { name: '라벤더 그레이스', hex: '#a855f7', meaning: '기도와 고요한 묵상', reminderText: '은은한 보랏빛을 볼 때마다 분주한 생각을 잠시 멈추고 10초간 감사 기도를 올려드려 보세요.' },
  { name: '웜 테라코타', hex: '#ea580c', meaning: '든든한 땅과 성실', reminderText: '따뜻한 흙빛이나 나무색을 볼 때마다 오늘 맡겨진 일상의 자리를 정직하고 기쁘게 지켜낼 힘을 구해 보세요.' },
  { name: '로열 인디고', hex: '#6366f1', meaning: '깊은 분별과 담대함', reminderText: '깊은 남빛을 마주할 때마다 흔들리지 않는 믿음과 바른 판단력을 주시는 하나님을 신뢰해 보세요.' },
  { name: '퓨어 아이보리', hex: '#e2e8f0', meaning: '정결한 마음과 새 출발', reminderText: '깨끗한 흰빛이나 아이보리색을 볼 때마다 어제의 아쉬움을 내려놓고 은혜로 새 하루를 여는 기쁨을 누리세요.' },
  { name: '선셋 코랄', hex: '#fb7185', meaning: '감사와 따뜻한 격려', reminderText: '포근한 코랄빛을 볼 때마다 오늘 나에게 고마운 사람 한 명의 이름을 떠올리며 짧게 축복해 보세요.' },
];

const GRACE_COLORS_EN: GraceColorInfo[] = [
  { name: 'Forest Green', hex: '#22c55e', meaning: 'Green Pastures & Rest', reminderText: 'Whenever you spot green today, gently recall: "The Lord is my shepherd; I shall lack nothing."' },
  { name: 'Deep Sapphire', hex: '#3b82f6', meaning: 'Heavenly Peace & Trust', reminderText: 'Each time you notice blue today, remember Jesus’ promise: "My peace I give to you."' },
  { name: 'Golden Amber', hex: '#f59e0b', meaning: 'Light & Guidance', reminderText: 'Whenever warm gold catches your eye, recall: "Your word is a lamp to my feet and a light to my path."' },
  { name: 'Olive Leaf', hex: '#84cc16', meaning: 'Peace & New Hope', reminderText: 'Like the olive leaf after the storm, let soft green remind you to pray peace over your home.' },
  { name: 'Sky Serenity', hex: '#38bdf8', meaning: 'Clear Breath & Calm', reminderText: 'Each glimpse of light blue invites you to drop your shoulders and whisper, "Lord, walk with me."' },
  { name: 'Rose Blossom', hex: '#f43f5e', meaning: 'Warm Love & Mercy', reminderText: 'When you see rose tones today, choose one extra word of kindness for someone nearby.' },
  { name: 'Emerald Seed', hex: '#10b981', meaning: 'Living Growth', reminderText: 'Let emerald tones remind you that small faithful seeds planted today grow in God’s time.' },
  { name: 'Lavender Grace', hex: '#a855f7', meaning: 'Quiet Prayer', reminderText: 'Whenever you see soft violet, pause 10 seconds to offer a quick prayer of thanks.' },
  { name: 'Warm Terracotta', hex: '#ea580c', meaning: 'Steadiness & Diligence', reminderText: 'Warm earthy tones remind you to honor God faithfully in ordinary everyday work.' },
  { name: 'Royal Indigo', hex: '#6366f1', meaning: 'Discernment & Courage', reminderText: 'Deep indigo reminds you to lean on God’s steady wisdom and quiet boldness today.' },
  { name: 'Pure Ivory', hex: '#e2e8f0', meaning: 'Clean Heart & Fresh Start', reminderText: 'Soft white reminds you that God’s mercies are brand new for you this morning.' },
  { name: 'Sunset Coral', hex: '#fb7185', meaning: 'Gratitude & Warmth', reminderText: 'Whenever warm coral appears, picture one person you appreciate and pray a blessing for them.' },
];

const GRACE_COLORS_ES: GraceColorInfo[] = [
  { name: 'Verde Bosque', hex: '#22c55e', meaning: 'Pastos Verdes y Descanso', reminderText: 'Cada vez que veas color verde hoy, recuerda: "El Señor es mi pastor; nada me faltará".' },
  { name: 'Azul Zafiro', hex: '#3b82f6', meaning: 'Paz Celestial y Confianza', reminderText: 'Al notar el color azul hoy, recuerda la promesa de Jesús: "Mi paz os doy".' },
  { name: 'Ámbar Dorado', hex: '#f59e0b', meaning: 'Luz y Dirección', reminderText: 'Cuando veas tonos dorados hoy, recuerda: "Lámpara es a mis pies Tu palabra".' },
  { name: 'Hoja de Olivo', hex: '#84cc16', meaning: 'Paz y Esperanza', reminderText: 'Como la hoja de olivo tras la lluvia, que el verde suave te recuerde orar paz por tu hogar.' },
  { name: 'Azul Cielo', hex: '#38bdf8', meaning: 'Respiro y Serenidad', reminderText: 'Cada mirada al celeste te invita a relajar los hombros y decir: "Señor, camina conmigo".' },
  { name: 'Rosa Cálido', hex: '#f43f5e', meaning: 'Amor y Compasión', reminderText: 'Cuando veas tonos rosados hoy, regala una palabra extra de cariño a alguien cercano.' },
  { name: 'Verde Esmeralda', hex: '#10b981', meaning: 'Vida y Crecimiento', reminderText: 'Que el verde esmeralda te recuerde que cada pequeña semilla fiel da fruto a su tiempo.' },
  { name: 'Lavanda de Gracia', hex: '#a855f7', meaning: 'Oración Serena', reminderText: 'Al ver tonos violetas hoy, pausa 10 segundos para dar gracias a Dios en silencio.' },
  { name: 'Terracota Cálida', hex: '#ea580c', meaning: 'Firmeza y Servicio', reminderText: 'Los tonos tierra te recuerdan honrar a Dios con fidelidad en tus tareas diarias.' },
  { name: 'Índigo Profundo', hex: '#6366f1', meaning: 'Sabiduría y Valor', reminderText: 'El azul profundo te recuerda apoyarte en la sabiduría y firmeza del Señor hoy.' },
  { name: 'Marfil Puro', hex: '#e2e8f0', meaning: 'Corazón Limpio y Nuevo Inicio', reminderText: 'El blanco suave te recuerda que las misericordias de Dios son nuevas cada mañana.' },
  { name: 'Coral Atardecer', hex: '#fb7185', meaning: 'Gratitud y Aliento', reminderText: 'Al notar tonos coral hoy, recuerda a una persona querida y ora una bendición por ella.' },
];

// =========================================================================
// 4. 오늘의 영적 닻 (Spiritual Anchor — 부적/행운템 X, 마음을 붙드는 작은 습관·매개체 O)
// =========================================================================
const ANCHORS_KO: Array<{ title: string; guide: string }> = [
  { title: '따뜻한 차 한 잔의 3분 쉼', guide: '찻잔의 온기를 느끼는 3분 동안만큼은 모든 염려를 내려놓고 주님께 맡기는 짧은 기도를 드려 보세요.' },
  { title: '창밖 하늘 바라보기 30초', guide: '바쁜 일정 중 고개를 들어 하늘을 보며 "천지를 지으신 하나님이 오늘 나의 도움입니다"라고 고백해 보세요.' },
  { title: '손목·어깨 긴장 풀기 호흡', guide: '어깨에 들어간 힘을 툭 풀며 4초 들이마시고 6초 내쉬는 동안 오늘의 말씀을 속으로 되뇌어 보세요.' },
  { title: '작은 메모지 한 줄 말씀', guide: '오늘 받은 성경 구절 중 가장 마음에 남는 한 구절을 메모해 책상이나 휴대폰 화면에 잠깐 띄워 두세요.' },
  { title: '식탁 앞 5초 감사 멈춤', guide: '수저를 들기 전 5초간 눈을 감고 일용할 양식과 함께하는 사람들을 위해 진심으로 감사해 보세요.' },
  { title: '문고리 잡을 때 짧은 축복 기도', guide: '집이나 사무실 문을 열 때마다 "이 문을 들어오고 나가는 모든 걸음을 주님이 지켜주세요"라고 속삭여 보세요.' },
  { title: '물 한 잔과 마음 리셋', guide: '맑은 물을 한 잔 천천히 마시며 머릿속의 복잡한 생각들을 씻어내고 맑은 지혜를 구해 보세요.' },
  { title: '잠시 신발 끈 묶듯 마음 정돈', guide: '서두르던 걸음을 1분만 늦추고 "주님, 제 속도보다 주님의 평안을 먼저 따르겠습니다" 고백해 보세요.' },
  { title: '거울 앞 미소 리마인더', guide: '거울을 볼 때마다 부드럽게 웃으며 "나는 주님이 기뻐하시고 사랑하시는 사람입니다"라고 스스로를 축복하세요.' },
  { title: '오후 3시 10초 감사 알람', guide: '나른해지기 쉬운 오후 시간에 지금까지 무사히 보내온 하루를 떠올리며 작은 감사 한 가지를 찾아보세요.' },
  { title: '가벼운 산책 5분 동행 기도', guide: '점심 후나 이동 중에 5분만 천천히 걸으며 옆에 주님이 나란히 걸어가신다고 상상하며 대화해 보세요.' },
  { title: '저녁 세수하며 하루 내려놓기', guide: '하루를 마치고 따뜻한 물로 씻으며 오늘의 아쉬움과 피로를 모두 주님 손에 평안히 맡겨드리세요.' },
];

const ANCHORS_EN: Array<{ title: string; guide: string }> = [
  { title: '3-Minute Warm Cup Pause', guide: 'While holding a warm cup of tea or water, release every worry for 3 quiet minutes into God’s hands.' },
  { title: '30-Second Sky Gaze', guide: 'Lift your eyes to the sky midday and whisper, "My help comes from the Lord, Maker of heaven and earth."' },
  { title: 'Shoulder-Drop Breath', guide: 'Drop tense shoulders, inhale 4 seconds and exhale 6, quietly repeating today’s key Scripture phrase.' },
  { title: 'One-Line Desk Note', guide: 'Jot the shortest line from today’s verse on a note or phone reminder to revisit during busy hours.' },
  { title: '5-Second Meal Stillness', guide: 'Pause 5 unhurried seconds before eating to thank God sincerely for provision and loved ones.' },
  { title: 'Doorway Blessing Prayer', guide: 'Each time you cross a doorway today, whisper, "Lord, guard my coming in and going out."' },
  { title: 'Glass of Water Reset', guide: 'Drink a glass of fresh water slowly while asking God to clear cluttered thoughts and refresh your mind.' },
  { title: '1-Minute Unhurried Step', guide: 'Slow your walking pace for one full minute and choose God’s calm over frantic rush.' },
  { title: 'Mirror Smile Reminder', guide: 'When you pass a mirror today, smile gently and remember you are deeply loved by God.' },
  { title: 'Mid-Afternoon Thanks Check', guide: 'Pause around 3 PM to name one quiet mercy that has already carried you through today.' },
  { title: '5-Minute Walking Prayer', guide: 'Take a brief, calm walk and talk honestly with Jesus as a close friend walking beside you.' },
  { title: 'Evening Wash & Release', guide: 'As you wash away the day tonight, symbolically hand every lingering stress over to God.' },
];

const ANCHORS_ES: Array<{ title: string; guide: string }> = [
  { title: 'Pausa de 3 Min con Bebida Tibia', guide: 'Mientras sostienes una taza tibia, suelta toda preocupación durante 3 minutos en las manos de Dios.' },
  { title: 'Mirada al Cielo de 30 Segundos', guide: 'Levanta la vista al cielo a mitad del día y susurra: "Mi socorro viene del Señor, Creador del cielo y la tierra".' },
  { title: 'Respiración Soltando Hombros', guide: 'Relaja los hombros, inhala 4 segundos y exhala 6 recordando en silencio el versículo de hoy.' },
  { title: 'Nota Breve con la Palabra', guide: 'Anota la frase más corta del versículo de hoy en un papel o en tu celular para releerla luego.' },
  { title: '5 Segundos de Gracias al Comer', guide: 'Haz una pausa serena de 5 segundos antes de comer agradeciendo de corazón la provisión de Dios.' },
  { title: 'Oración al Cruzar la Puerta', guide: 'Cada vez que salgas o entres hoy, susurra: "Señor, guarda mi salida y mi entrada".' },
  { title: 'Vaso de Agua y Mente Clara', guide: 'Bebe un vaso de agua fresca despacio pidiendo a Dios que despeje el ruido y renueve tu ánimo.' },
  { title: '1 Minuto de Paso Sin Prisa', guide: 'Baja el ritmo de tu caminar durante un minuto eligiendo la calma de Dios sobre el apuro.' },
  { title: 'Recordatorio de Sonrisa', guide: 'Al mirarte al espejo hoy, sonríe suavemente recordando que eres profundamente amado por Dios.' },
  { title: 'Pausa Agradecida de la Tarde', guide: 'Detente brevemente por la tarde para nombrar un favor silencioso que ya recibiste hoy.' },
  { title: 'Caminata de 5 Min con Dios', guide: 'Da una breve caminata tranquila conversando con Jesús como un amigo cercano a tu lado.' },
  { title: 'Soltar el Día al Lavarte', guide: 'Al refrescarte esta noche, entrega simbólicamente cada cansancio pendiente en las manos de Dios.' },
];

// =========================================================================
// 메인 생성 함수: 생년월일 + 오늘 날짜 + 시드 -> 기독교 창조 섭리 데이터 생성
// =========================================================================
export function buildCreationProvidence(
  birthDateStr: string,
  seed: number,
  lang: Language,
  displayName: string
): CreationProvidenceData {
  const now = new Date();
  let bYear = 1990;
  let bMonth = 5;
  let bDay = 15;
  if (birthDateStr) {
    const parts = birthDateStr.split('-').map(Number);
    if (parts.length === 3 && parts[0] > 1900 && parts[1] >= 1 && parts[2] >= 1) {
      [bYear, bMonth, bDay] = parts;
    }
  }

  const birthGanji = getGanjiIndex(bYear, bMonth, bDay);
  const todayGanji = getGanjiIndex(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const birthElement = stemToElement(birthGanji);
  const todayElement = stemToElement(todayGanji);
  const rhythmType = computeDailyRhythm(birthElement, todayElement);
  const constellationIndex = getConstellationIndex(bMonth, bDay);

  const weatherPool = WEATHER_TITLES[lang][rhythmType];
  const spiritualWeatherTitle = weatherPool[Math.abs(seed + todayGanji) % weatherPool.length];
  const temperamentBadge = TEMPERAMENT_BADGE[lang][birthElement];

  const heartClimateSummary =
    lang === 'es'
      ? HEART_CLIMATE_ES[birthElement][rhythmType]
      : lang === 'en'
      ? HEART_CLIMATE_EN[birthElement][rhythmType]
      : HEART_CLIMATE_KO[birthElement][rhythmType];

  const skyList = lang === 'es' ? NIGHT_SKY_ES : lang === 'en' ? NIGHT_SKY_EN : NIGHT_SKY_KO;
  const sky = skyList[constellationIndex % skyList.length];

  const colorList = lang === 'es' ? GRACE_COLORS_ES : lang === 'en' ? GRACE_COLORS_EN : GRACE_COLORS_KO;
  const graceColor = colorList[Math.abs(seed + todayGanji * 3) % colorList.length];

  const anchorList = lang === 'es' ? ANCHORS_ES : lang === 'en' ? ANCHORS_EN : ANCHORS_KO;
  const anchor = anchorList[Math.abs((seed >>> 2) + todayGanji) % anchorList.length];

  const verseConnectionLine =
    lang === 'es'
      ? `Hoy, con el clima interior de "${spiritualWeatherTitle.toLowerCase()}" sobre ${displayName}, te compartimos esta Palabra de consuelo y dirección.`
      : lang === 'en'
      ? `Because today brings "${spiritualWeatherTitle.toLowerCase()}" for ${displayName}, this Scripture speaks right into your day.`
      : `오늘 ${displayName}의 마음 기후가 '${spiritualWeatherTitle}' 흐름을 지나고 있기에, 주님께서 이 말씀을 꼭 맞게 예비해 주셨습니다.`;

  return {
    birthElement,
    todayElement,
    rhythmType,
    constellationIndex,
    spiritualWeatherTitle,
    temperamentBadge,
    heartClimateSummary,
    nightSkyTitle: sky.title,
    nightSkyMeditation: sky.body,
    graceColor,
    spiritualAnchorTitle: anchor.title,
    spiritualAnchorGuide: anchor.guide,
    verseConnectionLine,
  };
}
