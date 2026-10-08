import { random, type Question } from './model';

export type Variant = 'a' | 'b';
export type AudioStatus = 'idle' | 'preparing' | 'playing' | 'error';
type Pair = { a: AudioBuffer; b: AudioBuffer };
export const rms = (data: Float32Array) => Math.sqrt(data.reduce((sum, x) => sum + x * x, 0) / Math.max(1, data.length));
export const peak = (data: Float32Array) => data.reduce((max, x) => Math.max(max, Math.abs(x)), 0);

// Both versions get one shared headroom adjustment after RMS matching.
export function matchLevels(a: Float32Array, b: Float32Array) {
  const dryRms = rms(a), wetRms = rms(b);
  const ratio = wetRms > 1e-9 ? dryRms / wetRms : 1;
  for (let i = 0; i < b.length; i++) b[i] *= ratio;
  const scale = Math.min(1, 0.72 / Math.max(peak(a), peak(b), 1e-9));
  for (let i = 0; i < a.length; i++) a[i] *= scale;
  for (let i = 0; i < b.length; i++) b[i] *= scale;
  return { dryRms: rms(a), wetRms: rms(b), maxPeak: Math.max(peak(a), peak(b)) };
}

// Original synthesized material: kick, bass, arpeggio, hi-hat and air.
// No network, microphone, commercial recordings or external audio assets.
export function makeLoop(rate: number, seed: number): Float32Array<ArrayBuffer> {
  const data = new Float32Array(rate * 4);
  const rng = random(seed);
  const roots = [55, 65.406, 73.416];
  const root = roots[Math.floor(rng() * roots.length)];
  const chord = [4, 7, 12, 16, 19, 24];
  let previousNoise = 0;
  for (let i = 0; i < data.length; i++) {
    const t = i / rate;
    const beatTime = t % 0.5;
    const hatTime = t % 0.25;
    const noteTime = t % 0.25;
    const note = chord[Math.floor(t / 0.25) % chord.length];
    const hz = root * Math.pow(2, note / 12);
    const noise = rng() * 2 - 1;
    const highNoise = (noise - previousNoise) * 0.5;
    previousNoise = noise;
    const kick = Math.sin(2 * Math.PI * (55 * beatTime + 7 * (1 - Math.exp(-beatTime * 35)))) * Math.exp(-beatTime * 18) * 0.28;
    const bass = (Math.sin(2 * Math.PI * root * t) + 0.3 * Math.sin(2 * Math.PI * root * 2 * t)) * 0.09;
    const envelope = (1 - Math.exp(-noteTime * 150)) * Math.exp(-noteTime * 11);
    let tone = 0;
    for (let h = 1; h <= 6; h++) tone += Math.sin(2 * Math.PI * hz * h * t) * 0.045 / Math.pow(h, 1.3);
    const hat = highNoise * Math.exp(-hatTime * 50) * 0.1;
    const air = highNoise * 0.018;
    data[i] = kick + bass + tone * envelope + hat + air;
  }
  // Avoid a discontinuity at the loop boundary.
  const fade = Math.round(rate * 0.006);
  for (let i = 0; i < fade; i++) { data[i] *= i / fade; data[data.length - 1 - i] *= i / fade; }
  return data;
}

export function makeNotes(rate: number, notes: number[], chord = false): Float32Array<ArrayBuffer> {
  const step = 0.58;
  const duration = chord ? 1.4 : notes.length * step + 0.25;
  const data = new Float32Array(Math.ceil(duration * rate));
  notes.forEach((midi, index) => {
    const hz = 440 * Math.pow(2, (midi - 69) / 12);
    const start = chord ? 0 : index * step;
    const length = chord ? 1.2 : 0.48;
    for (let i = 0; i < Math.floor(length * rate); i++) {
      const t = i / rate;
      const env = Math.min(1, t / 0.015) * Math.min(1, (length - t) / 0.08) * Math.exp(-t * 1.4);
      const value = (Math.sin(2 * Math.PI * hz * t) + 0.18 * Math.sin(2 * Math.PI * hz * 2 * t)) * env * (chord ? 0.13 : 0.3);
      data[Math.round(start * rate) + i] += value;
    }
  });
  return data;
}

