/* ============ Audio (WebAudio sintetizado) ============ */
"use strict";

const AudioSys = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  enabled: true,
  musicOn: true,
  _musicTimer: null,
  _step: 0,

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.9;
      this.sfxGain.connect(this.master);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.32;
      this.musicGain.connect(this.master);
    } catch (e) { this.enabled = false; }
  },
  resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  },

  tone(freq, dur, type = "square", vol = 0.5, when = 0, slideTo = null) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(this.sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.05);
  },

  noise(dur, vol = 0.4, when = 0, filterFreq = 1200) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.sfxGain);
    src.start(t0);
  },

  /* ---- SFX del juego ---- */
  shoot()   { this.tone(660, 0.07, "square", 0.18, 0, 880); },
  thread()  { this.tone(340, 0.06, "triangle", 0.14, 0, 520); },
  hit()     { this.noise(0.06, 0.22, 0, 900); },
  hurt()    { this.tone(220, 0.22, "sawtooth", 0.35, 0, 90); this.noise(0.15, 0.3, 0, 500); },
  coin()    { this.tone(988, 0.06, "square", 0.2); this.tone(1319, 0.1, "square", 0.2, 0.06); },
  xp()      { this.tone(740, 0.05, "sine", 0.14, 0, 1100); },
  levelup() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, "square", 0.28, i * 0.08));
  },
  explode() { this.noise(0.3, 0.5, 0, 700); this.tone(120, 0.3, "sawtooth", 0.3, 0, 40); },
  bossSpawn() {
    [147, 147, 196, 220].forEach((f, i) => this.tone(f, 0.35, "sawtooth", 0.3, i * 0.16));
    this.noise(0.6, 0.25, 0, 300);
  },
  bossDie() {
    [392, 330, 262, 196, 131].forEach((f, i) => this.tone(f, 0.3, "square", 0.3, i * 0.12));
    this.noise(0.8, 0.4, 0.1, 500);
  },
  death() {
    [330, 262, 196, 131, 98].forEach((f, i) => this.tone(f, 0.3, "triangle", 0.3, i * 0.14));
  },
  ui()      { this.tone(520, 0.06, "square", 0.18); },
  buy()     { this.tone(784, 0.07, "square", 0.22); this.tone(1047, 0.12, "square", 0.22, 0.07); },
  denied()  { this.tone(180, 0.15, "square", 0.22, 0, 120); },
  victory() {
    [523, 523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.22, "square", 0.28, i * 0.13));
  },

  /* ---- Música: loop cuequita sintetizado ---- */
  startMusic() {
    if (!this.enabled || !this.ctx || !this.musicOn) return;
    this.stopMusic();
    // bajo (raíces) + melodía festiva
    const bass = [0, 0, 3, 0, 5, 3, 0, 4];          // semitones sobre raíz
    const mel  = [7, 10, 12, 10, 7, 5, 7, 12, 10, 7, 5, 4, 5, 7, 12, 14];
    const root = 146.83; // D3
    this._step = 0;
    const beat = 0.21; // ~143 bpm cueca
    this._musicTimer = setInterval(() => {
      if (!this.musicOn || !this.ctx) return;
      const s = this._step;
      const bIdx = s % bass.length;
      const mIdx = s % mel.length;
      // bajo en pulsos
      if (s % 2 === 0) {
        const f = root * Math.pow(2, bass[bIdx] / 12);
        this._mTone(f, 0.16, "triangle", 0.5);
      }
      // melodía
      if (s % 2 === 1 || U.chance(0.5)) {
        const f = root * 2 * Math.pow(2, mel[mIdx] / 12);
        this._mTone(f, 0.14, "square", 0.28);
      }
      // palmas (ruido) en tiempo
      if (s % 4 === 2) this._mNoise(0.05, 0.35, 3500);
      this._step++;
    }, beat * 1000);
  },
  stopMusic() {
    if (this._musicTimer) { clearInterval(this._musicTimer); this._musicTimer = null; }
  },
  _mTone(freq, dur, type, vol) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(this.musicGain);
    o.start(t0); o.stop(t0 + dur + 0.05);
  },
  _mNoise(dur, vol, freq) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = freq;
    const g = this.ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.musicGain);
    src.start(t0);
  }
};
