import { FaceMetrics } from '../types/bible';
import { CatalogVerseEntry, expandCompactVerse } from './verseTypes';
import { EXTRA_REST_JOY_VERSES } from './versesRestJoy';
import { EXTRA_COURAGE_WISDOM_VERSES } from './versesCourageWisdom';
import { EXTRA_LOVE_PEACE_VERSES } from './versesLovePeace';

export type { CatalogVerseEntry };

// 6대 테마 × 30개 구절 = 총 180개 성경 말씀 라이브러리 (한글 + 영어 Public Domain WEB)
const BASE_VERSE_CATALOG: CatalogVerseEntry[] = [
  // ==================== 1. REST (쉼과 회복, 위로) ====================
  {
    id: 'rest-1',
    mood: 'rest',
    ko: {
      themeTitle: '수고한 마음을 안아주시는 쉼의 하루',
      themeSubtitle: '무거운 짐을 내려놓고 편안히 쉬어가는 날',
      verse: {
        reference: '마태복음 11장 28절',
        testament: '신약',
        book: '마태복음',
        chapter: 11,
        verseRange: '28',
        text: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라',
        context: '지치고 힘든 일상 속에서 애쓰는 사람들에게 예수님이 두 팔을 벌려 참된 쉼을 약속하신 따뜻한 초대입니다.',
        keyword: '쉼과 회복',
      },
      reflectionCore:
        '혼자서 모든 일을 다 짊어지려 애쓰지 않아도 괜찮습니다. 오늘만큼은 어깨에 들어간 힘을 잠시 풀고, 걱정되는 일들을 주님 앞에 내려놓으며 숨을 고르는 시간을 가져 보세요.',
      confession: '내 힘이 아닌 주님의 품 안에서 편안한 쉼을 누립니다.',
    },
    en: {
      themeTitle: 'A Day of Gentle Rest for Your Soul',
      themeSubtitle: 'Lay down every heavy weight and breathe freely',
      verse: {
        reference: 'Matthew 11:28',
        testament: 'NT',
        book: 'Matthew',
        chapter: 11,
        verseRange: '28',
        text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
        context: 'Jesus warmly invites tired hearts to step away from constant striving and receive true renewal.',
        keyword: 'Rest & Renewal',
      },
      reflectionCore:
        'You do not have to carry every responsibility alone today. Unclench your shoulders, pause for a quiet breath, and hand your heaviest concerns to the Lord.',
      confession: 'I find true rest in Christ rather than in my own striving.',
    },
  },
  {
    id: 'rest-2',
    mood: 'rest',
    ko: {
      themeTitle: '푸른 풀밭과 잔잔한 물가로 이끄시는 주님',
      themeSubtitle: '부족함 없이 내 마음을 다시 일으켜 주시는 은혜',
      verse: {
        reference: '시편 23편 1-3절',
        testament: '구약',
        book: '시편',
        chapter: 23,
        verseRange: '1-3',
        text: '여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다 내 영혼을 소성시키시고 자기 이름을 위하여 의의 길로 인도하시는도다',
        context: '다윗이 인생의 고비마다 자신을 먹이시고 지켜주신 하나님을 선한 목자로 고백한 가장 사랑받는 시편입니다.',
        keyword: '돌보심과 위로',
      },
      reflectionCore:
        '우리가 불안해지는 이유는 가진 것이 부족해서라기보다, 나를 돌보시는 분을 잠시 잊기 때문입니다. 오늘도 선한 목자 되신 주님이 가장 좋은 길로 이끌고 계심을 믿고 마음을 놓아 보세요.',
      confession: '주님이 나의 목자이시니 내 하루는 안전합니다.',
    },
    en: {
      themeTitle: 'Led Beside Still Waters',
      themeSubtitle: 'Cared for and refreshed by the Good Shepherd',
      verse: {
        reference: 'Psalm 23:1-3',
        testament: 'OT',
        book: 'Psalms',
        chapter: 23,
        verseRange: '1-3',
        text: 'Yahweh is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
        context: 'David’s beloved psalm celebrates God’s steady care and gentle guidance through every valley.',
        keyword: 'Care & Comfort',
      },
      reflectionCore:
        'Anxiety grows when we focus on what feels missing. Peace returns when we remember who walks beside us. Trust your Shepherd’s gentle pace today.',
      confession: 'Because the Lord is my Shepherd, my soul is secure.',
    },
  },
  {
    id: 'rest-3',
    mood: 'rest',
    ko: {
      themeTitle: '지친 날개에 새 힘을 부어주시는 하나님',
      themeSubtitle: '독수리처럼 다시 힘차게 날아오르는 회복의 날',
      verse: {
        reference: '이사야 40장 31절',
        testament: '구약',
        book: '이사야',
        chapter: 40,
        verseRange: '31',
        text: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다',
        context: '오랜 기다림과 고단함에 지친 백성들에게 하나님을 바라볼 때 하늘의 새 힘이 부어진다는 약속의 말씀입니다.',
        keyword: '새 힘과 회복',
      },
      reflectionCore:
        '내 체력과 의지가 바닥난 것처럼 느껴질 때가 바로 하나님이 주시는 새 힘을 경험할 순간입니다. 억지로 버티려 하지 말고 잠깐 하늘을 올려다보며 주님의 도우심을 구해 보세요.',
      confession: '주님을 바라볼 때 내 마음에 새 힘이 채워집니다.',
    },
    en: {
      themeTitle: 'Renewed Strength Like Eagles',
      themeSubtitle: 'Fresh energy from heaven for tired hearts',
      verse: {
        reference: 'Isaiah 40:31',
        testament: 'OT',
        book: 'Isaiah',
        chapter: 40,
        verseRange: '31',
        text: 'Those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
        context: 'God promises weary believers that trusting Him brings fresh endurance beyond human limits.',
        keyword: 'Renewed Strength',
      },
      reflectionCore:
        'When your own energy runs low, it is the exact moment to receive God’s fresh strength. Pause, look up, and let Him lift your spirit today.',
      confession: 'As I wait on the Lord, He renews my strength.',
    },
  },
  {
    id: 'rest-4',
    mood: 'rest',
    ko: {
      themeTitle: '모든 염려를 주님께 맡기는 가벼운 하루',
      themeSubtitle: '나를 세심하게 돌보시는 하나님의 손길',
      verse: {
        reference: '베드로전서 5장 7절',
        testament: '신약',
        book: '베드로전서',
        chapter: 5,
        verseRange: '7',
        text: '너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라',
        context: '어려운 시기를 지나던 성도들에게 사도 베드로가 걱정을 혼자 끌어안지 말고 돌보시는 하나님께 넘겨드리라고 권면한 말씀입니다.',
        keyword: '맡김과 돌봄',
      },
      reflectionCore:
        '걱정을 오래 붙잡고 있다고 문제가 저절로 풀리지는 않습니다. 오늘 머릿속을 맴도는 고민들을 하나씩 주님께 넘겨드리고, 가벼운 마음으로 하루를 살아가 보세요.',
      confession: '나를 돌보시는 주님께 오늘의 모든 걱정을 맡깁니다.',
    },
    en: {
      themeTitle: 'Casting Every Care Upon Him',
      themeSubtitle: 'A lighter day knowing God personally cares for you',
      verse: {
        reference: '1 Peter 5:7',
        testament: 'NT',
        book: '1 Peter',
        chapter: 5,
        verseRange: '7',
        text: 'Casting all your worries on him, because he cares for you.',
        context: 'Peter reassures burdened believers that God truly cares about every detail of their lives.',
        keyword: 'Care & Release',
      },
      reflectionCore:
        'Holding onto worry never solves tomorrow’s problems. Hand each anxious thought to the One who deeply cares for you and walk lighter today.',
      confession: 'I place every worry in God’s hands because He cares for me.',
    },
  },
  {
    id: 'rest-5',
    mood: 'rest',
    ko: {
      themeTitle: '졸지도 주무시지도 않고 지키시는 도움',
      themeSubtitle: '언제 어디서나 내 곁을 지키는 든든한 보호',
      verse: {
        reference: '시편 121편 1-2절',
        testament: '구약',
        book: '시편',
        chapter: 121,
        verseRange: '1-2',
        text: '내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올까 나의 도움은 천지를 지으신 여호와에게서로다',
        context: '먼 길을 떠나는 순례자들이 위험 속에서도 창조주 하나님의 변함없는 보호를 의지하며 부른 노래입니다.',
        keyword: '도움과 보호',
      },
      reflectionCore:
        '막막한 일이 눈앞에 있을 때 땅만 내려다보면 마음이 더 무거워집니다. 시선을 들어 온 세상을 만드신 하나님을 바라보세요. 가장 필요한 때에 가장 알맞은 도움을 보내주실 것입니다.',
      confession: '나의 참된 도움은 하늘과 땅을 지으신 하나님께 있습니다.',
    },
    en: {
      themeTitle: 'Help from the Maker of Heaven and Earth',
      themeSubtitle: 'Steady protection watching over every step',
      verse: {
        reference: 'Psalm 121:1-2',
        testament: 'OT',
        book: 'Psalms',
        chapter: 121,
        verseRange: '1-2',
        text: 'I will lift up my eyes to the hills. Where does my help come from? My help comes from Yahweh, who made heaven and earth.',
        context: 'A pilgrim song reminding travelers that the Creator watches over them without sleeping.',
        keyword: 'Help & Protection',
      },
      reflectionCore:
        'Looking only at our problems drains our hope. Lift your eyes today to the Creator who sends the exact help you need at the right time.',
      confession: 'My help comes from the Lord who made heaven and earth.',
    },
  },
  {
    id: 'rest-6',
    mood: 'rest',
    ko: {
      themeTitle: '잠잠히 하나님만 바라는 고요한 쉼터',
      themeSubtitle: '흔들리는 마음을 붙잡아 주는 든든한 반석',
      verse: {
        reference: '시편 62편 1-2절',
        testament: '구약',
        book: '시편',
        chapter: 62,
        verseRange: '1-2',
        text: '나의 영혼이 잠잠히 하나님만 바람이여 나의 구원이 그에게서 나오는도다 오직 그만이 나의 반석이시요 나의 구원이시요 나의 요새이시니 내가 크게 흔들리지 아니하리로다',
        context: '주변의 압박과 흔들림 속에서도 오직 하나님을 안전한 반석 삼아 마음의 중심을 지킨 다윗의 고백입니다.',
        keyword: '든든한 피난처',
      },
      reflectionCore:
        '주변이 시끄럽고 바쁠수록 잠시 멈춰 서는 용기가 필요합니다. 하나님이 나의 든든한 반석이 되어 주시니, 작은 파도에 크게 흔들리지 말고 차분히 중심을 지켜 보세요.',
      confession: '하나님이 나의 반석이시니 내 마음은 크게 흔들리지 않습니다.',
    },
    en: {
      themeTitle: 'Quiet Rest in God Alone',
      themeSubtitle: 'Standing firm on an unshakable Rock',
      verse: {
        reference: 'Psalm 62:1-2',
        testament: 'OT',
        book: 'Psalms',
        chapter: 62,
        verseRange: '1-2',
        text: 'My soul rests in God alone. My salvation is from him. He alone is my rock and my salvation, my fortress. I will never be greatly shaken.',
        context: 'David finds calm stability in God even when surrounded by pressure and noise.',
        keyword: 'Unshakable Rock',
      },
      reflectionCore:
        'When life gets noisy, resting quietly in God restores your balance. Because He is your rock, you will not be shaken today.',
      confession: 'God alone is my rock and refuge; I will not be shaken.',
    },
  },

  // ==================== 2. JOY (기쁨과 감사, 축복) ====================
  {
    id: 'joy-1',
    mood: 'joy',
    ko: {
      themeTitle: '모든 일에 감사하며 웃음 짓는 복된 날',
      themeSubtitle: '기쁨과 기도, 감사가 어우러지는 건강한 하루',
      verse: {
        reference: '데살로니가전서 5장 16-18절',
        testament: '신약',
        book: '데살로니가전서',
        chapter: 5,
        verseRange: '16-18',
        text: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',
        context: '사도 바울이 어떤 상황 속에서도 기쁨과 기도, 감사를 놓치지 말라고 성도들에게 전한 따뜻한 권면입니다.',
        keyword: '기쁨과 감사',
      },
      reflectionCore:
        '기쁨은 모든 조건이 완벽해서 생기는 것이 아니라, 작은 일에도 고마워할 줄 아는 마음에서 자라납니다. 오늘 만나는 사람들에게 따뜻한 미소로 기분 좋은 에너지를 나눠 보세요.',
      confession: '오늘 하루 작은 일에도 감사하며 기쁘게 살아갑니다.',
    },
    en: {
      themeTitle: 'A Day Filled with Joy and Gratitude',
      themeSubtitle: 'Living in God’s will with a thankful heart',
      verse: {
        reference: '1 Thessalonians 5:16-18',
        testament: 'NT',
        book: '1 Thessalonians',
        chapter: 5,
        verseRange: '16-18',
        text: 'Always rejoice. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.',
        context: 'Paul shares three simple daily rhythms that keep a believer’s heart bright in every season.',
        keyword: 'Joy & Gratitude',
      },
      reflectionCore:
        'Joy grows naturally in a thankful heart. Notice the small mercies around you today and pass your warmth on to everyone you meet.',
      confession: 'I choose joy, prayer, and gratitude in everything today.',
    },
  },
  {
    id: 'joy-2',
    mood: 'joy',
    ko: {
      themeTitle: '주님 안에서 늘 기뻐하는 밝은 하루',
      themeSubtitle: '상황을 넘어 마음 깊은 곳에서 솟아나는 기쁨',
      verse: {
        reference: '빌립보서 4장 4절',
        testament: '신약',
        book: '빌립보서',
        chapter: 4,
        verseRange: '4',
        text: '주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라',
        context: '어려운 환경에 있던 바울이 오히려 성도들을 위로하며 주님과 함께하는 기쁨을 두 번이나 강조한 말씀입니다.',
        keyword: '변함없는 기쁨',
      },
      reflectionCore:
        '바쁜 하루를 보내다 보면 사소한 일에 인상을 찌푸리기 쉽습니다. 그럴 때마다 "주님이 나와 함께하신다"는 사실을 떠올리며 다시 밝은 표정을 되찾아 보세요.',
      confession: '어떤 상황에서도 주님과 함께하는 기쁨을 지켜냅니다.',
    },
    en: {
      themeTitle: 'Rejoicing Always in the Lord',
      themeSubtitle: 'Steady gladness rooted in Christ',
      verse: {
        reference: 'Philippians 4:4',
        testament: 'NT',
        book: 'Philippians',
        chapter: 4,
        verseRange: '4',
        text: 'Rejoice in the Lord always! Again I will say, Rejoice!',
        context: 'Written from prison, Paul proves that true gladness comes from closeness with Christ.',
        keyword: 'Abiding Joy',
      },
      reflectionCore:
        'Small frustrations can quickly steal a smile. Anchor your heart in Christ today and let His joy shine through your words.',
      confession: 'In the Lord, my heart stays glad and thankful.',
    },
  },
  {
    id: 'joy-3',
    mood: 'joy',
    ko: {
      themeTitle: '하나님이 선물로 정해주신 오늘 하루',
      themeSubtitle: '새롭게 주어진 오늘을 즐거워하며 누리는 복',
      verse: {
        reference: '시편 118편 24절',
        testament: '구약',
        book: '시편',
        chapter: 118,
        verseRange: '24',
        text: '이 날은 여호와께서 정하신 것이라 이 날에 우리가 즐거워하고 기뻐하리로다',
        context: '어려움을 지나 새 아침을 맞이한 시인이 오늘 하루 자체가 하나님의 귀한 선물임을 노래한 구절입니다.',
        keyword: '오늘의 선물',
      },
      reflectionCore:
        '오늘 하루는 어제의 연장선이 아니라 하나님이 새롭게 열어주신 특별한 선물입니다. 당연하게 느껴졌던 일상 속에서 오늘만의 작은 즐거움을 찾아 누려 보세요.',
      confession: '하나님이 주신 선물 같은 오늘 하루를 기쁘게 누립니다.',
    },
    en: {
      themeTitle: 'This Is the Day the Lord Has Made',
      themeSubtitle: 'Celebrating today as a fresh gift from God',
      verse: {
        reference: 'Psalm 118:24',
        testament: 'OT',
        book: 'Psalms',
        chapter: 118,
        verseRange: '24',
        text: 'This is the day that Yahweh has made. We will rejoice and be glad in it!',
        context: 'A joyful declaration welcoming each new morning as a deliberate gift from God.',
        keyword: 'Gift of Today',
      },
      reflectionCore:
        'Today is not just another routine—it is a fresh gift crafted by God. Look for one simple joy in your ordinary schedule and celebrate it.',
      confession: 'I welcome today with gladness as a gift from God.',
    },
  },
  {
    id: 'joy-4',
    mood: 'joy',
    ko: {
      themeTitle: '기쁨이 곧 내 삶을 지탱하는 힘',
      themeSubtitle: '주님으로 인한 즐거움이 일상의 활력이 되는 날',
      verse: {
        reference: '느헤미야 8장 10절',
        testament: '구약',
        book: '느헤미야',
        chapter: 8,
        verseRange: '10',
        text: '근심하지 말라 여호와로 인하여 기뻐하는 것이 너희의 힘이니라',
        context: '성벽을 재건하고 말씀을 들으며 울던 백성들에게 느헤미야가 슬픔을 거두고 하나님 안에서 기뻐하라고 격려한 말씀입니다.',
        keyword: '기쁨의 힘',
      },
      reflectionCore:
        '마음이 무거울 때는 몸도 쉽게 지치지만, 마음에 기쁨이 있으면 어려운 일도 거뜬히 해낼 힘이 생깁니다. 오늘 근심 대신 감사와 웃음으로 내 안의 에너지를 채워 보세요.',
      confession: '하나님으로 인해 기뻐하는 마음이 오늘 나의 힘입니다.',
    },
    en: {
      themeTitle: 'The Joy of the Lord Is Your Strength',
      themeSubtitle: 'Turning gratitude into daily energy',
      verse: {
        reference: 'Nehemiah 8:10',
        testament: 'OT',
        book: 'Nehemiah',
        chapter: 8,
        verseRange: '10',
        text: 'Don’t be grieved, for the joy of Yahweh is your strength.',
        context: 'Nehemiah encouraged returning exiles that rejoicing in God’s goodness renews their strength.',
        keyword: 'Strength in Joy',
      },
      reflectionCore:
        'Heaviness drains energy, while joy multiplies endurance. Trade worry for gratitude today and feel your spirit strengthened.',
      confession: 'The joy of the Lord fills me with strength today.',
    },
  },
  {
    id: 'joy-5',
    mood: 'joy',
    ko: {
      themeTitle: '즐거운 마음으로 주님을 찬양하는 날',
      themeSubtitle: '감사의 노래가 일상에 흐르는 행복한 하루',
      verse: {
        reference: '시편 100편 1-2절',
        testament: '구약',
        book: '시편',
        chapter: 100,
        verseRange: '1-2',
        text: '온 땅이여 여호와께 즐거운 찬송을 부를지어다 기쁨으로 여호와를 섬기며 노래하면서 그의 앞에 나아갈지어다',
        context: '우리를 지으시고 돌보시는 하나님께 억지가 아닌 기쁜 마음으로 감사와 찬양을 올려드리는 시편입니다.',
        keyword: '기쁜 섬김',
      },
      reflectionCore:
        '해야 할 일들을 의무감으로만 대하면 금방 지치지만, 기쁜 마음으로 감사하며 임하면 하루가 훨씬 가벼워집니다. 좋아하는 찬양을 들으며 활기차게 하루를 열어 보세요.',
      confession: '기쁜 마음과 감사의 노래로 오늘 하루를 살아갑니다.',
    },
    en: {
      themeTitle: 'Serve the Lord with Gladness',
      themeSubtitle: 'Letting a song of thanks fill your routine',
      verse: {
        reference: 'Psalm 100:1-2',
        testament: 'OT',
        book: 'Psalms',
        chapter: 100,
        verseRange: '1-2',
        text: 'Shout for joy to Yahweh, all you lands! Serve Yahweh with gladness. Come before his presence with singing.',
        context: 'An invitation to approach God with cheerful gratitude rather than heavy obligation.',
        keyword: 'Cheerful Praise',
      },
      reflectionCore:
        'Duty alone wears us down, but gladness brings light to every task. Hum a thankful song as you go through your day.',
      confession: 'I serve the Lord with gladness and a thankful song today.',
    },
  },
  {
    id: 'joy-6',
    mood: 'joy',
    ko: {
      themeTitle: '생명의 길과 충만한 기쁨을 보이시는 주님',
      themeSubtitle: '주님과 동행할 때 누리는 깊은 만족과 평안',
      verse: {
        reference: '시편 16편 11절',
        testament: '구약',
        book: '시편',
        chapter: 16,
        verseRange: '11',
        text: '주께서 생명의 길을 내게 보이시리니 주의 앞에는 충만한 기쁨이 있고 주의 오른쪽에는 영원한 즐거움이 있나이다',
        context: '하나님 곁에 머무는 삶이야말로 가장 깊고 변치 않는 기쁨이 있음을 고백한 다윗의 감사 시편입니다.',
        keyword: '충만한 기쁨',
      },
      reflectionCore:
        '세상의 즐거움은 금방 지나가지만, 주님과 함께 걸으며 느끼는 보람과 기쁨은 오래 남습니다. 오늘 내 발걸음 속에 주님이 보여주시는 밝은 길에 집중해 보세요.',
      confession: '주님과 함께 걷는 길이 가장 기쁘고 복된 길입니다.',
    },
    en: {
      themeTitle: 'The Path of Life and Fullness of Joy',
      themeSubtitle: 'Deep satisfaction found in God’s presence',
      verse: {
        reference: 'Psalm 16:11',
        testament: 'OT',
        book: 'Psalms',
        chapter: 16,
        verseRange: '11',
        text: 'You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.',
        context: 'David testifies that walking closely with God brings deep, lasting gladness.',
        keyword: 'Fullness of Joy',
      },
      reflectionCore:
        'Passing thrills fade quickly, but joy in God’s presence lingers. Walk closely with Him today and savor the path He shows you.',
      confession: 'In God’s presence I find fullness of life and joy.',
    },
  },

  // ==================== 3. COURAGE (용기와 담대함, 도전) ====================
  {
    id: 'courage-1',
    mood: 'courage',
    ko: {
      themeTitle: '두려움을 이기고 당당히 나아가는 날',
      themeSubtitle: '어디로 가든지 함께하시는 하나님의 약속',
      verse: {
        reference: '여호수아 1장 9절',
        testament: '구약',
        book: '여호수아',
        chapter: 1,
        verseRange: '9',
        text: '내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라',
        context: '새로운 도전을 앞두고 긴장하던 여호수아에게 하나님이 직접 용기를 북돋아 주시며 동행을 약속하신 말씀입니다.',
        keyword: '용기와 동행',
      },
      reflectionCore:
        '새로운 일이나 어려운 문제 앞에서 망설여질 수 있습니다. 하지만 혼자가 아니라 하나님이 곁에서 함께하신다는 사실을 기억하면, 한 걸음 내딛을 충분한 용기가 생깁니다.',
      confession: '하나님이 나와 함께하시니 두려워하지 않고 나아갑니다.',
    },
    en: {
      themeTitle: 'Stepping Forward with Bold Faith',
      themeSubtitle: 'The Lord walks with you wherever you go',
      verse: {
        reference: 'Joshua 1:9',
        testament: 'OT',
        book: 'Joshua',
        chapter: 1,
        verseRange: '9',
        text: 'Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.',
        context: 'God assured Joshua that divine presence—not human perfection—is the true source of courage.',
        keyword: 'Bold Courage',
      },
      reflectionCore:
        'Courage is not the absence of hesitation; it is taking the next faithful step knowing God walks right beside you.',
      confession: 'Because God is with me, I step forward without fear.',
    },
  },
  {
    id: 'courage-2',
    mood: 'courage',
    ko: {
      themeTitle: '힘을 주시는 주님 안에서 해내는 하루',
      themeSubtitle: '내 부족함을 채워주시는 넉넉한 능력',
      verse: {
        reference: '빌립보서 4장 13절',
        testament: '신약',
        book: '빌립보서',
        chapter: 4,
        verseRange: '13',
        text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
        context: '어떤 상황에서도 주님이 주시는 힘으로 맡겨진 일을 감당할 수 있다는 사도 바울의 자신감 넘치는 고백입니다.',
        keyword: '주님의 능력',
      },
      reflectionCore:
        '내 힘만 생각하면 작아 보일 수 있지만, 힘을 더해 주시는 주님을 의지하면 오늘 맡겨진 일도 충분히 해낼 수 있습니다. 할 수 있다는 믿음으로 오늘의 과제를 시작해 보세요.',
      confession: '힘을 주시는 주님 안에서 오늘의 일을 넉넉히 해냅니다.',
    },
    en: {
      themeTitle: 'Strengthened Through Christ',
      themeSubtitle: 'Heaven’s strength meeting human weakness',
      verse: {
        reference: 'Philippians 4:13',
        testament: 'NT',
        book: 'Philippians',
        chapter: 4,
        verseRange: '13',
        text: 'I can do all things through Christ, who strengthens me.',
        context: 'Paul testifies that union with Christ supplies the endurance needed for every calling.',
        keyword: 'Strength in Christ',
      },
      reflectionCore:
        'You do not rely on your own energy alone. Lean on Christ’s strength as you tackle today’s responsibilities.',
      confession: 'Through Christ who strengthens me, I am equipped for today.',
    },
  },
  {
    id: 'courage-3',
    mood: 'courage',
    ko: {
      themeTitle: '굳세게 붙들어 도와주시는 하나님',
      themeSubtitle: '흔들릴 때마다 오른손으로 지켜주시는 약속',
      verse: {
        reference: '이사야 41장 10절',
        testament: '구약',
        book: '이사야',
        chapter: 41,
        verseRange: '10',
        text: '두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라',
        context: '앞날이 불안해 흔들리는 백성들에게 하나님이 직접 손을 잡아 일으켜 주겠다고 다짐하신 든든한 말씀입니다.',
        keyword: '든든한 도우심',
      },
      reflectionCore:
        '예상치 못한 일이 생겨도 당황하지 마세요. 하나님이 "내가 꼭 도와줄게, 내가 붙잡아 줄게"라고 약속하고 계십니다. 그 든든한 약속을 믿고 오늘을 당당히 마주해 보세요.',
      confession: '주님이 나를 굳세게 붙들고 도와주심을 믿습니다.',
    },
    en: {
      themeTitle: 'Upheld by His Righteous Hand',
      themeSubtitle: 'A steadfast promise of help and strength',
      verse: {
        reference: 'Isaiah 41:10',
        testament: 'OT',
        book: 'Isaiah',
        chapter: 41,
        verseRange: '10',
        text: 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.',
        context: 'God reassures anxious hearts with five unbreakable promises of presence and help.',
        keyword: 'Steadfast Help',
      },
      reflectionCore:
        'Even if surprises appear today, remember God’s promise: He strengthens, helps, and holds you upright.',
      confession: 'God strengthens, helps, and upholds me today.',
    },
  },
  {
    id: 'courage-4',
    mood: 'courage',
    ko: {
      themeTitle: '두려움이 아닌 능력과 사랑의 마음',
      themeSubtitle: '위축되지 않고 당당하게 마음을 다잡는 날',
      verse: {
        reference: '디모데후서 1장 7절',
        testament: '신약',
        book: '디모데후서',
        chapter: 1,
        verseRange: '7',
        text: '하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니',
        context: '젊은 사역자 디모데가 부담감에 주저할 때 바울이 하나님이 주신 건강한 마음을 일깨워 준 격려의 편지입니다.',
        keyword: '능력과 절제',
      },
      reflectionCore:
        '지나친 걱정과 눈치 보기는 하나님이 주신 마음이 아닙니다. 하나님은 오늘 우리에게 문제를 해결할 힘, 사람을 품는 사랑, 감정을 다스리는 차분함을 선물로 주셨습니다.',
      confession: '두려움 대신 능력과 사랑, 차분한 마음으로 오늘을 삽니다.',
    },
    en: {
      themeTitle: 'A Spirit of Power, Love, and Self-Control',
      themeSubtitle: 'Replacing timidity with steady confidence',
      verse: {
        reference: '2 Timothy 1:7',
        testament: 'NT',
        book: '2 Timothy',
        chapter: 1,
        verseRange: '7',
        text: 'For God didn’t give us a spirit of fear, but of power, love, and self-control.',
        context: 'Paul reminded young Timothy that fear does not come from God—clarity, love, and strength do.',
        keyword: 'Power & Clarity',
      },
      reflectionCore:
        'Timidity is not God’s gift to you. Step into today with steady power, warm love, and a clear, calm mind.',
      confession: 'God fills me with power, love, and a sound mind today.',
    },
  },
  {
    id: 'courage-5',
    mood: 'courage',
    ko: {
      themeTitle: '하나님이 내 편이시기에 당당한 하루',
      themeSubtitle: '그 어떤 장애물도 넉넉히 이기는 믿음의 확신',
      verse: {
        reference: '로마서 8장 31절',
        testament: '신약',
        book: '로마서',
        chapter: 8,
        verseRange: '31',
        text: '그런즉 이 일에 대하여 우리가 무슨 말 하리요 만일 하나님이 우리를 위하시면 누가 우리를 대적하리요',
        context: '하나님의 변치 않는 사랑과 편들어 주심을 확신하며 사도 바울이 외친 가장 힘 있는 승리의 선포입니다.',
        keyword: '확신과 승리',
      },
      reflectionCore:
        '사람들의 평가나 눈앞의 벽 때문에 주눅 들지 마세요. 온 우주에서 가장 크신 하나님이 오늘도 당신 편에 서서 응원하고 계십니다.',
      confession: '하나님이 내 편이시기에 오늘도 당당하게 걸어갑니다.',
    },
    en: {
      themeTitle: 'If God Is for Us, Who Can Stand Against Us?',
      themeSubtitle: 'Walking in unshakable confidence',
      verse: {
        reference: 'Romans 8:31',
        testament: 'NT',
        book: 'Romans',
        chapter: 8,
        verseRange: '31',
        text: 'What then shall we say about these things? If God is for us, who can be against us?',
        context: 'Paul’s triumphant reminder that God’s unfailing favor outweighs every opposition.',
        keyword: 'Confidence & Victory',
      },
      reflectionCore:
        'Do not shrink back before criticism or steep challenges. The Almighty God stands firmly on your side today.',
      confession: 'God is for me; I walk forward with unshakable hope.',
    },
  },
  {
    id: 'courage-6',
    mood: 'courage',
    ko: {
      themeTitle: '어둠을 밝히는 나의 빛, 나의 구원',
      themeSubtitle: '누구도 두려워할 필요 없는 든든한 하루',
      verse: {
        reference: '시편 27편 1절',
        testament: '구약',
        book: '시편',
        chapter: 27,
        verseRange: '1',
        text: '여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요 여호와는 내 생명의 능력이시니 내가 누구를 무서워하리요',
        context: '사방이 캄캄해 보일 때도 하나님이 빛이 되어 주시기에 두려움을 털어낸 다윗의 담대한 고백입니다.',
        keyword: '빛과 용기',
      },
      reflectionCore:
        '불빛 하나만 켜져도 방 안의 어둠은 금방 물러갑니다. 오늘 내 앞길을 비추는 빛 되신 주님을 의지하며, 막연한 불안감을 털어내고 힘차게 하루를 시작해 보세요.',
      confession: '주님이 나의 빛과 힘이시니 아무것도 두렵지 않습니다.',
    },
    en: {
      themeTitle: 'The Lord Is My Light and Salvation',
      themeSubtitle: 'Walking without fear in God’s bright light',
      verse: {
        reference: 'Psalm 27:1',
        testament: 'OT',
        book: 'Psalms',
        chapter: 27,
        verseRange: '1',
        text: 'Yahweh is my light and my salvation. Whom shall I fear? Yahweh is the strength of my life. Of whom shall I be afraid?',
        context: 'David declares fearless trust because God Himself illuminates his path.',
        keyword: 'Light & Courage',
      },
      reflectionCore:
        'A single light scatters darkness immediately. Trust the Lord as your light today and leave vague fears behind.',
      confession: 'The Lord is my light and my strength; I will not be afraid.',
    },
  },

  // ==================== 4. WISDOM (지혜와 분별, 인도하심) ====================
  {
    id: 'wisdom-1',
    mood: 'wisdom',
    ko: {
      themeTitle: '내 생각보다 하나님의 지혜를 믿는 길',
      themeSubtitle: '모든 일에 주님을 인정할 때 곧게 열리는 앞길',
      verse: {
        reference: '잠언 3장 5-6절',
        testament: '구약',
        book: '잠언',
        chapter: 3,
        verseRange: '5-6',
        text: '너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라',
        context: '내 계산과 경험만 고집하지 않고 하나님께 길을 여쭐 때 가장 바른 방향으로 인도해 주신다는 지혜의 말씀입니다.',
        keyword: '지혜와 인도',
      },
      reflectionCore:
        '머릿속으로 아무리 계산해도 답이 안 나올 때가 있습니다. 그럴 때는 내 생각을 잠깐 내려놓고 "주님, 어떻게 하는 게 가장 좋을까요?"라고 여쭤보세요. 마음이 맑아지면서 좋은 방향이 보일 것입니다.',
      confession: '내 생각보다 하나님의 지혜를 신뢰하며 걸어갑니다.',
    },
    en: {
      themeTitle: 'Trusting the Lord with All Your Heart',
      themeSubtitle: 'Clarity that comes when you acknowledge Him',
      verse: {
        reference: 'Proverbs 3:5-6',
        testament: 'OT',
        book: 'Proverbs',
        chapter: 3,
        verseRange: '5-6',
        text: 'Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.',
        context: 'Solomon teaches that surrendering our limited view to God brings lasting clarity.',
        keyword: 'Wisdom & Guidance',
      },
      reflectionCore:
        'Overthinking clouds our choices, while trusting God clears the view. Invite Him into your small decisions today and watch Him straighten your path.',
      confession: 'I trust the Lord wholeheartedly to direct my steps.',
    },
  },
  {
    id: 'wisdom-2',
    mood: 'wisdom',
    ko: {
      themeTitle: '오늘 내 한 걸음을 비추는 말씀의 등불',
      themeSubtitle: '멀리까지 다 몰라도 오늘 걸을 길은 분명한 은혜',
      verse: {
        reference: '시편 119편 105절',
        testament: '구약',
        book: '시편',
        chapter: 119,
        verseRange: '105',
        text: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다',
        context: '어두운 밤길을 걸을 때 발 앞을 비추어 주는 등불처럼, 하나님의 말씀이 우리 일상의 확실한 길잡이가 되어 준다는 고백입니다.',
        keyword: '바른 길잡이',
      },
      reflectionCore:
        '10년 뒤의 일을 지금 다 알 필요는 없습니다. 오늘 내가 딛어야 할 바로 이 한 걸음만 바르게 걸어가면 됩니다. 오늘 주신 말씀을 나침반 삼아 차분히 나아가 보세요.',
      confession: '주님의 말씀이 오늘 내가 걸을 한 걸음을 밝게 비춥니다.',
    },
    en: {
      themeTitle: 'A Lamp to My Feet Today',
      themeSubtitle: 'Clear light for the very next step before you',
      verse: {
        reference: 'Psalm 119:105',
        testament: 'OT',
        book: 'Psalms',
        chapter: 119,
        verseRange: '105',
        text: 'Your word is a lamp to my feet, and a light for my path.',
        context: 'Scripture faithfully illuminates the exact step right in front of us each day.',
        keyword: 'Light of Truth',
      },
      reflectionCore:
        'You do not need the entire ten-year map today—just enough light for today’s step. Walk honestly in the truth God shows you right now.',
      confession: 'God’s Word lights the exact step before my feet today.',
    },
  },
  {
    id: 'wisdom-3',
    mood: 'wisdom',
    ko: {
      themeTitle: '꾸짖지 않고 넉넉히 지혜를 주시는 하나님',
      themeSubtitle: '부족함을 인정하고 구할 때 열리는 맑은 생각',
      verse: {
        reference: '야고보서 1장 5절',
        testament: '신약',
        book: '야고보서',
        chapter: 1,
        verseRange: '5',
        text: '너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라',
        context: '어려운 선택 앞에서 판단이 서지 않을 때, 하나님은 우리를 나무라지 않으시고 기꺼이 지혜를 주신다는 따뜻한 약속입니다.',
        keyword: '후히 주시는 지혜',
      },
      reflectionCore:
        '모르는 것이 있거나 판단이 어려울 때 혼자 끙끙 앓지 않아도 됩니다. 하나님은 "왜 그것도 모르니?"라고 나무라지 않으시고, 구하는 사람에게 넉넉히 지혜를 부어주십니다.',
      confession: '부족한 지혜를 주님께 구하며 맑은 판단력을 얻습니다.',
    },
    en: {
      themeTitle: 'Wisdom Given Generously Without Fault',
      themeSubtitle: 'Ask freely whenever you need clear discernment',
      verse: {
        reference: 'James 1:5',
        testament: 'NT',
        book: 'James',
        chapter: 1,
        verseRange: '5',
        text: 'But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.',
        context: 'James encourages believers that God gladly gives wisdom whenever we humbly ask.',
        keyword: 'Generous Wisdom',
      },
      reflectionCore:
        'You never have to pretend you know everything. Ask God honestly for clarity today—He loves to give wisdom generously.',
      confession: 'I ask God for wisdom today and trust His generous guidance.',
    },
  },
  {
    id: 'wisdom-4',
    mood: 'wisdom',
    ko: {
      themeTitle: '오늘의 계획을 주님께 맡길 때 이루어지는 복',
      themeSubtitle: '조급함 대신 신뢰로 하루를 꾸려가는 지혜',
      verse: {
        reference: '잠언 16장 3절',
        testament: '구약',
        book: '잠언',
        chapter: 16,
        verseRange: '3',
        text: '너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라',
        context: '우리가 계획하고 추진하는 모든 일의 시작과 끝을 하나님께 올려드릴 때 가장 좋은 열매를 맺는다는 지혜의 말씀입니다.',
        keyword: '계획과 열매',
      },
      reflectionCore:
        '오늘 예정된 일들과 크고 작은 계획들을 시작하기 전에 짧게라도 주님께 올려드려 보세요. 내 욕심이 아니라 선한 뜻 안에서 일할 때 뜻밖의 좋은 길들이 열립니다.',
      confession: '오늘 나의 모든 일과 계획을 주님께 맡기며 나아갑니다.',
    },
    en: {
      themeTitle: 'Commit Your Work to the Lord',
      themeSubtitle: 'Steadiness and fruitfulness for today’s plans',
      verse: {
        reference: 'Proverbs 16:3',
        testament: 'OT',
        book: 'Proverbs',
        chapter: 16,
        verseRange: '3',
        text: 'Commit your deeds to Yahweh, and your plans shall succeed.',
        context: 'Offering our daily work to God aligns our goals with His blessing and purpose.',
        keyword: 'Purposeful Plans',
      },
      reflectionCore:
        'Before diving into your schedule, dedicate today’s plans to God. Faithful effort paired with trust bears lasting fruit.',
      confession: 'I commit today’s work and plans into God’s hands.',
    },
  },
  {
    id: 'wisdom-5',
    mood: 'wisdom',
    ko: {
      themeTitle: '내 앞길을 맡기고 의지할 때 이루시는 주님',
      themeSubtitle: '조급해하지 않고 선한 때를 기다리는 여유',
      verse: {
        reference: '시편 37편 5절',
        testament: '구약',
        book: '시편',
        chapter: 37,
        verseRange: '5',
        text: '네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고',
        context: '서두르거나 남과 비교하며 불안해하지 말고, 묵묵히 하나님을 의지할 때 가장 좋은 때에 이루어 주신다는 약속입니다.',
        keyword: '신뢰와 성취',
      },
      reflectionCore:
        '남들보다 조금 늦어 보이는 것 같아도 괜찮습니다. 하나님께 내 길을 맡기고 오늘 내가 할 수 있는 일에 성실하면, 가장 알맞은 때에 하나님이 친히 열매를 맺게 하십니다.',
      confession: '내 앞길을 주님께 맡기며 오늘의 자리에 성실합니다.',
    },
    en: {
      themeTitle: 'Commit Your Way to the Lord',
      themeSubtitle: 'Trusting His timing without comparison or rush',
      verse: {
        reference: 'Psalm 37:5',
        testament: 'OT',
        book: 'Psalms',
        chapter: 37,
        verseRange: '5',
        text: 'Commit your way to Yahweh. Trust also in him, and he will do this.',
        context: 'A calming reminder not to fret or compare, but to trust God’s faithful action.',
        keyword: 'Trust & Timing',
      },
      reflectionCore:
        'You do not need to rush or compare your pace with others. Stay faithful in today’s assignment and trust God with the outcome.',
      confession: 'I commit my way to the Lord and trust Him to act.',
    },
  },
  {
    id: 'wisdom-6',
    mood: 'wisdom',
    ko: {
      themeTitle: '마음을 새롭게 하여 선한 뜻을 분별하는 날',
      themeSubtitle: '분위기에 휩쓸리지 않고 바른 중심을 잡는 지혜',
      verse: {
        reference: '로마서 12장 2절',
        testament: '신약',
        book: '로마서',
        chapter: 12,
        verseRange: '2',
        text: '너희는 이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아 하나님의 선하시고 기뻐하시고 온전하신 뜻이 무엇인지 분별하도록 하라',
        context: '주변의 유행이나 조급한 기준에 휩쓸리지 않고, 하나님이 기뻐하시는 바른 기준을 분별하며 살라는 말씀입니다.',
        keyword: '새로운 마음과 분별',
      },
      reflectionCore:
        '세상의 기준은 늘 바쁘게 바뀌지만, 하나님의 선하신 기준은 변하지 않습니다. 오늘 어떤 선택을 할 때 "이것이 정말 정직하고 따뜻한 선택인가?"를 한 번 더 생각해 보세요.',
      confession: '새롭게 된 마음으로 하나님이 기뻐하시는 선한 길을 선택합니다.',
    },
    en: {
      themeTitle: 'Renewed in Mind to Discern What Is Good',
      themeSubtitle: 'Choosing God’s wisdom over passing trends',
      verse: {
        reference: 'Romans 12:2',
        testament: 'NT',
        book: 'Romans',
        chapter: 12,
        verseRange: '2',
        text: 'Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.',
        context: 'Paul calls believers to let God refresh their perspective so they can discern what truly matters.',
        keyword: 'Renewed Mind',
      },
      reflectionCore:
        'Pause before following the crowd today. Ask gently, "What is the honest, kind, and faithful choice right here?"',
      confession: 'God renews my mind to recognize and choose what is good.',
    },
  },

  // ==================== 5. LOVE (사랑과 나눔, 온유, 섬김) ====================
  {
    id: 'love-1',
    mood: 'love',
    ko: {
      themeTitle: '오래 참고 따뜻하게 품어주는 사랑의 날',
      themeSubtitle: '내 이익보다 상대를 먼저 배려하는 성숙한 하루',
      verse: {
        reference: '고린도전서 13장 4-7절',
        testament: '신약',
        book: '고린도전서',
        chapter: 13,
        verseRange: '4-7',
        text: '사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며 무례히 행하지 아니하며 자기의 유익을 구하지 아니하며 성내지 아니하며 모든 것을 참으며 모든 것을 믿으며 모든 것을 바라며 모든 것을 견디느니라',
        context: '기독교 신앙의 가장 큰 핵심인 참된 사랑이 일상에서 어떤 말과 태도로 나타나는지 보여주는 말씀입니다.',
        keyword: '온유한 사랑',
      },
      reflectionCore:
        '사랑은 거창한 이벤트보다 일상의 사소한 배려에서 드러납니다. 오늘 한 번 더 참고, 한 번 더 부드럽게 말할 때 내 주변에 따뜻한 변화가 시작됩니다.',
      confession: '오래 참고 온유한 마음으로 오늘의 사람들을 사랑합니다.',
    },
    en: {
      themeTitle: 'Walking in Patient, Kind Love',
      themeSubtitle: 'Putting gentleness and care into action today',
      verse: {
        reference: '1 Corinthians 13:4-7',
        testament: 'NT',
        book: '1 Corinthians',
        chapter: 13,
        verseRange: '4-7',
        text: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked; bears all things, believes all things, hopes all things, and endures all things.',
        context: 'Paul paints a practical portrait of Christlike love in everyday relationships.',
        keyword: 'Patient Love',
      },
      reflectionCore:
        'Real love shows up in ordinary patience and gentle words. One calm, kind response today can soften an entire room.',
      confession: 'I choose patient, kind love in my words and actions today.',
    },
  },
  {
    id: 'love-2',
    mood: 'love',
    ko: {
      themeTitle: '주님이 나를 사랑하신 것처럼 서로 사랑하는 날',
      themeSubtitle: '먼저 다가가 손을 내미는 따뜻한 섬김',
      verse: {
        reference: '요한복음 13장 34절',
        testament: '신약',
        book: '요한복음',
        chapter: 13,
        verseRange: '34',
        text: '새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라',
        context: '예수님이 제자들의 발을 직접 씻겨주신 뒤, 우리도 서로를 낮아져 사랑하라고 남기신 귀한 당부입니다.',
        keyword: '서로 사랑',
      },
      reflectionCore:
        '누군가 나에게 먼저 잘해주기를 기다리기보다, 오늘 내가 먼저 따뜻한 안부를 묻고 작은 친절을 건네 보세요. 먼저 내민 손이 하루를 가장 아름답게 만듭니다.',
      confession: '주님의 사랑을 기억하며 내가 먼저 따뜻하게 다가갑니다.',
    },
    en: {
      themeTitle: 'Love One Another as I Have Loved You',
      themeSubtitle: 'Taking the first step in humble kindness',
      verse: {
        reference: 'John 13:34',
        testament: 'NT',
        book: 'John',
        chapter: 13,
        verseRange: '34',
        text: 'A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another.',
        context: 'After washing His disciples’ feet, Jesus made humble love the defining mark of His followers.',
        keyword: 'Serving Love',
      },
      reflectionCore:
        'Rather than waiting for others to reach out first, offer a warm greeting or quiet helping hand today.',
      confession: 'I gladly take the first step to love and serve today.',
    },
  },
  {
    id: 'love-3',
    mood: 'love',
    ko: {
      themeTitle: '서로 친절하고 너그럽게 용서하는 하루',
      themeSubtitle: '마음의 벽을 허물고 화평을 이루는 은혜',
      verse: {
        reference: '에베소서 4장 32절',
        testament: '신약',
        book: '에베소서',
        chapter: 4,
        verseRange: '32',
        text: '서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라',
        context: '날카로운 말과 미움을 버리고, 주님께 받은 용서처럼 이웃을 너그럽게 대하라고 가르치는 말씀입니다.',
        keyword: '친절과 용서',
      },
      reflectionCore:
        '누군가의 실수나 서운한 말이 떠올라 마음이 불편하다면, 오늘 조금만 너그럽게 넘겨 보세요. 상대를 용서할 때 가장 먼저 편안해지는 것은 바로 내 마음입니다.',
      confession: '친절하고 너그러운 마음으로 이웃을 대하며 화평을 이룹니다.',
    },
    en: {
      themeTitle: 'Be Kind and Tenderhearted',
      themeSubtitle: 'Choosing forgiveness and warmth over friction',
      verse: {
        reference: 'Ephesians 4:32',
        testament: 'NT',
        book: 'Ephesians',
        chapter: 4,
        verseRange: '32',
        text: 'And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.',
        context: 'Paul urges believers to mirror God’s forgiving mercy in daily interactions.',
        keyword: 'Kindness & Mercy',
      },
      reflectionCore:
        'Letting go of a minor offense frees your own heart first. Choose tenderness and grace in your conversations today.',
      confession: 'I extend the same kindness and mercy God has shown me.',
    },
  },
  {
    id: 'love-4',
    mood: 'love',
    ko: {
      themeTitle: '사랑과 화평, 온유의 열매가 맺히는 날',
      themeSubtitle: '내 말과 행동에서 향기처럼 드러나는 좋은 성품',
      verse: {
        reference: '갈라디아서 5장 22-23절',
        testament: '신약',
        book: '갈라디아서',
        chapter: 5,
        verseRange: '22-23',
        text: '오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과 온유와 절제니 이같은 것을 금지할 법이 없느니라',
        context: '하나님과 가까이 동행하는 사람의 삶 속에 자연스럽게 맺히는 9가지 아름다운 성품의 열매를 소개합니다.',
        keyword: '성령의 열매',
      },
      reflectionCore:
        '오늘 하루 이 9가지 열매 중 딱 한 가지만 골라 집중해 보세요. 조금 더 부드럽게 말하기, 조금 더 오래 참아주기 같은 작은 선택이 오늘을 풍성한 열매로 채워줍니다.',
      confession: '오늘 나의 말과 행동에 사랑과 온유의 열매가 맺힙니다.',
    },
    en: {
      themeTitle: 'Bearing the Fruit of the Spirit',
      themeSubtitle: 'Letting love, peace, and gentleness shine naturally',
      verse: {
        reference: 'Galatians 5:22-23',
        testament: 'NT',
        book: 'Galatians',
        chapter: 5,
        verseRange: '22-23',
        text: 'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control.',
        context: 'Nine beautiful qualities that grow naturally when we walk closely with God’s Spirit.',
        keyword: 'Fruit of the Spirit',
      },
      reflectionCore:
        'Pick just one of these nine qualities to practice intentionally today—perhaps extra patience or gentle words.',
      confession: 'God’s Spirit produces love, peace, and kindness in me today.',
    },
  },
  {
    id: 'love-5',
    mood: 'love',
    ko: {
      themeTitle: '하나님의 사랑을 흘려보내는 따뜻한 통로',
      themeSubtitle: '받은 사랑이 너무 크기에 기꺼이 나누는 하루',
      verse: {
        reference: '요한일서 4장 11절',
        testament: '신약',
        book: '요한일서',
        chapter: 4,
        verseRange: '11',
        text: '사랑하는 자들아 하나님이 이같이 우리를 사랑하셨은즉 우리도 서로 사랑하는 것이 마땅하도다',
        context: '우리가 먼저 하나님의 큰 사랑을 받았기에, 그 사랑을 주변 사람들에게 자연스럽게 나누며 살자는 따뜻한 권면입니다.',
        keyword: '나누는 사랑',
      },
      reflectionCore:
        '사랑은 쓸수록 줄어드는 것이 아니라 나눌수록 더 풍성해집니다. 오늘 내 곁에 있는 가족, 동료, 친구에게 작은 관심과 따뜻한 응원을 아낌없이 전해 보세요.',
      confession: '하나님께 받은 큰 사랑을 오늘 이웃에게 기쁘게 나눕니다.',
    },
    en: {
      themeTitle: 'Loved by God to Love Others',
      themeSubtitle: 'Passing along the grace we have freely received',
      verse: {
        reference: '1 John 4:11',
        testament: 'NT',
        book: '1 John',
        chapter: 4,
        verseRange: '11',
        text: 'Beloved, if God loved us in this way, we also ought to love one another.',
        context: 'John reminds us that God’s generous love is the wellspring of our care for others.',
        keyword: 'Overflowing Love',
      },
      reflectionCore:
        'Love never shrinks when shared—it grows richer. Share genuine encouragement with someone close to you today.',
      confession: 'Because God first loved me, I freely share His love today.',
    },
  },
  {
    id: 'love-6',
    mood: 'love',
    ko: {
      themeTitle: '모든 것을 하나로 묶어주는 사랑의 띠',
      themeSubtitle: '이해와 배려로 관계를 든든히 세우는 날',
      verse: {
        reference: '골로새서 3장 14절',
        testament: '신약',
        book: '골로새서',
        chapter: 3,
        verseRange: '14',
        text: '이 모든 것 위에 사랑을 더하라 이는 온전하게 매는 띠니라',
        context: '성실함과 지혜, 어떤 좋은 덕목보다도 그 위에 사랑을 더할 때 비로소 온전해진다는 말씀입니다.',
        keyword: '하나 되게 하는 사랑',
      },
      reflectionCore:
        '아무리 맞는 말이라도 사랑이 빠지면 상처가 될 수 있고, 서툰 말이라도 사랑이 담기면 큰 위로가 됩니다. 오늘 내가 하는 모든 일 위에 따뜻한 사랑을 한 스푼 더해 보세요.',
      confession: '오늘 내가 하는 모든 말과 일 위에 따뜻한 사랑을 더합니다.',
    },
    en: {
      themeTitle: 'Above All, Put On Love',
      themeSubtitle: 'Harmony that binds every relationship together',
      verse: {
        reference: 'Colossians 3:14',
        testament: 'NT',
        book: 'Colossians',
        chapter: 3,
        verseRange: '14',
        text: 'Above all these things, walk in love, which is the bond of perfection.',
        context: 'Paul teaches that love is the unifying thread that completes every other virtue.',
        keyword: 'Bond of Love',
      },
      reflectionCore:
        'Even right words can hurt without warmth, while simple words spoken in love heal deeply. Wrap today’s actions in love.',
      confession: 'Above everything else, I clothe my day in Christ’s love.',
    },
  },

  // ==================== 6. PEACE (평강과 동행, 믿음, 새 시작) ====================
  {
    id: 'peace-1',
    mood: 'peace',
    ko: {
      themeTitle: '마음과 생각을 지켜주는 깊은 평안',
      themeSubtitle: '걱정 대신 감사 기도로 하루를 채우는 날',
      verse: {
        reference: '빌립보서 4장 6-7절',
        testament: '신약',
        book: '빌립보서',
        chapter: 4,
        verseRange: '6-7',
        text: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라',
        context: '불안과 걱정이 밀려올 때 감사함으로 기도하면, 하나님이 직접 우리 마음의 평안을 지켜주신다는 약속입니다.',
        keyword: '마음의 평안',
      },
      reflectionCore:
        '걱정되는 일이 떠오를 때마다 혼자 머릿속으로 되풀이하지 말고, 짧게라도 기도로 바꾸어 보세요. 기도로 맡기고 나면 신기하게도 마음 한가운데 잔잔한 평안이 찾아옵니다.',
      confession: '감사 기도로 나아갈 때 하나님의 평안이 내 마음을 지킵니다.',
    },
    en: {
      themeTitle: 'The Peace of God Guarding Your Heart',
      themeSubtitle: 'Trading anxious thoughts for thankful prayer',
      verse: {
        reference: 'Philippians 4:6-7',
        testament: 'NT',
        book: 'Philippians',
        chapter: 4,
        verseRange: '6-7',
        text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.',
        context: 'Paul offers prayer with thanksgiving as the sure path to calm beyond human reasoning.',
        keyword: 'Deep Peace',
      },
      reflectionCore:
        'Instead of replaying worries in your mind, turn each concern into a short thankful prayer and let God’s peace guard your heart.',
      confession: 'God’s peace stands watch over my heart and mind today.',
    },
  },
  {
    id: 'peace-2',
    mood: 'peace',
    ko: {
      themeTitle: '어둠 속에 빛을 비추시는 새로운 시작',
      themeSubtitle: '복잡한 마음을 정돈하고 새롭게 열어가는 하루',
      verse: {
        reference: '창세기 1장 1-3절',
        testament: '구약',
        book: '창세기',
        chapter: 1,
        verseRange: '1-3',
        text: '태초에 하나님이 천지를 창조하시니라 땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고',
        context: '성경의 첫 장을 여는 말씀으로, 어둡고 막막한 상황 속에서도 빛과 질서를 만들어 내시는 창조주 하나님의 능력을 보여줍니다.',
        keyword: '빛과 새 시작',
      },
      reflectionCore:
        '어제까지 뒤엉켜 있던 생각이나 막막했던 일이 있더라도 괜찮습니다. "빛이 있으라" 말씀하신 창조주 하나님이 오늘 당신의 하루에도 밝은 빛과 새로운 시작을 열어주십니다.',
      confession: '창조주 하나님이 오늘 내 삶에 새로운 빛을 비추어 주십니다.',
    },
    en: {
      themeTitle: 'Speaking Fresh Light into Today',
      themeSubtitle: 'Turning confusion into clarity and a new start',
      verse: {
        reference: 'Genesis 1:1-3',
        testament: 'OT',
        book: 'Genesis',
        chapter: 1,
        verseRange: '1-3',
        text: 'In the beginning, God created the heavens and the earth. The earth was formless and empty... God said, "Let there be light," and there was light.',
        context: 'Scripture opens with a Creator who brings order, beauty, and light out of emptiness.',
        keyword: 'New Beginning',
      },
      reflectionCore:
        'No matter how tangled yesterday felt, the Creator who spoke light into being is ready to bring fresh order and hope to your day.',
      confession: 'My Creator brings fresh light and a new beginning today.',
    },
  },
  {
    id: 'peace-3',
    mood: 'peace',
    ko: {
      themeTitle: '세상이 줄 수 없는 예수님의 참된 평안',
      themeSubtitle: '근심과 두려움을 잠재우는 든든한 안심',
      verse: {
        reference: '요한복음 14장 27절',
        testament: '신약',
        book: '요한복음',
        chapter: 14,
        verseRange: '27',
        text: '평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라 너희는 마음에 근심하지도 말고 두려워하지도 말라',
        context: '앞날을 걱정하던 제자들에게 예수님이 직접 남기신 가장 귀한 선물인 "주님의 평안"에 대한 약속입니다.',
        keyword: '예수님의 평안',
      },
      reflectionCore:
        '주변 상황이 완전히 조용해져야만 평안한 것이 아닙니다. 바쁜 일상 한가운데서도 예수님이 주시는 평안이 내 안에 있으면 흔들리지 않고 차분히 하루를 보낼 수 있습니다.',
      confession: '예수님이 주시는 참된 평안으로 근심을 내려놓습니다.',
    },
    en: {
      themeTitle: 'My Peace I Give to You',
      themeSubtitle: 'Calm that the world cannot give or take away',
      verse: {
        reference: 'John 14:27',
        testament: 'NT',
        book: 'John',
        chapter: 14,
        verseRange: '27',
        text: 'Peace I leave with you. My peace I give to you; not as the world gives, give I to you. Don’t let your heart be troubled, neither let it be fearful.',
        context: 'Jesus gifted His worried disciples with a lasting inner calm independent of outward noise.',
        keyword: 'Peace of Christ',
      },
      reflectionCore:
        'True peace does not wait for everything around you to become quiet. Carry Christ’s calm right into the middle of your busy day.',
      confession: 'I receive the peace of Jesus and let go of trouble.',
    },
  },
  {
    id: 'peace-4',
    mood: 'peace',
    ko: {
      themeTitle: '복을 주시고 평강으로 지키시는 축복',
      themeSubtitle: '하나님의 따뜻한 시선이 머무는 복된 하루',
      verse: {
        reference: '민수기 6장 24-26절',
        testament: '구약',
        book: '민수기',
        chapter: 6,
        verseRange: '24-26',
        text: '여호와는 네게 복을 주시고 너를 지키시기를 원하며 여호와는 그의 얼굴을 네게 비추사 은혜 베푸시기를 원하며 여호와는 그 얼굴을 네게로 향하여 드사 평강 주시기를 원하노라',
        context: '하나님이 백성들에게 매일 선포해 주라고 가르쳐 주신 가장 아름다운 축복의 기도문입니다.',
        keyword: '축복과 평강',
      },
      reflectionCore:
        '오늘 하나님이 환한 얼굴로 당신을 바라보며 복을 빌어주고 계십니다. 이 따뜻한 축복을 먼저 내 마음에 품고, 오늘 만나는 사람들에게도 축복의 마음을 건네 보세요.',
      confession: '하나님의 복과 은혜와 평강이 오늘 내 삶에 가득합니다.',
    },
    en: {
      themeTitle: 'Blessed, Kept, and Given Peace',
      themeSubtitle: 'Walking under God’s smiling favor today',
      verse: {
        reference: 'Numbers 6:24-26',
        testament: 'OT',
        book: 'Numbers',
        chapter: 6,
        verseRange: '24-26',
        text: 'Yahweh bless you, and keep you. Yahweh make his face to shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace.',
        context: 'The ancient priestly blessing God gave to declare His favor and peace over His people.',
        keyword: 'Blessing & Peace',
      },
      reflectionCore:
        'Step into your day knowing God’s favor shines warmly upon you. Receive His peace and pass a blessing on to someone else.',
      confession: 'The Lord blesses me, keeps me, and fills me with peace.',
    },
  },
  {
    id: 'peace-5',
    mood: 'peace',
    ko: {
      themeTitle: '언제든 달려갈 수 있는 든든한 피난처',
      themeSubtitle: '어려운 순간 가장 가까이서 도와주시는 하나님',
      verse: {
        reference: '시편 46편 1절',
        testament: '구약',
        book: '시편',
        chapter: 46,
        verseRange: '1',
        text: '하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라',
        context: '갑작스러운 위기와 어려움 앞에서도 하나님이 가장 안전한 피난처이자 힘이 되어 주신다는 찬양입니다.',
        keyword: '피난처와 도움',
      },
      reflectionCore:
        '살다 보면 갑자기 마음이 흔들리는 순간이 찾아옵니다. 그럴 때 혼자 숨거나 주저앉지 말고, 언제든 열려 있는 피난처 되신 하나님께 바로 마음을 기대어 보세요.',
      confession: '하나님은 오늘 나의 안전한 피난처이자 큰 도움이십니다.',
    },
    en: {
      themeTitle: 'Our Ever-Present Refuge and Strength',
      themeSubtitle: 'A safe shelter ready in every sudden storm',
      verse: {
        reference: 'Psalm 46:1',
        testament: 'OT',
        book: 'Psalms',
        chapter: 46,
        verseRange: '1',
        text: 'God is our refuge and strength, a very present help in trouble.',
        context: 'A song of bold calm reminding us that God is immediately near whenever trouble strikes.',
        keyword: 'Refuge & Strength',
      },
      reflectionCore:
        'When unexpected stress arrives, you never have to face it alone. Turn immediately to God, your ever-present shelter.',
      confession: 'God is my refuge, my strength, and my ever-present help.',
    },
  },
  {
    id: 'peace-6',
    mood: 'peace',
    ko: {
      themeTitle: '믿음 안에서 기쁨과 평강이 넘치는 하루',
      themeSubtitle: '소망의 하나님이 채워주시는 넉넉한 마음',
      verse: {
        reference: '로마서 15장 13절',
        testament: '신약',
        book: '로마서',
        chapter: 15,
        verseRange: '13',
        text: '소망의 하나님이 모든 기쁨과 평강을 믿음 안에서 너희에게 충만하게 하사 성령의 능력으로 소망이 넘치게 하시기를 원하노라',
        context: '로마 교회를 향해 기쁨과 평강, 그리고 흔들리지 않는 소망이 넘치기를 축복한 사도 바울의 기도입니다.',
        keyword: '소망과 평강',
      },
      reflectionCore:
        '마음에 소망이 있으면 오늘이 조금 힘들어도 웃으며 버틸 수 있습니다. 소망의 하나님이 오늘 당신의 마음에 잔잔한 평안과 밝은 기대감을 넉넉히 채워주시길 축복합니다.',
      confession: '소망의 하나님이 오늘 내 마음에 기쁨과 평안을 채워주십니다.',
    },
    en: {
      themeTitle: 'Overflowing with Hope, Joy, and Peace',
      themeSubtitle: 'A generous heart filled by the God of hope',
      verse: {
        reference: 'Romans 15:13',
        testament: 'NT',
        book: 'Romans',
        chapter: 15,
        verseRange: '13',
        text: 'Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.',
        context: 'Paul’s warm benediction praying for overflowing hope and steady peace in believers’ lives.',
        keyword: 'Hope & Peace',
      },
      reflectionCore:
        'Hope turns even an ordinary Tuesday into a day of expectation. Let the God of hope fill your heart with calm joy today.',
      confession: 'The God of hope fills me with joy and peace as I trust Him.',
    },
  },
];

export const VERSE_CATALOG: CatalogVerseEntry[] = [
  ...BASE_VERSE_CATALOG,
  ...EXTRA_REST_JOY_VERSES.map(expandCompactVerse),
  ...EXTRA_COURAGE_WISDOM_VERSES.map(expandCompactVerse),
  ...EXTRA_LOVE_PEACE_VERSES.map(expandCompactVerse),
];

export function getVersesByMood(mood: FaceMetrics['dominantMood']): CatalogVerseEntry[] {
  return VERSE_CATALOG.filter((v) => v.mood === mood);
}

export function getVerseById(id: string): CatalogVerseEntry | undefined {
  return VERSE_CATALOG.find((v) => v.id === id);
}

export function getCatalogCount(): number {
  return VERSE_CATALOG.length;
}
