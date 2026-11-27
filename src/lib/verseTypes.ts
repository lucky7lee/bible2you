import { BibleVerse, FaceMetrics } from '../types/bible';
import { josa } from './koreanJosa';

export interface LocalizedVerseContent {
  themeTitle: string;
  themeSubtitle: string;
  verse: BibleVerse;
  reflectionCore: string;
  confession: string;
}

export interface CatalogVerseEntry {
  id: string;
  mood: FaceMetrics['dominantMood'];
  ko: LocalizedVerseContent;
  en: LocalizedVerseContent;
  es?: LocalizedVerseContent;
}

export interface SpanishVerseSeed {
  testament: 'AT' | 'NT';
  ref: string;
  text: string;
  theme: string;
  context: string;
  reflect: string;
  keyword: string;
  confess: string;
}

export function expandSpanishVerse(s: SpanishVerseSeed): LocalizedVerseContent {
  const book = s.ref.split(' ')[0] || s.ref;
  return {
    themeTitle: s.theme,
    themeSubtitle: `Un día guiado por ${s.keyword.toLowerCase()}`,
    verse: {
      reference: s.ref,
      testament: s.testament,
      book,
      chapter: 1,
      verseRange: '1',
      text: s.text,
      context: s.context,
      keyword: s.keyword,
    },
    reflectionCore: s.reflect,
    confession: s.confess,
  };
}

// 180개 구절을 효율적이고 일관되게 관리하기 위한 Compact 튜플 타입
export interface CompactVerseSeed {
  id: string;
  mood: FaceMetrics['dominantMood'];
  testament: 'OT' | 'NT';
  koRef: string;
  koText: string;
  koTheme: string;
  koContext: string;
  koReflect: string;
  koKeyword: string;
  koConfess: string;
  enRef: string;
  enText: string;
  enTheme: string;
  enContext: string;
  enReflect: string;
  enKeyword: string;
  enConfess: string;
}

export function expandCompactVerse(s: CompactVerseSeed): CatalogVerseEntry {
  const koBook = s.koRef.split(' ')[0] || s.koRef;
  const enBook = s.enRef.split(' ')[0] || s.enRef;
  return {
    id: s.id,
    mood: s.mood,
    ko: {
      themeTitle: s.koTheme,
      themeSubtitle: `${josa(s.koKeyword, '이가')} 함께하는 오늘 하루`,
      verse: {
        reference: s.koRef,
        testament: s.testament === 'OT' ? '구약' : '신약',
        book: koBook,
        chapter: 1,
        verseRange: '1',
        text: s.koText,
        context: s.koContext,
        keyword: s.koKeyword,
      },
      reflectionCore: s.koReflect,
      confession: s.koConfess,
    },
    en: {
      themeTitle: s.enTheme,
      themeSubtitle: `A day guided by ${s.enKeyword.toLowerCase()}`,
      verse: {
        reference: s.enRef,
        testament: s.testament,
        book: enBook,
        chapter: 1,
        verseRange: '1',
        text: s.enText,
        context: s.enContext,
        keyword: s.enKeyword,
      },
      reflectionCore: s.enReflect,
      confession: s.enConfess,
    },
  };
}
