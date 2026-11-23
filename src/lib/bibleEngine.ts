import {
  AppSettings,
  BibleResultData,
  FaceMetrics,
  Language,
  UserProfile,
} from '../types/bible';
import { getLifeStageInfo, VERSE_DATABASE, VerseThemeData } from './bibleVerses';
import { VERSE_DATABASE_EN } from './bibleVersesEn';
import { getBonusGraceData } from './bonusGrace';
import { TITLE_LABELS } from './i18n';

// 간단한 문자열 해시 함수 (일관된 시드 도출용)
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 오늘 날짜 포맷 (한글 / 영어)
export function getTodayDateText(lang: Language = 'ko'): string {
  const now = new Date();
  if (lang === 'en') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }
  const days = ['주일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayName = days[now.getDay()];
  return `${year}년 ${month}월 ${date}일 (${dayName})`;
}

// 사용자 호칭 포맷
function formatDisplayName(user: UserProfile, lang: Language): string {
  const rawName = user.name?.trim() || '';
  const titleKey = user.title || '성도';
  if (lang === 'en') {
    const enTitle = TITLE_LABELS.en[titleKey] || 'Believer';
    if (!rawName) return enTitle;
    if (titleKey === '목회자' || titleKey === '장로' || titleKey === '집사' || titleKey === '권사' || titleKey === '형제' || titleKey === '자매') {
      return `${enTitle} ${rawName}`;
    }
    return rawName;
  }
  const koTitle = `${TITLE_LABELS.ko[titleKey] || '성도'}님`;
  return rawName ? `${rawName} ${koTitle}` : koTitle;
}

// 로컬 지능형 엔진으로 맞춤 말씀 생성 (한글 / 영어 & 스캔 / 스캔없이 진행 모두 지원)
export function generateLocalBibleResult(
  user: UserProfile,
  metrics: FaceMetrics,
  lang: Language = 'ko'
): BibleResultData {
  const lifeStage = getLifeStageInfo(user.birthDate, lang);
  const todayDateText = getTodayDateText(lang);

  const db = lang === 'en' ? VERSE_DATABASE_EN : VERSE_DATABASE;
  const mood = metrics.dominantMood || 'peace';
  const themeList: VerseThemeData[] = db[mood] || db.peace;

  // 이름, 생년월일, 오늘 날짜로 시드 생성
  const todayYMD = new Date().toISOString().slice(0, 10);
  const seedStr = `${user.name || 'user'}_${user.birthDate || '2000-01-01'}_${todayYMD}_${mood}`;
  const seed = stringHash(seedStr);
  const picked = themeList[seed % themeList.length];

  // 은혜 지수 (0~100) 계산
  const baseSpiritual = Math.round(
    metrics.smileScore * 0.35 +
      metrics.calmScore * 0.35 +
      metrics.vitalityScore * 0.2 +
      metrics.symmetryScore * 0.1
  );
  const spiritualScore = Math.max(
    78,
    Math.min(99, baseSpiritual + (metrics.fatigueScore > 60 ? 12 : 5))
  );

  const displayName = formatDisplayName(user, lang);

  // 영적 진단 메시지 조립 (스캔없이 진행 vs 얼굴 스캔 분기 + 언어 분기)
  let faceSpiritualDiagnosis = '';

  if (metrics.isSkippedScan) {
    if (lang === 'en') {
      faceSpiritualDiagnosis = `Reflecting on ${displayName}'s season of life (${lifeStage.stage}, age ${lifeStage.age}) and today's date, God has prepared a timely word of grace for you. ${lifeStage.stageMessage}`;
    } else {
      faceSpiritualDiagnosis = `${displayName}의 소중한 생애주기(${lifeStage.stage}, 만 ${lifeStage.age}세)와 오늘의 발걸음을 묵상하며 주님이 예비하신 은혜의 말씀을 찾았습니다. ${lifeStage.stageMessage}`;
    }
  } else if (lang === 'en') {
    if (metrics.dominantMood === 'rest') {
      faceSpiritualDiagnosis = `Today, ${displayName}'s expression reflects honest effort and quiet weariness. God loves not only your faithful work, but also your soul at rest. Lay your burdens before the cross and receive His gentle renewal.`;
    } else if (metrics.dominantMood === 'joy') {
      faceSpiritualDiagnosis = `${displayName}'s bright and warm smile today shines as a living testimony of grace. May the joy of salvation overflow from your heart and bless everyone you encounter today.`;
    } else if (metrics.dominantMood === 'courage') {
      faceSpiritualDiagnosis = `There is quiet resolve and vitality in ${displayName}'s eyes today. Just as the Lord walked ahead of Joshua, He goes before you to open a way of faith and victory.`;
    } else if (metrics.dominantMood === 'wisdom') {
      faceSpiritualDiagnosis = `${displayName}'s calm and earnest expression reveals a humble heart seeking God’s guidance. As you acknowledge Him in every decision today, He will make your path straight.`;
    } else if (metrics.dominantMood === 'love') {
      faceSpiritualDiagnosis = `${displayName}'s gentle and warm countenance carries the fragrance of Christ’s love. May your kind words and thoughtful care bring comfort to those around you today.`;
    } else {
      faceSpiritualDiagnosis = `${displayName}'s serene expression reflects the deep shalom that only God can give. May His peace guard your heart and mind throughout this day.`;
    }
  } else {
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
  }

  const personalizedPrayerBody =
    lang === 'en'
      ? `Loving Father who cherishes ${displayName}, ${picked.prayerBody}`
      : `${displayName}을(를) 사랑하시는 하나님 아버지, ${lifeStage.stageMessage} ${picked.prayerBody}`;

  const gratitudePrompt =
    lang === 'en'
      ? `Think of 3 blessings God has gifted to ${displayName} today.`
      : `오늘 ${displayName}의 삶 속에 하나님이 선물해 주신 고마운 일 3가지를 마음에 떠올려보세요.`;

  return {
    lang,
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
      gratitudePrompt,
      spiritualHabit: picked.spiritualHabit,
      readingSuggestion: picked.readingSuggestion,
    },
    bonus: getBonusGraceData(mood, lang),
    metrics,
    source: 'local-engine',
  };
}

