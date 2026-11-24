import { BonusGraceData, FaceMetrics, Language } from '../types/bible';

const BONUS_KO: Record<FaceMetrics['dominantMood'], BonusGraceData> = {
  rest: {
    companionVerseRef: '이사야 40장 31절',
    companionVerseText:
      '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다',
    biblicalFigureName: '선지자 엘리야 (열왕기상 19장)',
    biblicalFigureStory:
      '큰 사역을 마친 뒤 탈진해 로뎀나무 아래 쓰러졌던 엘리야에게 하나님은 꾸짖지 않으시고 먼저 잠과 구운 떡과 물을 주셨습니다. 오늘 주님도 지친 당신에게 똑같은 로뎀나무의 쉼을 선물하십니다.',
    relationshipWisdom:
      '피곤할 때는 가까운 사람에게 무심코 날카로운 말이 나가기 쉽습니다. 오늘은 모든 사람을 만족시키려 애쓰기보다 "잠시 숨 고르며 부드럽게 답하기"를 선택해 보세요.',
    workWisdom:
      '완벽하게 다 해내려는 긴장을 조금 내려놓고, 오늘 가장 중요한 일 1~2가지에만 정직하게 집중하세요. 나머지는 주님께 맡기고 내일로 넘겨도 괜찮습니다.',
    gratitudeSeeds: [
      '오늘 하루도 숨 쉬고 걸을 수 있게 지켜주신 생명과 건강',
      '지친 마음을 기댈 수 있는 주님의 품과 안전한 쉼터',
      '오늘 내 곁에서 묵묵히 함께해 주는 가족과 소중한 이웃',
    ],
    peaceTip:
      '어깨의 힘을 툭 풀고 4초 들이마시고 6초 내쉬며 속으로 "주님, 나의 쉼이 되소서"라고 3번 천천히 고백해 보세요.',
    eveningPrayerTitle: '하루를 마감하는 저녁 안식 기도문',
    eveningPrayerBody:
      '사랑하는 하나님 아버지, 오늘 하루의 모든 수고와 땀방울을 주님 손에 올려드립니다. 잘한 일은 감사함으로, 아쉬웠던 일은 주님의 긍휼에 맡기고 평안히 내려놓습니다. 오늘 밤 내 영혼과 육신을 깊고 단 잠으로 덮어주셔서, 내일 아침 독수리처럼 새 힘으로 일어나게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
    eveningBlessingLine: '여호와께서 사랑하시는 자에게는 평안한 잠을 주십니다.',
  },
  joy: {
    companionVerseRef: '느헤미야 8장 10절',
    companionVerseText: '여호와로 인하여 기뻐하는 것이 너희의 힘이니라',
    biblicalFigureName: '다윗 왕 (사무엘하 6장)',
    biblicalFigureStory:
      '하나님의 언약궤가 돌아올 때 다윗은 체면도 잊고 온 힘을 다해 춤추며 기뻐했습니다. 주님 한 분으로 기뻐하는 마음은 어떤 상황도 이겨내는 가장 강한 영적 원동력입니다.',
    relationshipWisdom:
      '오늘 당신 안에 넘치는 기쁨은 나눌수록 두 배가 됩니다. 먼저 웃어주고 작은 칭찬 한마디를 건넬 때, 주변의 무거웠던 분위기까지 환하게 밝아질 것입니다.',
    workWisdom:
      '억지로 하는 일은 금방 지치지만, 감사함으로 임하는 일에는 창의력과 지혜가 깃듭니다. 오늘 맡겨진 일터를 주님이 주신 축복의 무대로 여겨보세요.',
    gratitudeSeeds: [
      '오늘 내 마음에 찾아온 잔잔한 기쁨과 웃음의 순간',
      '어제까지 나를 선하게 인도해 주신 에벤에셀의 은혜',
      '일용할 양식과 따뜻한 일상을 허락하신 주님의 공급하심',
    ],
    peaceTip:
      '기분이 좋을 때일수록 10초간 멈춰 서서 "이 모든 것이 주님의 은혜입니다"라고 고백하면 기쁨이 교만이 아닌 깊은 평강으로 자리 잡습니다.',
    eveningPrayerTitle: '하루를 마감하는 저녁 감사 기도문',
    eveningPrayerBody:
      '기쁨의 근원이 되시는 하나님 아버지, 오늘 하루 저에게 웃음과 감사의 제목들을 허락해 주셔서 감사합니다. 하루 동안 만난 사람들과 나눈 따뜻한 말들이 주님께 영광이 되게 하옵소서. 감사의 마음을 품은 채 평안한 밤을 맞게 하시고, 내일도 주 안에서 기뻐하는 복된 하루 되게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
    eveningBlessingLine: '감사로 하루를 닫는 영혼 위에 내일의 축복이 예비됩니다.',
  },
  courage: {
    companionVerseRef: '이사야 41장 10절',
    companionVerseText:
      '두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라',
    biblicalFigureName: '다니엘 (다니엘 6장)',
    biblicalFigureStory:
      '사자굴의 위협 앞에서도 다니엘은 흔들리지 않고 평소처럼 하루 세 번 창문을 열고 기도했습니다. 진정한 담대함은 상황이 안전해서가 아니라, 살아계신 하나님을 신뢰하는 습관에서 나옵니다.',
    relationshipWisdom:
      '불편하거나 미루어 두었던 대화가 있다면 오늘 정직하고 온유한 태도로 먼저 다가가 보세요. 두려움을 넘어선 진심은 관계를 새롭게 회복시킵니다.',
    workWisdom:
      '어려워 보이는 과제일수록 가장 작은 첫 단계부터 기도로 시작해 보세요. 내 능력의 한계를 인정하고 주님의 도우심을 구할 때 돌파구가 열립니다.',
    gratitudeSeeds: [
      '두려움보다 크신 전능하신 하나님이 나와 동행하심',
      '오늘 새롭게 도전하고 성장할 수 있는 소중한 기회',
      '지난 위기들을 무사히 건너오게 하신 주님의 보호하심',
    ],
    peaceTip:
      '긴장감이 몰려올 때 주먹을 가볍게 쥐었다 펴며 "하나님이 나를 위하시면 누가 나를 대적하리요"를 마음속으로 선포해 보세요.',
    eveningPrayerTitle: '하루를 마감하는 저녁 승리 기도문',
    eveningPrayerBody:
      '전능하신 하나님 아버지, 오늘 하루 두려움을 이기고 믿음으로 걸어가게 붙들어 주시니 감사합니다. 아직 해결되지 않은 문제들도 주님의 오른손에 온전히 맡겨드립니다. 밤사이 제 마음에 담대한 평안을 채워주시고, 내일도 주님과 함께 넉넉히 이기는 하루 되게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
    eveningBlessingLine: '주님의 의로운 오른손이 오늘 밤도 당신을 굳세게 붙드십니다.',
  },
  wisdom: {
    companionVerseRef: '야고보서 1장 5절',
    companionVerseText:
      '너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라',
    biblicalFigureName: '솔로몬 왕 (열왕기상 3장)',
    biblicalFigureStory:
      '젊은 왕 솔로몬은 부와 명예 대신 백성을 바르게 이끌 "듣는 마음(지혜)"을 구했고, 하나님은 그의 겸손을 기뻐하시며 구하지 않은 복까지 넘치게 채워주셨습니다.',
    relationshipWisdom:
      '상대의 말을 끝까지 경청하는 것만으로도 관계의 절반은 해결됩니다. 성급히 결론 내리기보다 상대의 입장을 한 번 더 헤아려 보세요.',
    workWisdom:
      '복잡한 문제일수록 본질로 돌아가세요. 종이에 핵심 3가지만 적어보고 "주님, 무엇이 가장 선한 선택입니까?"라고 1분만 기도하면 생각이 맑아집니다.',
    gratitudeSeeds: [
      '꾸짖지 않고 후히 지혜를 주시는 인자하신 하나님',
      '오늘 내 발걸음을 비추어 준 성경 말씀과 깨달음',
      '내 곁에서 바른 조언과 기도를 나눠주는 귀한 동역자들',
    ],
    peaceTip:
      '생각이 너무 복잡할 때는 메모장에 고민 1줄만 적고 "주님께 맡김"이라고 써 둔 뒤 잠시 머리를 비워보세요.',
    eveningPrayerTitle: '하루를 마감하는 저녁 지혜 기도문',
    eveningPrayerBody:
      '지혜의 근원이 되시는 하나님 아버지, 오늘 하루 수많은 선택과 생각 속에서 저를 지켜주셔서 감사합니다. 내 짧은 판단으로 실수한 부분이 있다면 주님의 은혜로 선하게 덮어주옵소서. 고요한 밤 주님의 잔잔한 위로로 마음을 정돈하게 하시고, 내일은 더 맑은 분별력으로 걷게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
    eveningBlessingLine: '범사에 주님을 인정하는 자의 앞길을 하나님이 곧게 펴십니다.',
  },
  love: {
    companionVerseRef: '에베소서 4장 32절',
    companionVerseText:
      '서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라',
    biblicalFigureName: '선한 사마리아인 (누가복음 10장)',
    biblicalFigureStory:
      '바쁜 길 위에서 멈춰 서서 상처 입은 이웃을 돌본 선한 사마리아인처럼, 주님이 기뻐하시는 사랑은 거창한 구호가 아니라 지금 내 눈앞의 한 사람을 외면하지 않는 작은 친절입니다.',
    relationshipWisdom:
      '서운한 마음이 들 때 "저 사람도 오늘 많이 힘들었을 거야"라고 한 번만 더 품어주세요. 온유한 대답 한마디가 다툼을 녹이고 평화를 부릅니다.',
    workWisdom:
      '함께 일하는 동료의 수고를 먼저 알아봐 주고 감사하다고 말해 보세요. 섬김의 리더십이 있는 곳에 하나님 나라의 온기가 흘러갑니다.',
    gratitudeSeeds: [
      '조건 없이 나를 먼저 사랑하시고 용서해 주신 십자가의 은혜',
      '오늘 내가 작은 친절과 사랑을 베풀 수 있었던 순간들',
      '나를 위해 기도해 주고 아껴주는 가족과 공동체의 사랑',
    ],
    peaceTip:
      '마음에 불편한 사람이 떠오를 때, 그 이름을 부르며 "주님, 그 영혼을 축복해 주세요"라고 짧게 기도하면 내 마음이 먼저 자유로워집니다.',
    eveningPrayerTitle: '하루를 마감하는 저녁 사랑 기도문',
    eveningPrayerBody:
      '사랑이 풍성하신 하나님 아버지, 오늘 하루도 자격 없는 저를 사랑으로 품어주시니 감사합니다. 오늘 내가 만난 모든 이들에게 주님의 온기가 전해졌기를 소망하며, 혹시라도 상처를 주거나 인색했던 마음을 용서해 주옵소서. 주님의 사랑 안에서 평안히 쉬게 하시고, 내일은 더 넉넉히 사랑하게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
    eveningBlessingLine: '그리스도의 사랑이 당신의 가정과 일터에 향기처럼 번져갑니다.',
  },
  peace: {
    companionVerseRef: '요한복음 14장 27절',
    companionVerseText:
      '평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라',
    biblicalFigureName: '베다니의 마리아 (누가복음 10장)',
    biblicalFigureStory:
      '분주한 일들 속에서 염려하던 마르다와 달리, 마리아는 예수님의 발치에 앉아 말씀 듣는 가장 좋은 편을 택했습니다. 오늘 잠시 분주함을 내려놓고 주님 발치에 머무는 시간이 당신의 평안입니다.',
    relationshipWisdom:
      '조급한 마음을 내려놓고 한 박자 천천히 말하고 들어보세요. 내 안에 샬롬이 머물 때, 곁에 있는 사람들도 자연스럽게 편안함을 느낍니다.',
    workWisdom:
      '결과에 대한 과도한 불안보다 오늘 맡겨진 과정의 성실함에 마음을 두세요. 씨를 심고 물을 주는 것은 우리의 몫이지만, 자라게 하시는 분은 하나님이십니다.',
    gratitudeSeeds: [
      '세상의 소음 속에서도 내 마음을 지키시는 하나님의 샬롬',
      '큰 사고나 어려움 없이 무사히 지켜주신 오늘의 일상',
      '언제든 기도로 나아갈 수 있는 은혜의 보좌가 열려 있음',
    ],
    peaceTip:
      '눈을 잠시 감고 "여호와 샬롬, 주님의 평강이 내 안에 머뭅니다"라고 고요히 읊조리며 마음의 속도를 늦춰보세요.',
    eveningPrayerTitle: '하루를 마감하는 저녁 평강 기도문',
    eveningPrayerBody:
      '평강의 왕이신 하나님 아버지, 분주했던 하루를 무사히 마치고 주님 앞에 고요히 나아옵니다. 오늘 제 마음에 쌓였던 크고 작은 근심을 모두 주님께 맡겨드리오니, 세상이 줄 수 없는 깊은 평안으로 이 밤을 덮어주옵소서. 내일 아침에도 주님의 선하심을 기대하며 기쁨으로 눈뜨게 하옵소서. 예수님의 이름으로 기도드립니다. 아멘.',
    eveningBlessingLine: '하나님의 깊은 샬롬이 오늘 밤 당신의 마음과 생각을 지키십니다.',
  },
};

