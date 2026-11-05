/**
 * Web Audio API Synthesizer Engine
 * Provides romantic music box / acoustic melody background music
 * and tactile romantic sound effects without relying solely on external audio files.
 */

class RomanticSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic = false;
  private musicInterval: any = null;
  private currentTrack: "main" | "ending" = "main";
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noteIndex = 0;

  // Track 1: Warm, soft acoustic arpeggio (Cmaj7 -> Am9 -> Fmaj7 -> Gsus4)
  private readonly trackMainChords = [
    [261.63, 329.63, 392.0, 493.88], // C, E, G, B
    [220.0, 261.63, 329.63, 392.0],  // A, C, E, G
    [174.61, 261.63, 329.63, 392.0], // F, C, E, G
    [196.0, 261.63, 293.66, 392.0],  // G, C, D, G
  ];

  // Track 2: Ending Celebration Waltz (Fmaj7 -> Em7 -> Dm9 -> Cmaj7)
  private readonly trackEndingChords = [
    [349.23, 440.0, 523.25, 659.25], // F, A, C, E
    [329.63, 392.0, 493.88, 587.33], // E, G, B, D
    [293.66, 349.23, 440.0, 523.25], // D, F, A, C
    [261.63, 329.63, 392.0, 523.25], // C, E, G, C
  ];

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public getIsPlaying() {
    return this.isPlayingMusic;
  }

  public getCurrentTrack() {
    return this.currentTrack;
  }

  public playTone(freq: number, duration = 1.2, type: OscillatorType = "sine", gainAmount = 0.15) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainAmount, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain || this.masterGain);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  public startBackgroundMusic(track: "main" | "ending" = "main") {
    this.currentTrack = track;
    this.getContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    this.noteIndex = 0;
    const chords = this.currentTrack === "main" ? this.trackMainChords : this.trackEndingChords;

    // Arpeggiate through chords gently every ~480ms
    this.musicInterval = setInterval(() => {
      if (!this.isPlayingMusic) return;
      const currentChords = this.currentTrack === "main" ? this.trackMainChords : this.trackEndingChords;
      const chordIndex = Math.floor(this.noteIndex / 4) % currentChords.length;
      const noteInChordIndex = this.noteIndex % 4;
      const chord = currentChords[chordIndex];
      const freq = chord[noteInChordIndex];

      // Play soft music box bell tone
      this.playTone(freq, 1.4, "sine", 0.08);

      // Play an extra gentle harmonic octave on first note of measure
      if (noteInChordIndex === 0) {
        this.playTone(freq * 0.5, 2.0, "triangle", 0.05); // bass note
      }

      this.noteIndex++;
    }, 480);
  }

  public switchTrack(track: "main" | "ending") {
    this.currentTrack = track;
    this.noteIndex = 0;
    if (!this.isPlayingMusic) {
      this.startBackgroundMusic(track);
    }
  }

  public stopBackgroundMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // --- Tactile Sound Effects ---

  public playClickSound() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain || this.isMuted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  public playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.9, "sine", 0.12);
      }, i * 90);
    });
  }

  public playErrorSound() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain || this.isMuted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {}
  }

  public playSparkleSound() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain || this.isMuted) return;
    const freqs = [880, 1174.66, 1396.91, 1760];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 0.5, "sine", 0.08);
      }, i * 60);
    });
  }

  public playCandleBlowSound() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain || this.isMuted) return;
    try {
      // White noise buffer for gentle breath/wind
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.7);
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      noise.stop(ctx.currentTime + 0.8);
    } catch {}
  }
}

export const soundEngine = new RomanticSoundEngine();
