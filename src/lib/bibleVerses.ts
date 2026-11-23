import { BibleVerse, DailyActionItem, Language, LifeStageInfo, RecommendedPraise } from '../types/bible';

export interface VerseThemeData {
  verse: BibleVerse;
  themeTitle: string;
  themeSubtitle: string;
  reflectionGuide: string;
  reflectionQuestions: string[];
  actionCore: string;
  actionItems: DailyActionItem[];
  prayerTitle: string;
  prayerBody: string;
  prayerConfession: string;
  praise: RecommendedPraise;
  spiritualHabit: string;
  readingSuggestion: string;
}

export const VERSE_DATABASE: Record<string, VerseThemeData[]> = {
  // 1. 쉼과 안식이 필요한 상태 (피로, 지침, 쉼이 필요함)
  rest: [
    {
      themeTitle: '수고한 당신을 안아주시는 샬롬의 쉼터',
      themeSubtitle: '모든 무거운 짐을 내려놓고 참된 안식을 누리는 날',
      verse: {
        reference: '마태복음 11장 28절',
        testament: '신약',
        book: '마태복음',
        chapter: 11,
        verseRange: '28',
        text: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라',
        context: '세상의 고단한 일상과 율법의 멍에 아래 지쳐있던 사람들에게 예수님께서 두 팔을 벌려 부르시며 영혼의 참된 안식을 약속하신 생명의 음성입니다.',
        keyword: '안식과 회복',
      },
      reflectionGuide:
        '오늘 당신의 얼굴에 묻어난 정직한 피로는 주님 안에서 성실하게 살아온 귀한 흔적입니다. 하지만 하나님은 당신이 혼자서 모든 짐을 짊어지길 원치 않으십니다. 호흡을 길게 가다듬고, 내 어깨를 짓누르던 생각과 염려를 주님의 십자가 앞에 겸손히 내려놓으세요. 주님이 주시는 쉼은 단순한 나태가 아니라, 새로운 내일을 열어가는 하늘의 재충전입니다.',
      reflectionQuestions: [
        '지금 내 마음에 가장 무겁게 느껴지는 짐(관계, 일, 미래)은 무엇인가요?',
        '그 짐을 주님께 맡기지 못하고 스스로 꼭 쥐고 있었던 이유는 무엇이었나요?',
        '오늘 나에게 주님이 허락하시는 "선물 같은 10분의 고요한 쉼"을 어떻게 누려볼까요?',
      ],
      actionCore: '오늘 오후 딱 10분, 스마트폰을 내려놓고 주님 안에서 깊은 호흡으로 기도하기',
      actionItems: [
        {
          id: 'rest-1',
          title: '따뜻한 차 한 잔과 감사 고백',
          description: '잠시 분주함을 멈추고 따뜻한 물이나 차를 마시며 "주님, 내 영혼을 쉬게 하소서"라고 고백하기',
          category: 'prayer',
        },
        {
          id: 'rest-2',
          title: '오늘 꼭 하지 않아도 될 일 하나 내려놓기',
          description: '스스로를 조급하게 몰아붙이던 계획 중 하나를 내일로 미루고 마음의 여백 만들기',
          category: 'word',
        },
        {
          id: 'rest-3',
          title: '가족이나 동료에게 따뜻한 격려 건네기',
          description: '"오늘도 수고 많으셨어요"라는 온화한 한마디로 주위의 피로까지 함께 보듬기',
          category: 'love',
        },
      ],
      prayerTitle: '지친 영혼을 소성케 하시는 주님께 드리는 1분 기도',
      prayerBody:
        '사랑과 긍휼의 하나님 아버지, 오늘 하루를 살아내느라 지치고 무거운 내 영혼을 이 시간 주님 품에 맡깁니다. 내가 다 해결하려 했던 조급함을 내려놓고, "다 내게로 오라" 부르시는 주님의 품 안에서 깊은 안식을 누립니다. 주님, 나의 피로한 육신을 어루만져 주시고 마음에 샘물 같은 평안을 채워 주옵소서. 내 목자 되신 주님만을 의지하며 다시 일어날 새 힘을 얻게 하옵소서. 예수 그리스도의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '내 힘이 아닌 주님의 은혜 안에서 참된 쉼을 누립니다.',
      praise: {
        title: '나의 피난처 예수',
        artist: '어노인팅',
        lyricSnippet: '나의 피난처 예수 의지해요, 안전한 그 품 날 안으시네',
        theme: '안식과 위로',
      },
      spiritualHabit: '잠들기 전 시편 23편을 소리 내어 묵상하기',
      readingSuggestion: '시편 23편 (여호와는 나의 목자)',
    },
    {
      themeTitle: '목자 되신 주님의 푸른 풀밭과 쉴 만한 물가',
      themeSubtitle: '부족함 없이 내 영혼을 소성시키시는 주님의 인도하심',
      verse: {
        reference: '시편 23편 1-3절',
        testament: '구약',
        book: '시편',
        chapter: 23,
        verseRange: '1-3',
        text: '여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다 내 영혼을 소성시키시고 자기 이름을 위하여 의의 길로 인도하시는도다',
        context: '다윗이 인생의 수많은 사망의 음침한 골짜기를 지나며 고백한 가장 아름다운 신앙고백으로, 어떤 상황 속에서도 먹이시고 인도하시는 하나님을 찬양합니다.',
        keyword: '돌보심과 회복',
      },
      reflectionGuide:
        '우리는 때때로 "내가 부족해서", "가진 것이 없어서" 불안해합니다. 그러나 다윗은 세상의 부유함 때문이 아니라 "여호와가 나의 목자이시기 때문에" 부족함이 없다고 선포했습니다. 오늘 하나님은 지친 당신을 푸른 풀밭으로 이끄십니다. 스스로를 채근하지 마시고, 선하신 목자 되신 주님의 손길을 신뢰하세요.',
      reflectionQuestions: [
        '최근 내 마음에 채워지지 않는 결핍이나 갈증은 무엇이었나요?',
        '목자 되신 주님께서 나를 위해 예비하신 푸른 풀밭은 어디일까요?',
        '오늘 주님의 인도하심을 전적으로 믿고 내려놓을 수 있는 염려는 무엇인가요?',
      ],
      actionCore: '오늘 하루 걱정이 밀려올 때마다 "여호와는 나의 목자시니 부족함이 없습니다" 선포하기',
      actionItems: [
        {
          id: 'rest-4',
          title: '하늘을 올려다보며 3번 깊이 호흡하기',
          description: '푸른 하늘을 바라보며 창조주 하나님의 크심과 나를 돌보심을 묵상하기',
          category: 'prayer',
        },
        {
          id: 'rest-5',
          title: '주변의 작은 은혜 적어보기',
          description: '오늘 나에게 거저 주신 생명, 호흡, 일용할 양식 등 감사 3가지 메모하기',
          category: 'thanks',
        },
        {
          id: 'rest-6',
          title: '식사 시간 온전히 누리기',
          description: '식사 전 주신 음식에 대해 감사하며 서두르지 않고 평온하게 식사하기',
          category: 'word',
        },
      ],
      prayerTitle: '선한 목자 되신 하나님께 드리는 1분 기도',
      prayerBody:
        '나의 선한 목자 되시는 주님, 세상의 소리에 귀 기울이느라 갈 길을 잃고 헤매던 제 시선을 주님께로 돌립니다. 주님께서 내 삶의 목자이시니 내게 결코 부족함이 없습니다. 메마른 내 심령에 은혜의 단비를 내려주시고, 푸른 풀밭과 쉴 만한 물가로 내 걸음을 이끌어 주옵소서. 내 영혼을 소성케 하시는 주님을 찬양하며, 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주님이 내 목자이시기에 내 영혼은 안전합니다.',
      praise: {
        title: '선한 목자 되신 우리 주',
        artist: '찬송가 569장',
        lyricSnippet: '선한 목자 되신 우리 주 항상 인도하시고, 푸른 풀밭 좋은 곳에서 우리 먹여 주소서',
        theme: '인도하심과 안식',
      },
      spiritualHabit: '오늘 하루 걷는 걸음마다 속으로 "주님 감사합니다" 고백하기',
      readingSuggestion: '시편 121편 (나의 도움이 어디서 올까)',
    },
  ],

  // 2. 기쁨과 감사가 넘치는 상태 (미소, 환한 얼굴, 감사)
  joy: [
    {
      themeTitle: '범사에 감사하며 기쁨으로 찬양하는 복된 날',
      themeSubtitle: '하나님의 뜻 안에서 누리는 샘솟는 구원의 기쁨',
      verse: {
        reference: '데살로니가전서 5장 16-18절',
        testament: '신약',
        book: '데살로니가전서',
        chapter: 5,
        verseRange: '16-18',
        text: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',
        context: '사도 바울이 데살로니가 교회를 향해 어떤 환경에서도 주님의 은혜를 기억하며 그리스도인이 살아내야 할 세 가지 황금률을 권면한 말씀입니다.',
        keyword: '기쁨과 감사',
      },
      reflectionGuide:
        '오늘 당신의 얼굴에 머무는 밝은 미소는 주변 사람들에게 전해지는 살아있는 주님의 편지입니다! 기쁨은 환경이 완벽해서 오는 것이 아니라, 나를 구원하시고 지금도 동행하시는 예수님을 바라볼 때 피어납니다. 오늘 당신의 입술에서 흘러나오는 감사가 어두운 세상을 환하게 비추는 등불이 될 것입니다.',
      reflectionQuestions: [
        '오늘 내 마음에 샘솟는 가장 큰 기쁨의 이유는 무엇인가요?',
        '당연하게 여겼던 일상 속에서 오늘 새롭게 발견한 하나님의 은혜는 무엇인가요?',
        '이 기쁨과 감사를 오늘 누구에게 가장 먼저 나누고 축복할 수 있을까요?',
      ],
      actionCore: '오늘 만나는 사람들에게 밝은 미소로 먼저 인사하고 축복의 말 건네기',
      actionItems: [
        {
          id: 'joy-1',
          title: '감사 문자 1통 보내기',
          description: '부모님, 배우자, 친구, 동역자 중 한 사람에게 진심 어린 고마움을 담은 메시지 전하기',
          category: 'love',
        },
        {
          id: 'joy-2',
          title: '좋아하는 찬양 들으며 흥얼거리기',
          description: '이동 중이나 작업 중에 찬양 한 곡을 온 마음으로 주님께 올려드리기',
          category: 'thanks',
        },
        {
          id: 'joy-3',
          title: '작은 선행 베풀기',
          description: '엘리베이터 문 잡아주기, 뒷사람을 위해 문 열어두기 등 작은 배려 실천하기',
          category: 'word',
        },
      ],
      prayerTitle: '기쁨과 찬양의 제사를 드리는 1분 기도',
      prayerBody:
        '은혜가 풍성하신 하나님 아버지, 오늘 제게 새 날을 허락하시고 마음에 구원의 기쁨과 감사를 부어주시니 감사합니다. 제 얼굴에 띤 미소가 주님의 사랑을 증언하는 통로가 되게 하옵소서. 조건 없는 주님의 사랑을 기억하며 오늘 만나는 모든 이들에게 따뜻한 빛을 비추게 하시고, 입술의 모든 말이 은혜를 끼치게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주 안에서 누리는 기쁨이 곧 나의 힘과 방패입니다.',
      praise: {
        title: '은혜 (Grace)',
        artist: '손경민',
        lyricSnippet: '내가 누려왔던 모든 것들이 내가 지나왔던 모든 시간이 다 은혜였소',
        theme: '감사와 은혜',
      },
      spiritualHabit: '거울을 볼 때마다 "주님의 은혜가 내게 족합니다" 고백하며 미소 짓기',
      readingSuggestion: '시편 100편 (온 땅이여 여호와께 즐거이 부를지어다)',
    },
    {
      themeTitle: '주 안에서 항상 기뻐하며 세상에 흘려보내는 은혜',
      themeSubtitle: '모든 상황을 뛰어넘는 하늘의 평강과 즐거움',
      verse: {
        reference: '빌립보서 4장 4절',
        testament: '신약',
        book: '빌립보서',
        chapter: 4,
        verseRange: '4',
        text: '주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라',
        context: '감옥에 갇혀 있던 바울이 빌립보 성도들을 향해 역설적으로 선포한 권면으로, 그리스도인의 기쁨은 외적 조건이 아닌 주님과의 친밀함에서 온다는 진리입니다.',
        keyword: '성령의 희락',
      },
      reflectionGuide:
        '오늘 당신의 미소는 하늘의 보석처럼 빛납니다. 성령의 열매인 희락은 세상이 주는 쾌락과 달리 영혼 깊은 곳에서 솟아나는 생명수와 같습니다. 오늘 하루 어떤 일이 일어나더라도 "주 안에서" 머물며 주님이 주신 이 아름다운 기쁨을 빼앗기지 마세요.',
      reflectionQuestions: [
        '내 기쁨을 방해하려고 하는 사소한 불평이나 걸림돌은 무엇인가요?',
        '주님 안에 거한다는 것은 오늘 내 구체적인 일상에서 어떤 태도로 나타날까요?',
        '오늘 하루 나의 표정과 언어로 누구에게 위로와 소망을 선물할 수 있을까요?',
      ],
      actionCore: '오늘 불평이 나오려 할 때 즉시 감사 제목 3가지를 속으로 외치기',
      actionItems: [
        {
          id: 'joy-4',
          title: '웃음과 함께하는 칭찬 한마디',
          description: '함께 일하거나 생활하는 사람의 장점을 발견하여 구체적으로 칭찬하기',
          category: 'love',
        },
        {
          id: 'joy-5',
          title: '오늘의 감사 일기 기록하기',
          description: '오늘 나에게 일어난 작은 기쁨의 순간 3가지를 메모장에 적어두기',
          category: 'thanks',
        },
        {
          id: 'joy-6',
          title: '식사 기도 정성껏 드리기',
          description: '식사 전 하나님이 베풀어주신 풍성한 식탁에 진심으로 감사 기도드리기',
          category: 'prayer',
        },
      ],
      prayerTitle: '하늘의 기쁨으로 충만케 하시는 주님께 드리는 1분 기도',
      prayerBody:
        '참 좋으신 하나님, 세상의 조건에 흔들리지 않는 하늘의 참된 기쁨을 제 심령에 부어주시니 감사합니다. 오늘도 주 안에서 항상 기뻐하며, 제 삶의 모든 자리에서 주님의 살아계심을 드러내는 복된 통로가 되게 하옵소서. 어두운 세상을 비추는 소금과 빛으로 저를 사용하여 주옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '어떤 상황 속에서도 주님 한 분만으로 만족하며 기뻐합니다.',
      praise: {
        title: '꽃들도',
        artist: 'JWorship',
        lyricSnippet: '꽃들도 구름도 바람도 넓은 바다도 찬양하라 찬양하라 예수를',
        theme: '찬양과 기쁨',
      },
      spiritualHabit: '출근/등교/외출할 때 문을 나서며 "주님, 오늘 하루도 주님과 동행합니다" 선포하기',
      readingSuggestion: '빌립보서 4장 (주 안에서 항상 기뻐하라)',
    },
  ],

  // 3. 새로운 용기와 도전이 필요한 상태 (결단, 담대함, 활력)
  courage: [
    {
      themeTitle: '두려움을 이기고 믿음으로 담대히 전진하는 승리의 날',
      themeSubtitle: '어디로 가든지 함께하시는 전능하신 하나님의 약속',
      verse: {
        reference: '여호수아 1장 9절',
        testament: '구약',
        book: '여호수아',
        chapter: 1,
        verseRange: '9',
        text: '내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라',
        context: '모세의 뒤를 이어 가나안 정복의 거대한 사명을 앞두고 두려워하던 여호수아에게 하나님께서 직접 찾아오셔서 주신 절대적인 동행의 언약입니다.',
        keyword: '담대함과 승리',
      },
      reflectionGuide:
        '오늘 당신의 눈빛에 깃든 결단과 생기는 하나님이 주신 거룩한 선물입니다. 눈앞에 요단강이 가로막고 여리고 성처럼 높은 문제들이 있을지라도 기억하세요. 전쟁은 당신의 능력에 달린 것이 아니라 하나님께 속한 것입니다. 하나님이 당신과 함께하시므로 당신은 이미 넉넉히 이길 수 있습니다.',
      reflectionQuestions: [
        '지금 내 앞에 가로막힌 가장 큰 두려움이나 넘어야 할 벽은 무엇인가요?',
        '하나님이 "내가 너와 함께한다"고 말씀하실 때 내 마음에 어떤 담대함이 일어나나요?',
        '오늘 믿음으로 내딛어야 할 작은 한 걸음(도전, 만남, 실행)은 무엇인가요?',
      ],
      actionCore: '오늘 주저하고 망설이던 일 하나를 기도로 시작하고 실행하기',
      actionItems: [
        {
          id: 'courage-1',
          title: '말씀 선포 스티커/메모 부착',
          description: '"여호수아 1:9 강하고 담대하라" 말씀을 모니터나 스마트폰 배경에 적어두기',
          category: 'word',
        },
        {
          id: 'courage-2',
          title: '어려운 일 앞두고 30초 화살기도',
          description: '중요한 미팅이나 시험, 업무 시작 전 "주님, 지혜와 담대함을 주옵소서" 기도하기',
          category: 'prayer',
        },
        {
          id: 'courage-3',
          title: '낙심한 이에게 용기 북돋아주기',
          description: '자신감을 잃은 동료나 가족에게 "당신은 해낼 수 있어요, 기도할게요" 전하기',
          category: 'love',
        },
      ],
      prayerTitle: '믿음의 담대함을 간구하는 1분 승리 기도',
      prayerBody:
        '만군의 여호와 하나님, 내 삶의 걸음마다 전능하신 손으로 붙들어 주시니 감사합니다. 눈앞의 상황이나 사람을 두려워하지 않게 하시고, 나와 함께하시는 크고 위대하신 하나님만을 바라보게 하옵소서. 주님이 주신 믿음의 날개를 펴고 강하고 담대하게 전진하오니, 오늘 부딪히는 모든 문제 앞에서 지혜와 용기를 더하여 주옵소서. 예수 그리스도의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '하나님이 나와 함께하시니 나는 결코 두려워하지 않습니다.',
      praise: {
        title: '주가 일하시네',
        artist: '이혁진',
        lyricSnippet: '날이 저물어 갈 때 빈들에서 걸을 때, 그때가 하나님의 때 주가 일하시네',
        theme: '믿음과 도전',
      },
      spiritualHabit: '문제를 만날 때마다 "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있다" 3번 암송하기',
      readingSuggestion: '여호수아 1장 (강하고 담대하라)',
    },
    {
      themeTitle: '내게 능력 주시는 주님 안에서 모든 것을 감당하는 날',
      themeSubtitle: '연약함을 채우시는 그리스도의 무한한 능력',
      verse: {
        reference: '빌립보서 4장 13절',
        testament: '신약',
        book: '빌립보서',
        chapter: 4,
        verseRange: '13',
        text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
        context: '바울이 비천에 처할 줄도 알고 풍부에 처할 줄도 아는 일체의 비결을 배운 후, 주님과 연합할 때 어떠한 사명도 감당할 수 있음을 선포한 확신의 말씀입니다.',
        keyword: '성령의 능력',
      },
      reflectionGuide:
        '이 말씀은 인간적인 욕망을 다 이룬다는 뜻이 아니라, 주님의 뜻 안에 머물 때 어떤 한계와 고난도 돌파할 수 있는 하늘의 권능이 부어진다는 약속입니다. 오늘 당신의 생기와 결단 위에 성령의 기름 부으심이 임하기를 축복합니다. 능력의 근원이신 예수님을 굳게 붙잡으세요.',
      reflectionQuestions: [
        '최근 "내 힘으로는 도저히 안 되겠다"고 느꼈던 순간은 언제인가요?',
        '능력 주시는 예수 그리스도께 맡겼을 때 어떤 평안이 찾아올까요?',
        '오늘 나에게 맡겨진 직분과 일터에서 주님의 능력을 어떻게 신뢰하며 일할까요?',
      ],
      actionCore: '오늘 마주하는 일마다 "주님의 능력으로 감당합니다" 선언하고 임하기',
      actionItems: [
        {
          id: 'courage-4',
          title: '스스로를 축복하는 선포 기도',
          description: '"나는 하나님의 존귀한 자녀이며, 주님의 능력으로 오늘 승리한다" 거울 보고 선포하기',
          category: 'prayer',
        },
        {
          id: 'courage-5',
          title: '미루어 두었던 숙제나 과제 시작하기',
          description: '어렵다고 생각되어 미뤄두었던 일의 첫 5분을 주님 이름으로 집중하여 시작하기',
          category: 'word',
        },
        {
          id: 'courage-6',
          title: '오늘의 감사를 주님께 돌려드리기',
          description: '일이 잘 풀렸을 때 내 공로가 아닌 하나님의 은혜임을 고백하기',
          category: 'thanks',
        },
      ],
      prayerTitle: '주님의 능력을 덧입는 1분 결단 기도',
      prayerBody:
        '전능하신 주님, 내 연약함을 누구보다 잘 아시는 주님 앞에 겸손히 엎드립니다. 내 경험과 지혜의 한계를 인정하오니, 성령의 지혜와 능력을 덧입혀 주옵소서. 내게 능력 주시는 그리스도 안에서 오늘 맡겨진 사명을 기쁨으로 감당하게 하시고, 나의 걸음을 통해 하나님의 영광이 온전히 나타나게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주님이 주시는 능력으로 모든 것을 넉넉히 감당합니다.',
      praise: {
        title: '원하고 바라고 기도합니다',
        artist: '민호기',
        lyricSnippet: '이 세상을 살아가는 동안에 나의 힘을 의지할 수 없으니 기도하고 낙심하지 말 것은',
        theme: '능력과 의탁',
      },
      spiritualHabit: '중요한 선택을 내리기 전 잠시 눈을 감고 "주님 뜻대로 인도하소서" 여쭙기',
      readingSuggestion: '이사야 40장 (오직 여호와를 앙망하는 자는)',
    },
  ],

  // 4. 지혜와 인도하심이 필요한 상태 (진지함, 집중, 분별력)
  wisdom: [
    {
      themeTitle: '내 생각을 내려놓고 하나님의 명철을 신뢰하는 지혜의 길',
      themeSubtitle: '모든 길을 인정할 때 내 앞길을 곧게 펴시는 하나님',
      verse: {
        reference: '잠언 3장 5-6절',
        testament: '구약',
        book: '잠언',
        chapter: 3,
        verseRange: '5-6',
        text: '너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라',
        context: '솔로몬 왕이 자녀에게 전하는 지혜의 정수로, 인간의 유한한 판단보다 무한하신 하나님의 주권을 온전히 신뢰하는 것이 참된 승리의 비결임을 가르칩니다.',
        keyword: '지혜와 인도하심',
      },
      reflectionGuide:
        '오늘 당신의 진지한 눈빛과 깊은 표정은 주님의 지혜를 갈망하는 복된 마음밭입니다. 우리는 인생의 갈림길마다 어디로 가야 할지 고민하지만, 하나님은 이미 당신을 향한 가장 선하고 완전한 계획을 가지고 계십니다. 내 좁은 소견을 내려놓고 범사에 하나님을 인정할 때, 하나님께서 친히 당신의 길을 가장 바르고 곧게 인도하실 것입니다.',
      reflectionQuestions: [
        '최근 내 머리로 계산하고 판단하느라 하나님께 묻지 못했던 일은 무엇인가요?',
        '일상의 작은 선택 속에서 하나님을 "인정한다"는 것은 어떤 의미일까요?',
        '오늘 나의 판단보다 하나님의 말씀에 순종해야 할 구체적인 영역은 어디인가요?',
      ],
      actionCore: '오늘 결정을 내릴 때마다 내 고집보다 하나님의 뜻과 평강을 먼저 구하기',
      actionItems: [
        {
          id: 'wisdom-1',
          title: '하루를 여는 3분 말씀 묵상',
          description: '잠언 한 장을 천천히 읽으며 마음에 와닿는 지혜의 구절을 밑줄 긋기',
          category: 'word',
        },
        {
          id: 'wisdom-2',
          title: '듣는 귀를 열기',
          description: '말하기는 더디 하고, 오늘 만나는 사람들의 이야기에 깊이 경청하기',
          category: 'love',
        },
        {
          id: 'wisdom-3',
          title: '급한 판단을 유보하고 기도하기',
          description: '감정적으로 반응하기 쉬운 상황에서 5초간 멈추고 주님의 지혜를 구하기',
          category: 'prayer',
        },
      ],
      prayerTitle: '하늘의 지혜와 인도하심을 구하는 1분 기도',
      prayerBody:
        '지혜의 근원이 되시는 여호와 하나님, 오늘도 제 유한한 생각과 경험을 의지하지 않고 오직 주님만을 신뢰합니다. 제 마음에 하늘의 총명과 분별력을 더하여 주셔서, 무엇이 선하고 기뻐하시며 온전하신 뜻인지 분별하게 하옵소서. 범사에 주님을 인정하오니 제 걸음을 친히 지도하여 주옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주님이 나의 길을 지도하시니 가장 바른길로 걸어갑니다.',
      praise: {
        title: '주의 말씀은 내 발에 등이요',
        artist: '찬양선교단',
        lyricSnippet: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다',
        theme: '지혜와 말씀',
      },
      spiritualHabit: '스마트폰을 켜기 전에 먼저 성경 앱이나 종이 성경을 펴서 말씀 한 절 읽기',
      readingSuggestion: '잠언 3장 (여호와를 신뢰하라)',
    },
    {
      themeTitle: '어두운 세상에서 내 발의 등불이 되시는 주의 말씀',
      themeSubtitle: '한 걸음씩 믿음으로 걷게 하시는 영원한 진리의 빛',
      verse: {
        reference: '시편 119편 105절',
        testament: '구약',
        book: '시편',
        chapter: 119,
        verseRange: '105',
        text: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다',
        context: '성경에서 가장 긴 시편이자 말씀 찬양시로, 캄캄한 밤길을 걸을 때 등잔불이 발 앞을 비추듯 하나님의 말씀이 인생의 확실한 나침반임을 고백합니다.',
        keyword: '말씀의 인도',
      },
      reflectionGuide:
        '하나님의 말씀은 10년 뒤의 길을 한꺼번에 비추어 주시지 않을 때가 많습니다. 대신 "내 발의 등"처럼 오늘 내가 딛어야 할 바로 그 한 걸음을 분명하게 비추어 주십니다. 미래의 불안으로 염려하기보다 오늘 내게 주신 말씀을 붙들고 정직하게 한 걸음 내딛으세요.',
      reflectionQuestions: [
        '미래에 대한 염려 때문에 오늘 내 발걸음의 은혜를 놓치고 있지는 않나요?',
        '최근 나를 어둠과 혼란에서 건져준 하나님의 말씀은 무엇이었나요?',
        '오늘 내가 순종하며 발걸음을 딛어야 할 "단 하나의 말씀"은 무엇인가요?',
      ],
      actionCore: '오늘 주신 성경 말씀을 작은 쪽지에 적어 주머니에 넣고 하루 종일 묵상하기',
      actionItems: [
        {
          id: 'wisdom-4',
          title: '말씀 구절 암송하기',
          description: '시편 119:105 말씀을 외우며 걸을 때마다 마음으로 읊조리기',
          category: 'word',
        },
        {
          id: 'wisdom-5',
          title: '정직하고 공의로운 언행 지키기',
          description: '작은 일에서도 타협하지 않고 진실하고 성실하게 행동하기',
          category: 'love',
        },
        {
          id: 'wisdom-6',
          title: '지혜로운 멘토나 동역자를 위해 기도하기',
          description: '나에게 영적 조언과 기도를 나누어주는 동역자를 축복하며 기도하기',
          category: 'prayer',
        },
      ],
      prayerTitle: '말씀의 등불을 따라 걷는 1분 기도',
      prayerBody:
        '빛 되신 하나님 아버지, 어두운 세상의 유혹과 혼란 속에서도 주의 말씀으로 내 발을 비추어 주시니 감사합니다. 한 치 앞도 알 수 없는 인생길이지만, 주님의 말씀이 내 발의 등불이 되시기에 안심하고 걸어갑니다. 오늘 주신 말씀에 온전히 순종하게 하시고, 생명의 길로 인도하옵소서. 예수 그리스도의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주의 말씀이 비추는 길만이 내 생명의 길입니다.',
      praise: {
        title: '시편 119편 (주의 말씀은)',
        artist: '헤리티지',
        lyricSnippet: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다',
        theme: '말씀과 등불',
      },
      spiritualHabit: '하루를 마감하며 오늘 말씀대로 살았는지 점검하고 감사하기',
      readingSuggestion: '시편 119편 97-112절 (말씀의 꿀송이)',
    },
  ],

  // 5. 사랑과 온화함, 섬김이 돋보이는 상태 (부드러운 미소, 사랑, 화평)
  love: [
    {
      themeTitle: '그리스도의 사랑으로 서로를 품고 세워주는 은혜의 날',
      themeSubtitle: '가장 위대한 계명, 영원히 떨어지지 않는 온전한 사랑',
      verse: {
        reference: '고린도전서 13장 4-7절',
        testament: '신약',
        book: '고린도전서',
        chapter: 13,
        verseRange: '4-7',
        text: '사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며 무례히 행하지 아니하며 자기의 유익을 구하지 아니하며 성내지 아니하며 악한 것을 생각하지 아니하며 불의를 기뻐하지 아니하며 진리와 함께 기뻐하고 모든 것을 참으며 모든 것을 믿으며 모든 것을 바라며 모든 것을 견디느니라',
        context: '바울이 고린도 교회의 분열과 은사 갈등을 치유하기 위해 선포한 사랑의 찬가로, 기독교 신앙의 핵심이자 완성인 아가페 사랑의 본질을 노래합니다.',
        keyword: '온유와 아가페 사랑',
      },
      reflectionGuide:
        '오늘 당신의 얼굴에 머무는 온화함과 따스함은 우리를 먼저 사랑하신 예수님의 심장을 닮았습니다. 세상은 자기주장과 유익을 좇지만, 십자가의 사랑은 오래 참고 온유하며 다른 이를 먼저 귀하게 여깁니다. 오늘 당신의 온유한 눈빛과 따뜻한 손길이 상처 입은 누군가의 영혼을 살리는 생명수가 될 것입니다.',
      reflectionQuestions: [
        '요즘 내 마음에 용서하기 어렵거나 오래 참아주기 버거운 사람은 누구인가요?',
        '예수님이 나를 어떻게 오래 참으시고 용서하셨는지 기억해 볼까요?',
        '오늘 내가 먼저 한 걸음 물러서서 양보하고 온유함으로 품을 수 있는 일은 무엇인가요?',
      ],
      actionCore: '오늘 마음에 섭섭함이 있던 사람을 위해 축복하며 중보기도하기',
      actionItems: [
        {
          id: 'love-1',
          title: '따뜻한 사랑의 커피나 간식 나누기',
          description: '수고하는 동료, 경비원, 청소원, 이웃에게 작은 음료와 함께 감사 전하기',
          category: 'love',
        },
        {
          id: 'love-2',
          title: '말에 온유함 담기',
          description: '짜증이 날 수 있는 상황에서 부드럽고 차분한 어조로 대답하기',
          category: 'word',
        },
        {
          id: 'love-3',
          title: '가족에게 사랑한다고 말하기',
          description: '쑥스럽더라도 배우자나 부모님, 자녀에게 "사랑해요, 고마워요" 표현하기',
          category: 'thanks',
        },
      ],
      prayerTitle: '예수님의 사랑으로 충만케 하시는 1분 기도',
      prayerBody:
        '사랑 자체이신 하나님 아버지, 자격 없는 저를 십자가의 사랑으로 먼저 품어주시고 자녀 삼아 주시니 감사합니다. 제 메마른 마음에 주님의 온유와 긍휼을 부어주옵소서. 내 이익을 구하지 않고 남을 나보다 낫게 여기며, 오래 참고 견디는 성숙한 사랑을 실천하게 하옵소서. 제 삶을 통해 주님의 사랑의 향기가 퍼져나가게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주님이 나를 사랑하셨듯이 나도 기쁨으로 이웃을 사랑합니다.',
      praise: {
        title: '하나님의 사랑을 사모하는 자',
        artist: '이천',
        lyricSnippet: '하나님의 사랑을 사모하는 자 하나님의 평화를 바라보는 자',
        theme: '사랑과 축복',
      },
      spiritualHabit: '누군가를 비판하고 싶을 때 그 사람의 장점 3가지를 먼저 떠올리기',
      readingSuggestion: '고린도전서 13장 (사랑장)',
    },
    {
      themeTitle: '서로 사랑하라 내가 너희를 사랑한 것 같이',
      themeSubtitle: '그리스도의 제자 됨을 세상에 드러내는 사랑의 표지',
      verse: {
        reference: '요한복음 13장 34절',
        testament: '신약',
        book: '요한복음',
        chapter: 13,
        verseRange: '34',
        text: '새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라',
        context: '예수님께서 십자가를 지시기 전 제자들의 발을 직접 씻기신 후, 제자들이 평생 마음에 새겨야 할 최고의 계명으로 주신 유언과도 같은 말씀입니다.',
        keyword: '서로 사랑과 섬김',
      },
      reflectionGuide:
        '예수님이 주신 계명의 기준은 "내가 너희를 사랑한 것 같이"입니다. 조건 없이, 먼저 다가가, 발을 씻기시듯 낮아져 섬기신 사랑입니다. 오늘 당신의 온유한 표정 속에 주님의 사랑이 가득합니다. 오늘 하루 작은 섬김으로 주님의 제자임을 증거하세요.',
      reflectionQuestions: [
        '오늘 내가 먼저 다가가 섬겨야 할 "제자의 발"은 누구의 발일까요?',
        '말과 혀로만이 아니라 행함과 진실함으로 실천할 수 있는 사랑은 무엇인가요?',
        '주님의 사랑을 묵상할 때 내 안에서 녹아내리는 마음의 벽은 무엇인가요?',
      ],
      actionCore: '오늘 주위 사람을 위해 아무 대가 없이 봉사하거나 궂은일 먼저 맡아보기',
      actionItems: [
        {
          id: 'love-4',
          title: '쓰레기 줍기나 자리 정돈하기',
          description: '공동 공간이나 사무실, 가정에서 먼저 나서서 깔끔하게 정돈하기',
          category: 'love',
        },
        {
          id: 'love-5',
          title: '오랜 친구나 성도에게 안부 묻기',
          description: '생각나는 사람에게 "요즘 평안하신가요? 늘 응원합니다" 안부 메시지 보내기',
          category: 'thanks',
        },
        {
          id: 'love-6',
          title: '말씀 한 구절 선물하기',
          description: '주변의 힘들어하는 지인에게 오늘 묵상한 은혜의 구절을 나누기',
          category: 'word',
        },
      ],
      prayerTitle: '섬김과 나눔의 사랑을 결단하는 1분 기도',
      prayerBody:
        '낮은 곳으로 오셔서 제자들의 발을 씻기신 예수님, 저 또한 주님의 본을 따라 낮아져 이웃을 섬기는 하루가 되게 하옵소서. 대접받기보다 먼저 대접하고, 사랑받기보다 먼저 사랑을 건네는 넉넉한 마음을 주옵소서. 제 작은 사랑의 손길을 통해 예수님의 온기가 세상에 전해지게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주님의 사랑이 내 안에 흐르니 기쁨으로 섬깁니다.',
      praise: {
        title: '축복송 (너는 하나님의 선물)',
        artist: '송정미',
        lyricSnippet: '너는 하나님의 사람 아름다운 주님의 열매',
        theme: '축복과 섬김',
      },
      spiritualHabit: '식사 전 다른 사람의 숟가락과 물잔을 먼저 챙겨주기',
      readingSuggestion: '요한일서 4장 (하나님은 사랑이시라)',
    },
  ],

  // 6. 평강과 동행, 염려를 맡기는 상태 (차분함, 잔잔한 묵상, 믿음)
  peace: [
    {
      themeTitle: '세상이 줄 수 없는 여호와 샬롬의 깊은 평안',
      themeSubtitle: '모든 지각에 뛰어난 하나님의 평강이 마음과 생각을 지키시는 날',
      verse: {
        reference: '빌립보서 4장 6-7절',
        testament: '신약',
        book: '빌립보서',
        chapter: 4,
        verseRange: '6-7',
        text: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라',
        context: '염려에 짓눌리기 쉬운 성도들에게 기도가 염려를 이기는 유일한 열쇠이며, 기도할 때 하나님께서 마음의 성벽처럼 평강을 세워주신다는 보배로운 약속입니다.',
        keyword: '샬롬과 평강',
      },
      reflectionGuide:
        '오늘 당신의 차분하고 깊은 얼굴 표정은 깊은 바다 밑바닥처럼 흔들림 없는 은혜의 상태를 보여줍니다. 폭풍우가 몰아쳐도 바다 깊은 곳은 고요하듯이, 하나님의 평강은 세상의 소음과 파도를 넘어 우리 심령을 지키십니다. 오늘 마음에 스며드는 작은 염려조차 감사함으로 하나님께 다 쏟아놓으세요.',
      reflectionQuestions: [
        '오늘 내 평안을 깨뜨리려고 은근히 속삭이는 걱정은 무엇인가요?',
        '"모든 지각에 뛰어난 평강"을 경험했던 지난날의 은혜를 기억해 볼까요?',
        '감사함으로 기도를 올려드릴 때 내 마음과 생각이 어떻게 지켜질까요?',
      ],
      actionCore: '염려가 떠오를 때마다 즉시 "주님, 이 일도 주께 맡깁니다" 기도하고 미소 짓기',
      actionItems: [
        {
          id: 'peace-1',
          title: '3분 침묵 기도 시간 갖기',
          description: '아무 말도 하지 않고 오직 주님의 임재와 평안을 느끼는 고요한 3분 보내기',
          category: 'prayer',
        },
        {
          id: 'peace-2',
          title: '평안을 전하는 온화한 눈빛 나누기',
          description: '마주치는 사람들에게 불안과 초조함 대신 따뜻하고 평온한 눈빛으로 인사하기',
          category: 'love',
        },
        {
          id: 'peace-3',
          title: '찬양 피아노 연주 듣기',
          description: '마음이 차분해지는 성경 피아노 연주나 CCM을 조용히 틀어놓기',
          category: 'thanks',
        },
      ],
      prayerTitle: '마음과 생각을 지켜주시는 주님께 드리는 1분 기도',
      prayerBody:
        '평강의 왕이신 하나님 아버지, 세상의 분주함과 불안 속에서도 제 마음을 그리스도 예수의 평강으로 지켜주시니 감사합니다. 제 앞길의 모든 문제를 기도로 주님께 아뢰오니, 불필요한 염려를 다 거두어가 주옵소서. 모든 지각에 뛰어난 주님의 샬롬이 오늘 제 생각과 심령을 온전히 지배하게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '주님의 평강이 내 마음의 문을 파수꾼처럼 지키십니다.',
      praise: {
        title: '평안을 너희에게 끼치노니',
        artist: '찬송가',
        lyricSnippet: '평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라',
        theme: '평강과 안식',
      },
      spiritualHabit: '침대에 누워 눈을 감을 때 "여호와께서 사랑하시는 자에게는 잠을 주신다" 고백하기',
      readingSuggestion: '요한복음 14장 (너희는 마음에 근심하지 말라)',
    },
    {
      themeTitle: '태초에 천지를 창조하신 하나님의 전능하신 손길',
      themeSubtitle: '혼돈을 질서로, 어둠을 찬란한 빛으로 바꾸시는 은혜',
      verse: {
        reference: '창세기 1장 1-3절',
        testament: '구약',
        book: '창세기',
        chapter: 1,
        verseRange: '1-3',
        text: '태초에 하나님이 천지를 창조하시니라 땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라 하나님이 이르시되 빛이 있으라 하시니 빛이 있었고',
        context: '성경 66권의 가장 첫머리를 여는 장엄한 선포로, 무에서 유를 창조하시고 어둠과 혼돈 속에 거룩한 질서와 빛을 명령하신 하나님의 절대 주권을 나타냅니다.',
        keyword: '창조와 새 시작',
      },
      reflectionGuide:
        '인생이 때로 혼돈스럽고 공허하며 흑암이 가득한 것처럼 느껴질 때가 있습니다. 그러나 바로 그 흑암 위에 하나님의 성령이 운행하고 계셨습니다! 그리고 주님은 "빛이 있으라" 선포하셨습니다. 오늘 당신의 삶의 어두운 구석마다 주님의 창조의 빛이 찬란하게 비추어 새로운 시작이 열릴 줄 믿습니다.',
      reflectionQuestions: [
        '내 삶에서 하나님의 "빛이 있으라"는 창조의 음성이 필요한 영역은 어디인가요?',
        '천지를 창조하신 크고 위대하신 하나님께 내 작은 문제들을 맡길 수 있나요?',
        '오늘 새롭게 시작하고 싶은 믿음의 결단은 무엇인가요?',
      ],
      actionCore: '오늘 아침 햇살을 바라보며 "주님, 내 영혼에 빛을 비추소서" 선포하기',
      actionItems: [
        {
          id: 'peace-4',
          title: '주변 공간 깨끗이 환기하고 정리하기',
          description: '창문을 열어 신선한 공기를 마시고 책상이나 방을 단정히 정돈하여 새 기분 내기',
          category: 'word',
        },
        {
          id: 'peace-5',
          title: '새로운 다짐 한 줄 적기',
          description: '노트 첫 장에 "하나님과 함께 시작하는 새로운 오늘" 적어두기',
          category: 'thanks',
        },
        {
          id: 'peace-6',
          title: '나를 만드신 주님께 감사 찬양하기',
          description: '나를 하나님의 형상대로 지으셨음을 감사하며 찬양 한 곡 부르기',
          category: 'prayer',
        },
      ],
      prayerTitle: '빛으로 찾아오시는 창조주 하나님께 드리는 1분 기도',
      prayerBody:
        '온 우주 만물을 말씀으로 지으신 창조주 하나님, 내 삶의 어둠과 혼돈 속에서도 "빛이 있으라" 말씀하여 주시니 감사합니다. 무에서 유를 창조하시는 주님의 전능하심을 신뢰하오니, 오늘 제 삶에 새로운 은혜의 계절이 시작되게 하옵소서. 주님의 빛을 품고 세상을 밝히는 하나님의 자녀로 살아가게 하옵소서. 예수 그리스도의 이름으로 기도드립니다. 아멘.',
      prayerConfession: '창조주 하나님이 내 삶을 아름답고 새롭게 빚어가십니다.',
      praise: {
        title: '참 아름다워라',
        artist: '찬송가 478장',
        lyricSnippet: '참 아름다워라 주님의 세계는 저 솔로몬의 옷보다 더 고운 백합화',
        theme: '창조와 찬양',
      },
      spiritualHabit: '자연(나무, 꽃, 하늘, 바람)을 볼 때마다 하나님의 창조 솜씨를 찬양하기',
      readingSuggestion: '창세기 1장 (태초에 하나님이 천지를 창조하시니라)',
    },
  ],
};