export class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private gains: GainNode[] = [];
  private listeners = new Set<(status: AudioStatus) => void>();
  private cache = new Map<string, Promise<Pair>>();
  private activeKey = '';
  private token = 0;
  private volume = 0.35;
  status: AudioStatus = 'idle';
  diagnostics: { dryRms: number; wetRms: number; maxPeak: number } | null = null;

  subscribe(listener: (status: AudioStatus) => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
  private emit(status: AudioStatus) { this.status = status; this.listeners.forEach(fn => fn(status)); }
  private init() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
      this.context.addEventListener('statechange', () => { if (this.context?.state !== 'running' && this.status === 'playing') this.stop(); });
    }
    return this.context;
  }
  setVolume(value: number) {
    this.volume = Math.max(0.05, Math.min(0.8, value));
    if (this.context && this.master) this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.015);
  }
  stop() {
    this.token++;
    this.sources.forEach(s => { s.onended = null; try { s.stop(); } catch { /* already ended */ } s.disconnect(); });
    this.gains.forEach(g => g.disconnect());
    this.sources = []; this.gains = []; this.activeKey = '';
    this.emit('idle');
  }
  private key(q: Question) { return `${q.kind}:${q.seed}:${q.frequency}:${q.gain}:${q.q}:${q.notesA.join(',')}:${q.notesB.join(',')}`; }
  private prepare(q: Question, rate: number): Promise<Pair> {
    const key = this.key(q);
    const cached = this.cache.get(key);
    if (cached) return cached;
    const work = (async () => {
      if (q.kind === 'eq') {
        const data = makeLoop(rate, q.seed);
        const offline = new OfflineAudioContext(1, data.length, rate);
        const dry = offline.createBuffer(1, data.length, rate);
        dry.copyToChannel(data, 0);
        const source = offline.createBufferSource(); source.buffer = dry;
        const filter = offline.createBiquadFilter();
        filter.type = 'peaking'; filter.frequency.value = q.frequency!;
        filter.gain.value = q.gain!; filter.Q.value = q.q!;
        source.connect(filter); filter.connect(offline.destination); source.start();
        const wet = await offline.startRendering();
        this.diagnostics = matchLevels(dry.getChannelData(0), wet.getChannelData(0));
        return { a: dry, b: wet };
      }
      const aData = makeNotes(rate, q.notesA, q.kind === 'chord');
      const bData = makeNotes(rate, q.notesB.length ? q.notesB : q.notesA, q.kind === 'chord');
      const make = (data: Float32Array) => {
        const buffer = this.init().createBuffer(1, data.length, rate);
        buffer.copyToChannel(data as Float32Array<ArrayBuffer>, 0); return buffer;
      };
      return { a: make(aData), b: make(bData) };
    })();
    this.cache.set(key, work);
    // Limit memory to a few original/processed loop pairs.
    if (this.cache.size > 8) this.cache.delete(this.cache.keys().next().value!);
    work.catch(() => this.cache.delete(key));
    return work;
  }
  async play(q: Question, variant: Variant = 'a', onComplete?: () => void): Promise<boolean> {
    const key = this.key(q);
    if (q.kind === 'eq' && this.status === 'playing' && this.activeKey === key) {
      this.switchVariant(variant); return true;
    }
    this.stop();
    const token = this.token;
    this.emit('preparing');
    try {
      const context = this.init();
      // Called from a user gesture, before any asynchronous rendering.
      await context.resume();
      if (context.state !== 'running') throw new Error('Audio context is suspended');
      const pair = await this.prepare(q, context.sampleRate);
      if (token !== this.token) return false;
      const start = context.currentTime + 0.025;
      if (q.kind === 'eq') {
        for (const [index, buffer] of [pair.a, pair.b].entries()) {
          const s = context.createBufferSource(); s.buffer = buffer; s.loop = true;
          const g = context.createGain(); g.gain.value = (variant === 'a' ? index === 0 : index === 1) ? 1 : 0;
          s.connect(g); g.connect(this.master!); s.start(start);
          this.sources.push(s); this.gains.push(g);
        }
      } else {
        const s = context.createBufferSource(); s.buffer = pair[variant];
        s.connect(this.master!); s.start(start);
        s.onended = () => { if (token === this.token) { onComplete?.(); this.stop(); } };
        this.sources.push(s);
      }
      this.activeKey = key; this.emit('playing'); return true;
    } catch { if (token === this.token) this.emit('error'); return false; }
  }
  switchVariant(variant: Variant) {
    if (!this.context || this.gains.length !== 2) return;
    this.gains.forEach((g, i) => { g.gain.cancelScheduledValues(this.context!.currentTime); g.gain.setTargetAtTime((variant === 'a' ? i === 0 : i === 1) ? 1 : 0, this.context!.currentTime, 0.012); });
  }
}