// Gemini API 연동 (한글 / 영어 지원)
export async function generateGeminiBibleResult(
  user: UserProfile,
  metrics: FaceMetrics,
  apiKey: string,
  modelName: string = 'gemini-2.5-flash',
  lang: Language = 'ko'
): Promise<BibleResultData> {
  const localFallback = generateLocalBibleResult(user, metrics, lang);

  if (!apiKey || !apiKey.trim()) {
    return localFallback;
  }

  const lifeStage = getLifeStageInfo(user.birthDate, lang);
  const langInstruction =
    lang === 'en'
      ? 'Respond entirely in natural, warm, reverent English (use public domain WEB/KJV scripture style).'
      : '모든 내용을 은혜롭고 따뜻한 한국어(개역개정 성경 스타일)로 작성해 주세요.';

  const scanInfo = metrics.isSkippedScan
    ? 'Face scan was skipped. Base the reflection purely on user profile, life stage, and today.'
    : `Expression: ${metrics.expression}, Mood: ${metrics.dominantMood}, Smile: ${metrics.smileScore}/100, Vitality: ${metrics.vitalityScore}/100, Calm: ${metrics.calmScore}/100, Fatigue: ${metrics.fatigueScore}/100`;

  const prompt = `You are a warm, biblically sound Christian devotional mentor for the app "DayBible2U" (데이바이블2U).
${langInstruction}

[User Profile]
- Name: ${user.name || 'Believer'}
- Role: ${user.title || '성도'}
- Age: ${lifeStage.age} (${lifeStage.stage})

[Context]
- ${scanInfo}

Return pure JSON (no markdown fences) with these exact fields:
{
  "todayTheme": "Theme title",
  "themeSubtitle": "Subtitle",
  "verseReference": "Book Chapter:Verse",
  "testament": "${lang === 'en' ? 'OT or NT' : '구약 또는 신약'}",
  "verseText": "Scripture text",
  "verseContext": "Brief graceful context (2 sentences)",
  "keyword": "Key theme word",
  "faceDiagnosis": "Warm spiritual encouragement (2-3 sentences)",
  "reflectionText": "Meditation guide (3 sentences)",
  "reflectionQuestions": ["Question 1", "Question 2", "Question 3"],
  "coreMission": "One core action for today",
  "actionItems": [
    {"title": "Action 1", "description": "Detail", "category": "word"},
    {"title": "Action 2", "description": "Detail", "category": "love"},
    {"title": "Action 3", "description": "Detail", "category": "prayer"}
  ],
  "prayerTitle": "1-Minute Prayer title",
  "prayerBody": "Heartfelt 1-minute prayer ending in Jesus' name, Amen.",
  "prayerConfession": "One-line faith confession",
  "praiseTitle": "Recommended hymn/praise title",
  "praiseArtist": "Artist or Traditional Hymn",
  "praiseLyric": "One short inspiring line",
  "spiritualHabit": "One small spiritual habit for today",
  "readingSuggestion": "Recommended Bible chapter"
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
      return localFallback;
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return localFallback;

    const parsed = JSON.parse(rawText);

    return {
      lang,
      user,
      lifeStage,
      todayDateText: getTodayDateText(lang),
      todayTheme: parsed.todayTheme || localFallback.todayTheme,
      themeSubtitle: parsed.themeSubtitle || localFallback.themeSubtitle,
      spiritualScore: localFallback.spiritualScore,
      verse: {
        reference: parsed.verseReference || localFallback.verse.reference,
        testament: parsed.testament || localFallback.verse.testament,
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
        items:
          Array.isArray(parsed.actionItems) && parsed.actionItems.length >= 3
            ? parsed.actionItems.map((item: { title: string; description: string; category?: string }, idx: number) => ({
                id: `gemini-action-${idx}`,
                title: item.title,
                description: item.description,
                category: (item.category as 'word' | 'love' | 'prayer' | 'thanks') || 'love',
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
      bonus: localFallback.bonus,
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
  settings: AppSettings,
  lang: Language = 'ko'
): Promise<BibleResultData> {
  if (settings.engine === 'gemini' && settings.geminiApiKey) {
    return generateGeminiBibleResult(
      user,
      metrics,
      settings.geminiApiKey,
      settings.geminiModel,
      lang
    );
  }
  return generateLocalBibleResult(user, metrics, lang);
}