const BONUS_EN: Record<FaceMetrics['dominantMood'], BonusGraceData> = {
  rest: {
    companionVerseRef: 'Isaiah 40:31',
    companionVerseText:
      'Those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
    biblicalFigureName: 'Elijah (1 Kings 19)',
    biblicalFigureStory:
      'When Elijah collapsed in exhaustion under a broom tree, God did not scold him—He gave him sleep, warm bread, and water first. Today, the Lord offers you that same gentle renewal.',
    relationshipWisdom:
      'Fatigue can make our words sharper than we intend. Rather than trying to please everyone today, choose slow, gentle responses.',
    workWisdom:
      'Release the pressure of perfection. Focus faithfully on just 1 or 2 core tasks today and entrust the rest to tomorrow.',
    gratitudeSeeds: [
      'The gift of breath and life sustaining you today',
      'God’s safe refuge where weary hearts can freely rest',
      'Loved ones who quietly walk beside you',
    ],
    peaceTip:
      'Drop your shoulders, breathe in for 4 seconds and out for 6, whispering: "Lord, You are my rest."',
    eveningPrayerTitle: 'Evening Prayer of Rest',
    eveningPrayerBody:
      'Loving Father, I place every effort and weight of today into Your hands. I release both successes and regrets to Your mercy. Cover my mind and body with deep, peaceful sleep tonight so I may rise with renewed strength tomorrow. In Jesus’ name, Amen.',
    eveningBlessingLine: 'The Lord grants peaceful sleep to those He loves.',
  },
  joy: {
    companionVerseRef: 'Nehemiah 8:10',
    companionVerseText: 'For the joy of Yahweh is your strength.',
    biblicalFigureName: 'King David (2 Samuel 6)',
    biblicalFigureStory:
      'When the ark returned, David rejoiced wholeheartedly before the Lord. Gladness rooted in God becomes an unshakable strength for every season.',
    relationshipWisdom:
      'Joy multiplies when shared. Offer a warm greeting and one specific word of encouragement to brighten someone’s day.',
    workWisdom:
      'Gratitude turns routine work into meaningful service. Step into your tasks today with a cheerful, thankful spirit.',
    gratitudeSeeds: [
      'Moments of warmth and laughter gifted to you today',
      'God’s steady faithfulness that has carried you this far',
      'Daily bread and ordinary blessings around your table',
    ],
    peaceTip:
      'Pause for 10 seconds in happy moments to whisper, "All of this is Your grace, Lord."',
    eveningPrayerTitle: 'Evening Prayer of Thanksgiving',
    eveningPrayerBody:
      'Father of all joy, thank You for the smiles and mercies woven into this day. May the kindness I shared bring honor to Your name. Fill my night with gratitude and wake me with gladness tomorrow. In Jesus’ name, Amen.',
    eveningBlessingLine: 'A thankful night opens the door to tomorrow’s grace.',
  },
  courage: {
    companionVerseRef: 'Isaiah 41:10',
    companionVerseText:
      'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you.',
    biblicalFigureName: 'Daniel (Daniel 6)',
    biblicalFigureStory:
      'Even facing the lions’ den, Daniel kept his steady rhythm of prayer three times a day. True boldness grows from daily trust in the living God.',
    relationshipWisdom:
      'If an important conversation has been delayed out of hesitation, step forward today with honesty and gentle humility.',
    workWisdom:
      'Break a daunting task into one small first step and begin with a brief prayer for God’s help.',
    gratitudeSeeds: [
      'The Almighty God who walks beside you in every challenge',
      'Fresh opportunities to grow in faith and courage today',
      'Past hurdles the Lord has already brought you safely through',
    ],
    peaceTip:
      'When tension rises, unclench your hands and remind yourself: "If God is for me, I have nothing to fear."',
    eveningPrayerTitle: 'Evening Prayer of Victory',
    eveningPrayerBody:
      'Mighty God, thank You for holding me steady today. I entrust every unfinished challenge into Your capable hands tonight. Guard my rest with bold peace and lead me forward tomorrow. In Jesus’ name, Amen.',
    eveningBlessingLine: 'God’s righteous right hand holds you secure through the night.',
  },
  wisdom: {
    companionVerseRef: 'James 1:5',
    companionVerseText:
      'If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.',
    biblicalFigureName: 'King Solomon (1 Kings 3)',
    biblicalFigureStory:
      'Instead of wealth or fame, Solomon asked for a discerning heart to serve well—and God delighted to bless him richly with wisdom.',
    relationshipWisdom:
      'Listening patiently resolves half of all misunderstandings. Seek to understand the other person’s heart before answering.',
    workWisdom:
      'Simplify complex decisions to 3 key points and pray for 1 quiet minute before choosing your next step.',
    gratitudeSeeds: [
      'A generous God who gives wisdom without finding fault',
      'Scripture that brings clarity to confusing moments',
      'Wise friends and mentors who pray for your journey',
    ],
    peaceTip:
      'Write down one nagging worry on paper, add "Entrusted to God," and let your mind rest.',
    eveningPrayerTitle: 'Evening Prayer for Clarity',
    eveningPrayerBody:
      'Source of all wisdom, thank You for guiding my choices today. Cover any missteps with Your grace, quiet my busy thoughts tonight, and grant me clear discernment for tomorrow. In Jesus’ name, Amen.',
    eveningBlessingLine: 'As you acknowledge the Lord, He gently straightens your path.',
  },
  love: {
    companionVerseRef: 'Ephesians 4:32',
    companionVerseText:
      'Be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.',
    biblicalFigureName: 'The Good Samaritan (Luke 10)',
    biblicalFigureStory:
      'Real love is rarely loud—it simply notices the person right in front of us and pauses to show mercy.',
    relationshipWisdom:
      'When friction arises, remind yourself that the other person may be carrying an unseen burden too. A soft answer brings peace.',
    workWisdom:
      'Notice and thank a coworker for their unseen effort today. Servant-hearted kindness transforms any workplace.',
    gratitudeSeeds: [
      'The unconditional love and forgiveness of the cross',
      'Small opportunities to share warmth and kindness today',
      'Family and community who care and pray for you',
    ],
    peaceTip:
      'If someone difficult comes to mind, whisper a short blessing for them—it sets your own heart free first.',
    eveningPrayerTitle: 'Evening Prayer of Love',
    eveningPrayerBody:
      'Father of Love, thank You for surrounding me with mercy today. Forgive any moment I lacked patience, and let every seed of kindness I planted bear gentle fruit. Keep me in Your love tonight. In Jesus’ name, Amen.',
    eveningBlessingLine: 'The warmth of Christ’s love rests gently over your home tonight.',
  },
  peace: {
    companionVerseRef: 'John 14:27',
    companionVerseText:
      'Peace I leave with you. My peace I give to you; not as the world gives, give I to you. Don’t let your heart be troubled, neither let it be fearful.',
    biblicalFigureName: 'Mary of Bethany (Luke 10)',
    biblicalFigureStory:
      'While busyness pulled Martha in every direction, Mary chose the quiet seat at Jesus’ feet. A few unhurried minutes with Christ anchor your whole day.',
    relationshipWisdom:
      'Slow down your pace in conversation. When peace rules inside you, others around you feel safe and calm too.',
    workWisdom:
      'Focus on faithful effort rather than anxious outcomes. We plant and water, and God brings the growth.',
    gratitudeSeeds: [
      'God’s steady shalom guarding your heart amid daily noise',
      'Quiet protection over your steps throughout this day',
      'An open throne of grace always ready to hear your prayer',
    ],
    peaceTip:
      'Close your eyes for 15 seconds and softly breathe: "Yahweh Shalom, Your peace dwells within me."',
    eveningPrayerTitle: 'Evening Prayer of Shalom',
    eveningPrayerBody:
      'Prince of Peace, I come quietly before You at the close of this day. I hand over every lingering worry and receive the deep peace only You can give. Watch over my rest tonight. In Jesus’ name, Amen.',
    eveningBlessingLine: 'God’s deep shalom stands guard over your heart and mind tonight.',
  },
};

