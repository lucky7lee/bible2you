import { BibleResultData, FaceMetrics, UserProfile } from '../types/bible';

const TODAY_RECORD_KEY = 'daybible2u_today_record_v1';

export interface TodaySavedRecord {
  dateKey: string; // 현지 시간 기준 YYYY-MM-DD
  user: UserProfile;
  metrics: FaceMetrics;
  resultData: BibleResultData;
  checkedActions: Record<string, boolean>;
  hasAmenClicked: boolean;
  hasUnlockedBonus: boolean;
}

// 기기 현지 시간 기준 YYYY-MM-DD 반환
export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 오늘(현지 시간) 저장된 기록 불러오기 — 날짜가 다르면 null 반환 및 정리
export function loadTodayRecord(): TodaySavedRecord | null {
  try {
    const raw = localStorage.getItem(TODAY_RECORD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TodaySavedRecord;
    const todayKey = getLocalDateKey();
    if (!parsed || parsed.dateKey !== todayKey || !parsed.resultData || !parsed.metrics) {
      localStorage.removeItem(TODAY_RECORD_KEY);
      return null;
    }
    return {
      ...parsed,
      checkedActions: parsed.checkedActions || {},
      hasAmenClicked: !!parsed.hasAmenClicked,
      hasUnlockedBonus: !!parsed.hasUnlockedBonus,
    };
  } catch {
    return null;
  }
}

// 오늘의 새 결과 저장 (재스캔/재실행 시 덮어쓰기)
export function saveTodayRecord(
  user: UserProfile,
  metrics: FaceMetrics,
  resultData: BibleResultData,
  checkedActions: Record<string, boolean> = {},
  hasAmenClicked: boolean = false,
  hasUnlockedBonus: boolean = false
): TodaySavedRecord {
  const record: TodaySavedRecord = {
    dateKey: getLocalDateKey(),
    user,
    metrics,
    resultData,
    checkedActions,
    hasAmenClicked,
    hasUnlockedBonus,
  };
  try {
    localStorage.setItem(TODAY_RECORD_KEY, JSON.stringify(record));
  } catch {
    // 용량 초과(스냅샷 이미지가 클 때) 시 스냅샷 제외하고 저장 폴백
    try {
      const liteMetrics: FaceMetrics = { ...metrics, snapshotDataUrl: undefined };
      const liteResult: BibleResultData = { ...resultData, metrics: liteMetrics };
      const liteRecord: TodaySavedRecord = {
        ...record,
        metrics: liteMetrics,
        resultData: liteResult,
      };
      localStorage.setItem(TODAY_RECORD_KEY, JSON.stringify(liteRecord));
      return liteRecord;
    } catch {
      // ignore
    }
  }
  return record;
}

// 오늘 기록의 체크 상태 / 아멘 상태 / 보상형 보너스 잠금 해제 상태 부분 업데이트
export function updateTodayProgress(
  checkedActions: Record<string, boolean>,
  hasAmenClicked: boolean,
  hasUnlockedBonus: boolean
): void {
  const current = loadTodayRecord();
  if (!current) return;
  saveTodayRecord(
    current.user,
    current.metrics,
    current.resultData,
    checkedActions,
    hasAmenClicked,
    hasUnlockedBonus
  );
}
