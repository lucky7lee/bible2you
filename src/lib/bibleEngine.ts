import {
  AppSettings,
  BibleResultData,
  FaceMetrics,
  Language,
  UserProfile,
} from '../types/bible';
import { getLifeStageInfo } from './bibleVerses';
import { getBonusGraceData } from './bonusGrace';
import { GENDER_LABELS, TITLE_LABELS } from './i18n';
import {
  buildPersonalizedDiagnosis,
  buildPersonalizedPrayer,
  getTodayLocalKey,
  hashString,
  pickDailyActions,
  pickDailyExtras,
  pickDailyQuestions,
  pickDailyVerse,
} from './personalizer';

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
    if (
      titleKey === '목회자' ||
      titleKey === '장로' ||
      titleKey === '집사' ||
      titleKey === '안수집사' ||
      titleKey === '권사' ||
      titleKey === '형제' ||
      titleKey === '자매'
    ) {
      return `${enTitle} ${rawName}`;
    }
    return rawName;
  }
  const koTitle = `${TITLE_LABELS.ko[titleKey] || '성도'}님`;
  return rawName ? `${rawName} ${koTitle}` : koTitle;
}

// 로컬 다층 조합 엔진으로 매일 새롭고 다채로운 맞춤 말씀 생성
export function generateLocalBibleResult(
  user: UserProfile,
  metrics: FaceMetrics,
  lang: Language = 'ko'
): BibleResultData {
  const lifeStage = getLifeStageInfo(user.birthDate, lang);
  const todayDateText = getTodayDateText(lang);
  const todayKey = getTodayLocalKey();
  const mood = metrics.dominantMood || 'peace';

  // 이름 + 성별 + 직분 + 생년월일 + 오늘 날짜(현지) + 얼굴 특징 시드 조합
  const featureSig = metrics.faceFeatures
    ? `${metrics.faceFeatures.faceShapeKey}_${metrics.faceFeatures.eyeShapeKey}_${metrics.faceFeatures.eyebrowShapeKey}_${metrics.faceFeatures.noseShapeKey}_${metrics.faceFeatures.mouthShapeKey}_${metrics.faceFeatures.balanceKey}`
    : 'noscan';

  const seedStr = `${user.name || 'user'}_${user.gender || 'male'}_${user.title || '성도'}_${
    user.birthDate || '2000-01-01'
  }_${todayKey}_${mood}_${featureSig}`;
  const seed = hashString(seedStr);

  // 1. 최근 14일 중복을 피해서 36개 성경 말씀 중 오늘의 구절 선택
  const pickedEntry = pickDailyVerse(mood, seed, todayKey);
  const localized = pickedEntry[lang];

  // 은혜 지수 (0~100)
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

  // 2. 얼굴 이목구비 + 표정 + 성별 + 직분 + 생애주기 맞춤 진단
  const faceSpiritualDiagnosis = buildPersonalizedDiagnosis(
    displayName,
    user,
    lifeStage,
    metrics,
    seed,
    lang
  );

  // 3. 매일 달라지는 묵상 질문 3가지
  const questions = pickDailyQuestions(mood, seed + 7, lang);

  // 4. 매일 달라지는 핵심 미션 & 실천 체크리스트 3가지
  const action = pickDailyActions(mood, seed + 13, lang);

  // 5. 조합형 현대어 1분 기도문
  const prayerObj = buildPersonalizedPrayer(
    displayName,
    user,
    lifeStage,
    mood,
    localized.verse.keyword,
    seed + 29,
    lang
  );

  // 6. 추천 찬양, 작은 영적 습관, 추천 성경 본문
  const extras = pickDailyExtras(seed + 41, lang);

  const gratitudePrompt =
    lang === 'en'
      ? `Think of 3 blessings God has gifted to ${displayName} today.`
      : `오늘 ${displayName}의 일상 속에 하나님이 주신 고마운 일 3가지를 떠올려 보세요.`;

  return {
    lang,
    user,
    lifeStage,
    todayDateText,
    todayTheme: localized.themeTitle,
    themeSubtitle: localized.themeSubtitle,
    spiritualScore,
    verse: localized.verse,
    meditation: {
      faceSpiritualDiagnosis,
      reflectionText: localized.reflectionCore,
      questions,
    },
    action,
    prayer: {
      title: prayerObj.title,
      body: prayerObj.body,
      oneLineConfession: localized.confession,
    },
    christianDaily: {
      recommendedPraise: extras.praise,
      gratitudePrompt,
      spiritualHabit: extras.habit,
      readingSuggestion: extras.reading,
    },
    bonus: getBonusGraceData(mood, lang, seed + 53),
    metrics,
    source: 'local-engine',
  };
}

// Gemini API 연동 (한글 / 영어, 성별/직분/이목구비 반영, 쉬운 현대어 지침)
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
  const genderLabel = GENDER_LABELS[lang][user.gender || 'male'];
  const titleLabel = TITLE_LABELS[lang][user.title || '성도'];

  const langInstruction =
    lang === 'en'
      ? 'Respond entirely in warm, everyday, easy-to-read English (use public domain WEB/KJV scripture style).'
      : '모든 풀이·묵상·실천·기도문은 "세미한", "소성케", "앙망" 같은 일상에서 잘 안 쓰는 딱딱한 표현을 피하고, 실제 사람들이 매일 쓰는 쉽고 따뜻하고 자연스러운 현대 한국어로 작성해 주세요.';

  const scanInfo = metrics.isSkippedScan
    ? 'Face scan was skipped. Base the reflection purely on name, gender, role, age/life stage, and today.'
    : `Expression: ${metrics.expression}, Mood: ${metrics.dominantMood}, Smile: ${metrics.smileScore}/100, Vitality: ${metrics.vitalityScore}/100, Calm: ${metrics.calmScore}/100, Fatigue: ${metrics.fatigueScore}/100, Features: ${JSON.stringify(metrics.faceFeatures || {})}`;

  const prompt = `You are a warm, practical Christian devotional mentor for the app "DayBible2U" (데이바이블2U).
${langInstruction}

[User Profile]
- Name: ${user.name || 'Believer'}
- Gender: ${genderLabel}
- Role: ${titleLabel}
- Age: ${lifeStage.age} (${lifeStage.stage})
- Today: ${getTodayDateText(lang)}

[Context]
- ${scanInfo}

Return pure JSON (no markdown fences) with these exact fields:
{
  "todayTheme": "Theme title",
  "themeSubtitle": "Subtitle",
  "verseReference": "Book Chapter:Verse",
  "testament": "${lang === 'en' ? 'OT or NT' : '구약 또는 신약'}",
  "verseText": "Scripture text",
  "verseContext": "Brief easy-to-understand context (2 sentences)",
  "keyword": "Key theme word",
  "faceDiagnosis": "Warm, personalized encouragement reflecting gender, role, age, and face/state (2-3 sentences)",
  "reflectionText": "Practical everyday meditation guide (3 sentences)",
  "reflectionQuestions": ["Question 1", "Question 2", "Question 3"],
  "coreMission": "One core action for today",
  "actionItems": [
    {"title": "Action 1", "description": "Detail", "category": "word"},
    {"title": "Action 2", "description": "Detail", "category": "love"},
    {"title": "Action 3", "description": "Detail", "category": "prayer"}
  ],
  "prayerTitle": "1-Minute Prayer title",
  "prayerBody": "Heartfelt everyday 1-minute prayer ending in Jesus' name, Amen.",
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
          temperature: 0.8,
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