export function getBonusGraceData(
  mood: FaceMetrics['dominantMood'],
  lang: Language,
  seed: number = 0
): BonusGraceData {
  const table = lang === 'en' ? BONUS_EN : BONUS_KO;
  const moods: Array<FaceMetrics['dominantMood']> = [
    'rest',
    'joy',
    'courage',
    'wisdom',
    'love',
    'peace',
  ];
  const baseIdx = Math.max(0, moods.indexOf(mood));
  // 날짜 시드에 따라 기본 테마 또는 인접 테마에서 연관 말씀·지혜·저녁 기도를 다채롭게 교차 조합
  const primary = table[moods[baseIdx]] || table.peace;
  const secondary = table[moods[(baseIdx + (seed % 5) + 1) % moods.length]] || primary;
  const tertiary = table[moods[(baseIdx + ((seed >> 2) % 5) + 1) % moods.length]] || primary;

  if (seed === 0) return primary;

  return {
    companionVerseRef: (seed % 2 === 0 ? primary : secondary).companionVerseRef,
    companionVerseText: (seed % 2 === 0 ? primary : secondary).companionVerseText,
    biblicalFigureName: (seed % 2 === 0 ? primary : secondary).biblicalFigureName,
    biblicalFigureStory: (seed % 2 === 0 ? primary : secondary).biblicalFigureStory,
    relationshipWisdom: ((seed >> 1) % 2 === 0 ? primary : tertiary).relationshipWisdom,
    workWisdom: ((seed >> 2) % 2 === 0 ? primary : secondary).workWisdom,
    gratitudeSeeds: ((seed >> 3) % 2 === 0 ? primary : tertiary).gratitudeSeeds,
    peaceTip: ((seed >> 1) % 2 === 0 ? secondary : primary).peaceTip,
    eveningPrayerTitle: ((seed >> 4) % 2 === 0 ? primary : secondary).eveningPrayerTitle,
    eveningPrayerBody: ((seed >> 4) % 2 === 0 ? primary : secondary).eveningPrayerBody,
    eveningBlessingLine: ((seed >> 4) % 2 === 0 ? primary : secondary).eveningBlessingLine,
  };
}
