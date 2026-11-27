// 한국어 받침(종성) 여부에 따라 자연스러운 조사를 자동 선택하는 유틸리티
export function hasKoreanBatchim(text: string): boolean {
  const trimmed = text.trim().replace(/[)"'”’\]}]+$/, '');
  if (!trimmed) return false;
  const lastCode = trimmed.charCodeAt(trimmed.length - 1);
  // 한글 완성형 음절 범위 (가 ~ 힣)
  if (lastCode >= 0xac00 && lastCode <= 0xd7a3) {
    return (lastCode - 0xac00) % 28 !== 0;
  }
  // 숫자 끝자리 발음 기준 (0,1,3,6,7,8 -> 받침 있음 / 2,4,5,9 -> 받침 없음)
  const lastChar = trimmed[trimmed.length - 1];
  if (/[013678]/.test(lastChar)) return true;
  if (/[2459]/.test(lastChar)) return false;
  // 영문 자음/모음 대략 처리
  if (/[lmnrLMNR]/.test(lastChar)) return true;
  return false;
}

export function josa(
  text: string,
  pair: '이가' | '을를' | '은는' | '과와' | '으로로'
): string {
  const batchim = hasKoreanBatchim(text);
  switch (pair) {
    case '이가':
      return `${text}${batchim ? '이' : '가'}`;
    case '을를':
      return `${text}${batchim ? '을' : '를'}`;
    case '은는':
      return `${text}${batchim ? '은' : '는'}`;
    case '과와':
      return `${text}${batchim ? '과' : '와'}`;
    case '으로로': {
      // ㄹ 받침 예외 처리
      const trimmed = text.trim();
      const code = trimmed.charCodeAt(trimmed.length - 1);
      const isRieul = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 8;
      return `${text}${batchim && !isRieul ? '으로' : '로'}`;
    }
  }
}
