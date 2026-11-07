/**
 * Subtle musical feedback using Web Audio API (Pentatonic scale chime)
 */
class SoundFeedback {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playNote(freq: number = 523.25, type: OscillatorType = 'sine', duration: number = 0.15) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playClick() {
    // Elegant soft marimba / xylophone tap (G5: 783.99Hz)
    this.playNote(783.99, 'sine', 0.1);
  }

  public playOpen() {
    // Upward chord chime
    this.playNote(523.25, 'sine', 0.12);
    setTimeout(() => this.playNote(659.25, 'sine', 0.15), 60);
  }

  public playSuccess() {
    this.playNote(587.33, 'triangle', 0.1);
    setTimeout(() => this.playNote(880.0, 'sine', 0.2), 80);
  }
}

export const soundFx = new SoundFeedback();