// 생애주기별 맞춤 축복 메시지 계산 (한글 / 영어 지원)
export function getLifeStageInfo(
  birthDateStr: string,
  lang: Language = 'ko'
): LifeStageInfo {
  const now = new Date();
  let age = 30; // 기본값
  if (birthDateStr) {
    const b = new Date(birthDateStr);
    if (!isNaN(b.getTime())) {
      age = now.getFullYear() - b.getFullYear();
      const m = now.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < b.getDate())) {
        age--;
      }
    }
  }

  if (lang === 'en') {
    if (age <= 19) {
      return {
        stage: 'Youth',
        age,
        stageMessage:
          'You are in a precious season of dreams and growth. May you grow in wisdom and favor with God and people.',
        prayerFocus: 'Wisdom in studies, strong identity in Christ, godly friendships',
      };
    } else if (age <= 35) {
      return {
        stage: 'Young Adult',
        age,
        stageMessage:
          'You are setting sail with faith and energy. May God guide your calling, relationships, and bold vision.',
        prayerFocus: 'Career direction, godly relationships, bold faith and purpose',
      };
    } else if (age <= 50) {
      return {
        stage: 'Adult',
        age,
        stageMessage:
          'You stand as a steady pillar of faith for family and work. May the Lord bless the work of your hands.',
        prayerFocus: 'Harmony at home, integrity at work, passing faith to the next generation',
      };
    } else if (age <= 65) {
      return {
        stage: 'Midlife',
        age,
        stageMessage:
          'You are in a mature season of wisdom and fruitfulness. May you be a channel of grace and encouragement.',
        prayerFocus: 'Strength in body and spirit, wise leadership, blessing those around you',
      };
    } else {
      return {
        stage: 'Senior',
        age,
        stageMessage:
          'Your life is a crown of faithfulness and living testimony. May you enjoy renewed strength and overflowing gratitude.',
        prayerFocus: 'Lifelong gratitude, eternal hope, blessing and health for generations',
      };
    }
  }

  if (age <= 19) {
    return {
      stage: '어린이·청소년',
      age,
      stageMessage:
        '꿈과 비전의 씨앗을 품은 소중한 시기입니다. 다니엘과 다윗처럼 하나님을 경외하며 지혜와 키가 자라가기를 축복합니다.',
      prayerFocus: '학업의 지혜, 바른 믿음의 정체성, 선한 만남과 꿈의 발견',
    };
  } else if (age <= 35) {
    return {
      stage: '청년',
      age,
      stageMessage:
        '세상을 향해 믿음의 돛을 올리는 청년의 때입니다. 청년의 열정과 순결함으로 주님의 나라를 일구어가는 거룩한 세대가 되기를 축복합니다.',
      prayerFocus: '진로와 직장의 문, 믿음의 배우자 만남, 담대한 비전과 신앙의 기초',
    };
  } else if (age <= 50) {
    return {
      stage: '장년',
      age,
      stageMessage:
        '가정과 일터의 든든한 믿음의 기둥으로 서 있는 때입니다. 아브라함처럼 삶의 모든 자리를 믿음의 제단으로 삼고 번성하기를 축복합니다.',
      prayerFocus: '가정의 영적 화목, 일터의 축복과 정직, 자녀를 향한 신앙 전수',
    };
  } else if (age <= 65) {
    return {
      stage: '중년',
      age,
      stageMessage:
        '인생의 풍성한 열매를 맺고 지혜를 나누는 성숙의 계절입니다. 요셉처럼 위기를 기회로 바꾸며 주위 사람들에게 축복의 통로가 되기를 축복합니다.',
      prayerFocus: '영육 간의 강건함, 공동체를 세우는 지혜로운 리더십, 후대를 향한 축복',
    };
  } else {
    return {
      stage: '시니어',
      age,
      stageMessage:
        '백발은 영화의 면류관이며 평생 주님과 동행해 온 살아있는 신앙의 증거입니다. 갈렙처럼 영혼의 청춘을 유지하며 자손 대대로 축복의 근원이 되시기를 축복합니다.',
      prayerFocus: '평생의 감사, 영원한 본향을 향한 소망, 자손들의 신앙 계승과 영육 강건',
    };
  }
}
