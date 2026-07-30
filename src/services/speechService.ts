class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;
  private rate: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (voices.length > 0 && !this.selectedVoice) {
      // Find default natural English voice if possible
      this.selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                          voices.find(v => v.lang.startsWith('en')) ||
                          voices[0];
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public setVoice(voiceName: string) {
    const voices = this.getVoices();
    const found = voices.find(v => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.synth || !text) return;

    this.synth.cancel(); // cancel any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
