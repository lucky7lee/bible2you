import {
  AppSettings,
  BibleResultData,
  FaceMetrics,
  UserProfile,
} from '../types/bible';
import { getLifeStageInfo, VERSE_DATABASE, VerseThemeData } from './bibleVerses';

// 간단한 문자열 해시 함수 (일관된 시드 도출용)
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 오늘 날짜 포맷 (예: 2026년 11월 19일 목요일)
export function getTodayDateText(): string {
  const now = new Date();
  const days = ['주일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayName = days[now.getDay()];
  return `${year}년 ${month}월 ${date}일 (${dayName})`;
}

// 로컬 지능형 엔진으로 맞춤 말씀 생성
export function generateLocalBibleResult(
  user: UserProfile,
  metrics: FaceMetrics
): BibleResultData {
  const lifeStage = getLifeStageInfo(user.birthDate);
  const todayDateText = getTodayDateText();

  // 지배적 기분 테마 목록
  const mood = metrics.dominantMood || 'peace';
  const themeList: VerseThemeData[] = VERSE_DATABASE[mood] || VERSE_DATABASE.peace;

  // 이름, 생년월일, 오늘 날짜로 시드 생성
  const todayYMD = new Date().toISOString().slice(0, 10);
  const seedStr = `${user.name || '성도'}_${user.birthDate || '2000-01-01'}_${todayYMD}_${mood}`;
  const seed = stringHash(seedStr);
  const picked = themeList[seed % themeList.length];

  // 은혜 지수 (0~100) 계산: 미소, 화평, 조화 등을 종합
  const baseSpiritual = Math.round(
    metrics.smileScore * 0.35 +
      metrics.calmScore * 0.35 +
      metrics.vitalityScore * 0.2 +
      metrics.symmetryScore * 0.1
  );
  // 피로도가 높으면 주님의 특별한 위로 점수로 보정
  const spiritualScore = Math.max(75, Math.min(99, baseSpiritual + (metrics.fatigueScore > 60 ? 12 : 5)));

  // 사용자 호칭 (예: 홍길동 성도님 / 홍길동 청년님)
  const title = user.title ? `${user.title}님` : (user.name ? `${user.name} 성도님` : '성도님');
  const displayName = user.name ? `${user.name} ${title}` : title;

  // 얼굴 상태 영적 진단 메시지 조립
  let faceSpiritualDiagnosis = '';
  if (metrics.dominantMood === 'rest') {
    faceSpiritualDiagnosis = `오늘 ${displayName}의 얼굴에는 성실하게 오늘을 달려온 수고와 잔잔한 피로가 엿보입니다. 하나님은 일하시는 당신뿐 아니라 주님 안에서 안식하는 당신을 깊이 사랑하십니다. 이 시간 모든 염려를 십자가 앞에 내려놓고 주님이 주시는 푸른 풀밭의 쉼을 누리시길 기도합니다.`;
  } else if (metrics.dominantMood === 'joy') {
    faceSpiritualDiagnosis = `오늘 ${displayName}의 얼굴에 깃든 밝고 환한 미소는 주변을 축복하는 주님의 거룩한 빛입니다! 구원의 기쁨과 감사가 넘치는 오늘, 주신 은혜를 기쁨으로 이웃에게 흘려보내는 복된 통로가 되실 것입니다.`;
  } else if (metrics.dominantMood === 'courage') {
    faceSpiritualDiagnosis = `오늘 ${displayName}의 눈빛에는 믿음으로 세상에 맞서 전진하려는 거룩한 담대함과 결단이 빛납니다. 여호수아와 함께하셨던 하나님께서 오늘도 앞서 행하시며 승리의 길을 예비하고 계십니다.`;
  } else if (metrics.dominantMood === 'wisdom') {
    faceSpiritualDiagnosis = `오늘 ${displayName}의 차분하고 진지한 표정 속에서 주님의 세미한 음성을 분별하고자 하는 겸손한 지혜가 느껴집니다. 내 명철을 의지하지 않고 범사에 주님을 인정할 때, 하나님께서 친히 당신의 앞길을 인도하실 것입니다.`;
  } else if (metrics.dominantMood === 'love') {
    faceSpiritualDiagnosis = `오늘 ${displayName}의 표정에 어린 온화함과 따스함은 예수님의 사랑의 향기를 가득 품고 있습니다. 작은 친절과 온유한 말 한마디로 지친 이웃의 마음을 보듬고 살리는 은혜의 하루가 되시길 축복합니다.`;
  } else {
    faceSpiritualDiagnosis = `오늘 ${displayName}의 모습에는 세상이 줄 수 없는 여호와 샬롬의 깊고 고요한 평강이 깃들어 있습니다. 모든 지각에 뛰어난 하나님의 평강이 오늘 하루도 당신의 생각과 마음을 안전하게 지키실 것입니다.`;
  }

  // 나이와 생애주기를 반영한 기도문 및 묵상 강화
  const personalizedPrayerBody = `${displayName}을(를) 사랑하시는 하나님 아버지, ${lifeStage.stageMessage} ${picked.prayerBody}`;

  return {
    user,
    lifeStage,
    todayDateText,
    todayTheme: picked.themeTitle,
    themeSubtitle: picked.themeSubtitle,
    spiritualScore,
    verse: picked.verse,
    meditation: {
      faceSpiritualDiagnosis,
      reflectionText: picked.reflectionGuide,
      questions: picked.reflectionQuestions,
    },
    action: {
      coreMission: picked.actionCore,
      items: picked.actionItems,
    },
    prayer: {
      title: picked.prayerTitle,
      body: personalizedPrayerBody,
      oneLineConfession: picked.prayerConfession,
    },
    christianDaily: {
      recommendedPraise: picked.praise,
      gratitudePrompt: `오늘 ${displayName}의 삶 속에 하나님이 선물해 주신 고마운 일 3가지를 마음에 떠올려보세요.`,
      spiritualHabit: picked.spiritualHabit,
      readingSuggestion: picked.readingSuggestion,
    },
    metrics,
    source: 'local-engine',
  };
}

// Gemini API 연동 (사용자가 설정에 키를 입력한 경우)
export async function generateGeminiBibleResult(
  user: UserProfile,
  metrics: FaceMetrics,
  apiKey: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<BibleResultData> {
  const localFallback = generateLocalBibleResult(user, metrics);

  if (!apiKey || !apiKey.trim()) {
    return localFallback;
  }

  const lifeStage = getLifeStageInfo(user.birthDate);
  const prompt = `당신은 은혜롭고 따뜻하며 신학적으로 바른 기독교 영성 멘토입니다.
아래 사용자의 기본 정보와 오늘 스캔된 얼굴 상태 분석 지표를 바탕으로, '오늘 성경 말씀 To You' 프로그램의 결과를 JSON 형식으로 생성해 주세요.

[사용자 정보]
- 성명: ${user.name || '성도'}
- 직분/호칭: ${user.title || '성도'}
- 만 나이: ${lifeStage.age}세 (생애주기: ${lifeStage.stage})
- 생애주기 특징: ${lifeStage.stageMessage}

[오늘의 얼굴 스캔 분석]
- 표정 상태: ${metrics.expression}
- 지배적 상태 테마: ${metrics.dominantMood}
- 미소/기쁨 지수: ${metrics.smileScore}/100
- 영적 활력도: ${metrics.vitalityScore}/100
- 평온/고요함 지수: ${metrics.calmScore}/100
- 피로도/안식 필요도: ${metrics.fatigueScore}/100
- 얼굴의 은혜로운 특징: ${metrics.faceHighlights.join(', ')}

반드시 다음 필드를 포함하는 순수 JSON(마크다운 코드블록 없이)으로 답변하세요:
{
  "todayTheme": "오늘의 영적 테마 제목",
  "themeSubtitle": "부제",
  "verseReference": "성경 구절 (예: 로마서 8장 28절)",
  "testament": "구약 또는 신약",
  "verseText": "개역개정 성경 본문 말씀 전문",
  "verseContext": "이 성경 구절의 배경과 은혜로운 의미 (2~3문장)",
  "keyword": "핵심 키워드 (예: 평안, 소망, 안식)",
  "faceDiagnosis": "사용자의 나이와 오늘 얼굴 상태(미소, 피로, 평온 등)를 영적으로 따뜻하게 해석한 위로와 격려의 메시지 (3~4문장)",
  "reflectionText": "오늘 깊이 묵상할 내용과 영적 통찰 (3~4문장)",
  "reflectionQuestions": ["묵상 질문 1", "묵상 질문 2", "묵상 질문 3"],
  "coreMission": "오늘 하루 꼭 실천할 핵심 과제",
  "actionItems": [
    {"title": "작은 실천 1", "description": "설명", "category": "word"},
    {"title": "작은 실천 2", "description": "설명", "category": "love"},
    {"title": "작은 실천 3", "description": "설명", "category": "prayer"}
  ],
  "prayerTitle": "1분 기도문 제목",
  "prayerBody": "사용자의 이름과 나이, 오늘의 상황을 담아 하나님께 올려드리는 은혜로운 1분 기도문 (마무리는 예수님의 이름으로 기도드립니다. 아멘.)",
  "prayerConfession": "오늘 하루 마음에 품을 한 줄 믿음의 고백",
  "praiseTitle": "추천 찬양/CCM 제목",
  "praiseArtist": "찬양사역자 또는 찬송가 장수",
  "praiseLyric": "은혜로운 가사 한 줄",
  "spiritualHabit": "오늘 챙길 작은 영적 습관 1가지",
  "readingSuggestion": "추천 성경 읽기 장"
}`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      console.warn('Gemini API request failed, fallback to local', res.status);
      return localFallback;
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return localFallback;

    const parsed = JSON.parse(rawText);

    return {
      user,
      lifeStage,
      todayDateText: getTodayDateText(),
      todayTheme: parsed.todayTheme || localFallback.todayTheme,
      themeSubtitle: parsed.themeSubtitle || localFallback.themeSubtitle,
      spiritualScore: localFallback.spiritualScore,
      verse: {
        reference: parsed.verseReference || localFallback.verse.reference,
        testament: (parsed.testament === '구약' ? '구약' : '신약') as '구약' | '신약',
        book: parsed.verseReference?.split(' ')[0] || localFallback.verse.book,
        chapter: localFallback.verse.chapter,
        verseRange: localFallback.verse.verseRange,
        text: parsed.verseText || localFallback.verse.text,
        context: parsed.verseContext || localFallback.verse.context,
        keyword: parsed.keyword || localFallback.verse.keyword,
      },
      meditation: {
        faceSpiritualDiagnosis: parsed.faceDiagnosis || localFallback.meditation.faceSpiritualDiagnosis,
        reflectionText: parsed.reflectionText || localFallback.meditation.reflectionText,
        questions: Array.isArray(parsed.reflectionQuestions)
          ? parsed.reflectionQuestions
          : localFallback.meditation.questions,
      },
      action: {
        coreMission: parsed.coreMission || localFallback.action.coreMission,
        items: Array.isArray(parsed.actionItems) && parsed.actionItems.length >= 3
          ? parsed.actionItems.map((item: any, idx: number) => ({
              id: `gemini-action-${idx}`,
              title: item.title,
              description: item.description,
              category: item.category || 'love',
            }))
          : localFallback.action.items,
      },
      prayer: {
        title: parsed.prayerTitle || localFallback.prayer.title,
        body: parsed.prayerBody || localFallback.prayer.body,
        oneLineConfession: parsed.prayerConfession || localFallback.prayer.oneLineConfession,
      },
      christianDaily: {
        recommendedPraise: {
          title: parsed.praiseTitle || localFallback.christianDaily.recommendedPraise.title,
          artist: parsed.praiseArtist || localFallback.christianDaily.recommendedPraise.artist,
          lyricSnippet: parsed.praiseLyric || localFallback.christianDaily.recommendedPraise.lyricSnippet,
          theme: parsed.keyword || localFallback.christianDaily.recommendedPraise.theme,
        },
        gratitudePrompt: localFallback.christianDaily.gratitudePrompt,
        spiritualHabit: parsed.spiritualHabit || localFallback.christianDaily.spiritualHabit,
        readingSuggestion: parsed.readingSuggestion || localFallback.christianDaily.readingSuggestion,
      },
      metrics,
      source: 'gemini-api',
    };
  } catch (err) {
    console.error('Failed to generate with Gemini, falling back to local', err);
    return localFallback;
  }
}

export async function generateBibleResult(
  user: UserProfile,
  metrics: FaceMetrics,
  settings: AppSettings
): Promise<BibleResultData> {
  if (settings.engine === 'gemini' && settings.geminiApiKey) {
    return generateGeminiBibleResult(user, metrics, settings.geminiApiKey, settings.geminiModel);
  }
  return generateLocalBibleResult(user, metrics);
}
