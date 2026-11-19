// Web Speech API 기반 성경 말씀 및 기도문 낭독 (TTS) 유틸리티
export class BibleTTS {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;

  public static isSupported(): boolean {
    return !!this.synth;
  }

  public static speak(text: string, onEnd?: () => void, onError?: () => void): boolean {
    if (!this.synth) return false;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88; // 약간 차분하고 은혜로운 낭독 템포
    utterance.pitch = 1.0;

    // 한국어 음성 탐색 (부드러운 음성 우선)
    const voices = this.synth.getVoices();
    const koVoice =
      voices.find((v) => v.lang.startsWith('ko') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Yuna'))) ||
      voices.find((v) => v.lang.startsWith('ko'));

    if (koVoice) {
      utterance.voice = koVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onError) onError();
    };

    this.synth.speak(utterance);
    return true;
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }
}
