// Web Audio API Sound Synthesizer for Authentic Diwali Crackers
// Synthesizes realistic firework & cracker sounds in real-time without external audio files.

class FireworkAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Generate buffer of white noise
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Phooljhadi (Sparkler) - Gentle sizzle and twinkling crackles
  public playSparkler() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 2.5;

    // Sizzle Noise
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);
    if (!noise.buffer) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // Random micro-pops
    for (let i = 0; i < 20; i++) {
      const popTime = now + Math.random() * (duration - 0.2);
      this.playMicroCrack(popTime, 2500 + Math.random() * 2000);
    }
  }

  // 2. Anar (Flower Pot) - Ascending roaring fountain with crackles
  public playAnar() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 3.5;

    // Roaring low-mid rush
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);
    if (!noise.buffer) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.7);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.8);
    gain.gain.setValueAtTime(0.35, now + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // Continuous sparkles crackling
    for (let i = 0; i < 35; i++) {
      const crackTime = now + 0.4 + (i / 35) * (duration - 0.6) + (Math.random() - 0.5) * 0.08;
      this.playMicroCrack(crackTime, 3000 + Math.random() * 2500);
    }
  }

  // 3. Chakri (Ground Spinner) - High-pitched whizzing spinning sound
  public playChakri() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 3.0;

    // Whizzing oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(650, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(320, now + duration);

    // Doppler LFO modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(12, now);
    lfo.frequency.linearRampToValueAtTime(18, now + 1.2);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, now);
    lfo.connect(osc.frequency);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.linearRampToValueAtTime(0.2, now + 0.4);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration);
    osc.stop(now + duration);

    // Friction sizzle
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);
    if (noise.buffer) {
      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'highpass';
      nFilter.frequency.setValueAtTime(2000, now);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.01, now);
      nGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    }
  }

  // 4. Sky Shot (Rocket) - Whistling ascent + dramatic loud aerial boom!
  public playRocket(onBlastCallback?: () => void) {
    if (this.isMuted) {
      if (onBlastCallback) setTimeout(onBlastCallback, 900);
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const ascentTime = 0.85;

    // Ascent Whistle
    const whistle = this.ctx.createOscillator();
    whistle.type = 'triangle';
    whistle.frequency.setValueAtTime(500, now);
    whistle.frequency.exponentialRampToValueAtTime(2200, now + ascentTime);

    const wGain = this.ctx.createGain();
    wGain.gain.setValueAtTime(0.02, now);
    wGain.gain.linearRampToValueAtTime(0.25, now + ascentTime * 0.8);
    wGain.gain.exponentialRampToValueAtTime(0.001, now + ascentTime);

    whistle.connect(wGain);
    wGain.connect(this.ctx.destination);

    whistle.start(now);
    whistle.stop(now + ascentTime);

    // Trigger Aerial Blast after ascent
    setTimeout(() => {
      this.playDeepBlast(0.65, 1.2);
      if (onBlastCallback) onBlastCallback();
    }, ascentTime * 1000);
  }

  // 5. Sutli Bomb / Atom Bomb - Powerful deafening sub-bass explosion
  public playBomb() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Fuse burn sizzle (0.4s)
    const fuse = this.ctx.createBufferSource();
    fuse.buffer = this.createNoiseBuffer(0.4);
    if (fuse.buffer) {
      const fFilter = this.ctx.createBiquadFilter();
      fFilter.type = 'bandpass';
      fFilter.frequency.setValueAtTime(4500, now);
      const fGain = this.ctx.createGain();
      fGain.gain.setValueAtTime(0.15, now);
      fGain.gain.linearRampToValueAtTime(0.2, now + 0.35);
      fGain.gain.setValueAtTime(0.001, now + 0.4);

      fuse.connect(fFilter);
      fFilter.connect(fGain);
      fGain.connect(this.ctx.destination);
      fuse.start(now);
      fuse.stop(now + 0.4);
    }

    // Heavy blast right after fuse
    setTimeout(() => {
      this.playDeepBlast(1.0, 1.6);
    }, 400);
  }

  // 6. Ladi (Crackers String) - Rapid fire machine-gun burst of 20 pops!
  public playLadi() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const count = 24;

    for (let i = 0; i < count; i++) {
      const popDelay = now + i * 0.085 + (Math.random() - 0.5) * 0.03;
      const isBigPop = i === count - 1 || Math.random() > 0.8;
      this.playMiniPop(popDelay, isBigPop);
    }
  }

  // Internal helper: Deep bass blast with acoustic decay
  private playDeepBlast(volume: number = 0.8, tailLength: number = 1.2) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass sine drop
    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(25, now + 0.3);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(volume * 0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + tailLength * 0.7);

    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + tailLength);

    // Explosive noise burst
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(tailLength);
    if (!noise.buffer) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.4);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(volume * 1.0, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + tailLength);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + tailLength);
  }

  // Internal helper: Single mini firecracker pop
  private playMiniPop(time: number, isBig: boolean = false) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isBig ? 180 : 320, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isBig ? 0.4 : 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isBig ? 0.14 : 0.09));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Internal helper: tiny high frequency crackle
  private playMicroCrack(time: number, freq: number = 3000) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.04);
  }
}

export const fireworkAudio = new FireworkAudioSynthesizer();
