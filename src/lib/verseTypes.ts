import { BibleVerse, FaceMetrics } from '../types/bible';

export interface CatalogVerseEntry {
  id: string;
  mood: FaceMetrics['dominantMood'];
  ko: {
    themeTitle: string;
    themeSubtitle: string;
    verse: BibleVerse;
    reflectionCore: string;
    confession: string;
  };
  en: {
    themeTitle: string;
    themeSubtitle: string;
    verse: BibleVerse;
    reflectionCore: string;
    confession: string;
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
      themeSubtitle: `${s.koKeyword}이(가) 함께하는 오늘 하루`,
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
