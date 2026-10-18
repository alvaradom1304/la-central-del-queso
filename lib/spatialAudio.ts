'use client';

/**
 * Motor de Audio Espacial Procedural & Binaural para "La Central del Queso"
 * Utiliza Web Audio API nativo para sintetizar paisajes sonoros orgánicos de Turrialba:
 * 1. Brisa de Montaña y Rocío Volcánico (Ruido rosa modulado por LFO)
 * 2. Cencerros lejanos de ganado en pastoreo libre (Armónicos metálicos exponenciales)
 * 3. Crujido suave de leña en la cava de ahumado
 * 4. Efecto de corte de cuchillo artesanal al extraer la cuña de queso
 * 5. Panning espacial en tiempo real según rotación y scroll
 */

class SpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;

  // Nodos para brisa de montaña
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;

  // Nodos para leña y brasas
  private embersGain: GainNode | null = null;

  // Intervalo para cencerros procedurales
  private cowbellTimer: number | null = null;

  // Panner estéreo para orientación 3D
  private panner: StereoPannerNode | null = null;

  public init() {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    this.ctx = ctx;

    // Ganancia Maestra
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 1.5);
    master.connect(ctx.destination);
    this.masterGain = master;

    // Panner estéreo
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.connect(master);
      this.panner = panner;
    }

    const targetOutput = this.panner || master;

    // 1. GENERADOR DE BRISA DE MONTAÑA (Buffer de Ruido Rosa Filtrado)
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(320, ctx.currentTime);
    windFilter.Q.setValueAtTime(3.2, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.22, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(targetOutput);
    windSource.start();

    this.windSource = windSource;
    this.windFilter = windFilter;
    this.windGain = windGain;

    // LFO suave para que el viento respire orgánicamente
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    lfo.start();

    // 2. GENERADOR DE BRASAS DE AHUMADO (Cava)
    const embersGain = ctx.createGain();
    embersGain.gain.setValueAtTime(0.08, ctx.currentTime);
    embersGain.connect(targetOutput);
    this.embersGain = embersGain;

    // 3. CENCERROS LEJANOS PROCEDURALES
    this.startCowbellRhythm();

    this.isRunning = true;
  }

  // Genera un toque orgánico de cencerro metálico afinado
  public playCowbell(freq = 420, pan = 0.3, volume = 0.14) {
    if (!this.ctx || this.ctx.state === 'closed') return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
      panner.connect(this.masterGain || ctx.destination);
    }

    const outputNode = panner || this.masterGain || ctx.destination;

    // Modo dual de campana (2 frecuencias no armónicas)
    [freq, freq * 1.48].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(volume * (idx === 0 ? 1 : 0.45), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(t);
      osc.stop(t + 1.25);
    });
  }

  // Efecto de cuchillo de corte artesanal al abrir la cuña
  public playKnifeSliceSfx() {
    if (!this.ctx || this.ctx.state === 'closed') return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // Sonido sutil de filo de acero deslizándose
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.28);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain || ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Bucle suave de cencerros lejanos aleatorios (estilo pastoreo de montaña)
  private startCowbellRhythm() {
    const scheduleNext = () => {
      if (!this.isRunning) return;
      const delay = 4500 + Math.random() * 6500;
      this.cowbellTimer = window.setTimeout(() => {
        const pan = (Math.random() * 2 - 1) * 0.75;
        const baseFreq = 380 + Math.random() * 120;
        this.playCowbell(baseFreq, pan, 0.09);
        // Posible segundo toque (rebote de cencerro al caminar)
        if (Math.random() > 0.4) {
          setTimeout(() => {
            this.playCowbell(baseFreq * 1.04, pan + 0.05, 0.06);
          }, 240);
        }
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }

  // Modula el paisaje acústico según el Acto y progreso de scroll (0.0 -> 1.0)
  public updateProgress(progress: number, mouseX = 0) {
    if (!this.ctx || !this.isRunning) return;

    // Panning posicional en base al cursor
    if (this.panner) {
      this.panner.pan.setTargetAtTime(mouseX * 0.65, this.ctx.currentTime, 0.15);
    }

    // Acto I-II (Pastos abiertos) vs Acto III-IV (Granero y Cava cerrada)
    if (this.windFilter && this.windGain && this.embersGain) {
      const isInside = Math.max(0, Math.min(1, (progress - 0.6) / 0.4));
      const targetFreq = 380 * (1 - isInside * 0.45);
      const targetWindVol = 0.22 * (1 - isInside * 0.55);
      const targetEmbersVol = 0.02 + isInside * 0.16;

      this.windFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.2);
      this.windGain.gain.setTargetAtTime(targetWindVol, this.ctx.currentTime, 0.2);
      this.embersGain.gain.setTargetAtTime(targetEmbersVol, this.ctx.currentTime, 0.2);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.cowbellTimer) {
      clearTimeout(this.cowbellTimer);
      this.cowbellTimer = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        if (this.ctx && this.ctx.state !== 'closed') {
          this.ctx.close();
          this.ctx = null;
        }
      }, 550);
    }
  }

  public get active() {
    return this.isRunning;
  }
}

export const spatialAudio = new SpatialAudioEngine();
