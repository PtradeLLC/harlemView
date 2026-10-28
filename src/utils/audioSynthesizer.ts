/**
 * Web Audio API Ambient & SFX Synthesizer
 * Provides synthesized environmental soundscapes for Harlem World Model:
 * - Harlem jazz brass chords
 * - Pneumatic vacuum sub-street suction whoosh
 * - Rover polite pedestrian chime
 * - Palm tree micro-cooling mist hiss
 * - Street View camera step click
 * - Continuous sub-tropical river breeze & rustling fronds
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNoiseNode: AudioBufferSourceNode | null = null;
  private isMuted: boolean = false;
  private isAmbientRunning: boolean = false;
  private masterVolume: number = 0.55;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : this.masterVolume * 0.12, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.masterVolume * 0.12, this.ctx.currentTime);
    }
  }

  /**
   * Street View step navigation click
   */
  public playStepClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(this.masterVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Polite pedestrian warning chime emitted by autonomous sweepers
   */
  public playRoverChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [659.25, 880.0]; // E5, A5 soft marimba/bell
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.46);
    });
  }

  /**
   * Pneumatic compaction and sub-street vacuum conduit whoosh
   */
  public playPneumaticWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(120, now + 1.1);
    filter.Q.value = 3.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(this.masterVolume * 0.45, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.2);
  }

  /**
   * Sunlit tree trunk mist nozzle cooling spray
   */
  public playMistHiss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.5);
  }

  /**
   * Warm Harlem Jazz Brass chord swell (Apollo corridor acoustic ambiance)
   */
  public playJazzChord() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const chordFrequencies = [261.63, 329.63, 392.0, 493.88, 587.33]; // Cmaj9 swell
    const now = this.ctx.currentTime;

    chordFrequencies.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.005), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(350, now + 2.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime((this.masterVolume * 0.08) / (i + 1), now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.1);
    });
  }

  /**
   * Starts ambient background rustle of Canary date palms and gentle river breeze
   */
  public startAmbientEngine() {
    if (this.isAmbientRunning) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise filter algorithm for natural wind / leaf rustle
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      this.ambientNoiseNode = this.ctx.createBufferSource();
      this.ambientNoiseNode.buffer = buffer;
      this.ambientNoiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume * 0.14, this.ctx.currentTime);

      this.ambientNoiseNode.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientNoiseNode.start();
      this.isAmbientRunning = true;
    } catch {
      // Audio autoplay might wait for user interaction
    }
  }

  public stopAmbientEngine() {
    if (this.ambientNoiseNode) {
      try {
        this.ambientNoiseNode.stop();
        this.ambientNoiseNode.disconnect();
      } catch {
        // Safe ignore
      }
      this.ambientNoiseNode = null;
      this.isAmbientRunning = false;
    }
  }
}

export const soundEngine = new AudioSynthesizer();
