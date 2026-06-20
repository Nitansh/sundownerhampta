export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export class AudioEngine {
  private ctx: AudioContext | null = null;

  // Polyphonic Synth Voice tracking
  private activeVoices: Map<string, { osc: OscillatorNode; filter: BiquadFilterNode; gainNode: GainNode; startTime: number }> = new Map();

  // Master Nodes
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Effects Nodes
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private delayMix: GainNode | null = null;
  
  private distortionNode: WaveShaperNode | null = null;
  private distortionMix: GainNode | null = null;

  private reverbNode: ConvolverNode | null = null;
  private reverbMix: GainNode | null = null;

  // Sound Parameters
  public waveform: WaveformType = 'sawtooth';
  public synthVolume: number = 0.5;
  public drumVolume: number = 0.6;

  // ADSR Envelope
  public attack: number = 0.05;
  public decay: number = 0.2;
  public sustain: number = 0.6; // 0.0 to 1.0
  public release: number = 0.3;

  // Synth Filter (LFO/Filter Envelope)
  public filterFreq: number = 2000;
  public filterQ: number = 1.0;
  public filterType: BiquadFilterType = 'lowpass';

  // FX Parameters
  public delayTime: number = 0.3;
  public delayFeedbackAmt: number = 0.4;
  public delayEnabled: boolean = false;

  public distortionAmt: number = 0.0; // 0.0 to 1.0
  public distortionEnabled: boolean = false;

  public reverbRoomSize: number = 1.5;
  public reverbEnabled: boolean = false;

  // White noise buffer cached for drums
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // Context is initialized lazily upon first user interaction
  }

  public init() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Create Master Gain and Analyser
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;

    // Connect nodes
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Initialize FX Nodes
    this.initFX();

    // Cache white noise buffer
    this.noiseBuffer = this.createNoiseBuffer();
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  private initFX() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Delay setup
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayFeedback = this.ctx.createGain();
    this.delayMix = this.ctx.createGain();

    this.delayNode.delayTime.setValueAtTime(this.delayTime, this.ctx.currentTime);
    this.delayFeedback.gain.setValueAtTime(this.delayFeedbackAmt, this.ctx.currentTime);
    this.delayMix.gain.setValueAtTime(this.delayEnabled ? 0.4 : 0.0, this.ctx.currentTime);

    // Connect Delay feedback loop
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // 2. Distortion setup
    this.distortionNode = this.ctx.createWaveShaper();
    this.distortionMix = this.ctx.createGain();
    this.distortionMix.gain.setValueAtTime(this.distortionEnabled ? 0.5 : 0.0, this.ctx.currentTime);
    this.updateDistortionCurve();

    // 3. Reverb setup
    this.reverbNode = this.ctx.createConvolver();
    this.reverbMix = this.ctx.createGain();
    this.reverbMix.gain.setValueAtTime(this.reverbEnabled ? 0.35 : 0.0, this.ctx.currentTime);
    this.updateReverbImpulse();
  }

  // --- FX Parameters Updating ---
  public updateDelay() {
    if (!this.ctx || !this.delayNode || !this.delayFeedback || !this.delayMix) return;
    const now = this.ctx.currentTime;
    this.delayNode.delayTime.setTargetAtTime(this.delayTime, now, 0.05);
    this.delayFeedback.gain.setTargetAtTime(this.delayFeedbackAmt, now, 0.05);
    this.delayMix.gain.setTargetAtTime(this.delayEnabled ? 0.45 : 0.0, now, 0.05);
  }

  public updateDistortion() {
    if (!this.ctx || !this.distortionMix) return;
    const now = this.ctx.currentTime;
    this.distortionMix.gain.setTargetAtTime(this.distortionEnabled ? this.distortionAmt * 0.7 : 0.0, now, 0.05);
    this.updateDistortionCurve();
  }

  public updateReverb() {
    if (!this.ctx || !this.reverbMix) return;
    const now = this.ctx.currentTime;
    this.reverbMix.gain.setTargetAtTime(this.reverbEnabled ? 0.45 : 0.0, now, 0.05);
    this.updateReverbImpulse();
  }

  private updateDistortionCurve() {
    if (!this.distortionNode) return;
    const k = typeof this.distortionAmt === 'number' ? this.distortionAmt * 100 : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    this.distortionNode.curve = curve;
    this.distortionNode.oversample = '4x';
  }

  private updateReverbImpulse() {
    if (!this.ctx || !this.reverbNode) return;
    const duration = this.reverbRoomSize;
    const decay = 2.0;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    
    // Algorithmic impulse response buffer
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Exponentially decaying white noise
        const noise = Math.random() * 2 - 1;
        channelData[i] = noise * Math.pow(1 - i / length, decay);
      }
    }
    this.reverbNode.buffer = impulse;
  }

  // --- Audio Node Connection helper ---
  private connectToFXChain(sourceNode: AudioNode, destGainNode: GainNode) {
    if (!this.ctx || !this.masterGain || !this.delayNode || !this.delayMix || !this.distortionNode || !this.distortionMix || !this.reverbNode || !this.reverbMix) {
      // Fallback directly to master
      if (this.masterGain) {
        sourceNode.connect(destGainNode);
        destGainNode.connect(this.masterGain);
      }
      return;
    }

    // Connect source to dry path
    sourceNode.connect(destGainNode);
    destGainNode.connect(this.masterGain);

    // Parallel FX Sends
    destGainNode.connect(this.delayNode);
    this.delayMix.connect(this.masterGain);

    destGainNode.connect(this.distortionNode);
    this.distortionNode.connect(this.distortionMix);
    this.distortionMix.connect(this.masterGain);

    destGainNode.connect(this.reverbNode);
    this.reverbNode.connect(this.reverbMix);
    this.reverbMix.connect(this.masterGain);
  }

  // --- SYNTHESIZER POLYPHONIC VOICES ---
  public triggerAttack(note: string, frequency: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Avoid duplicate triggers for the same note
    this.triggerRelease(note);

    const now = this.ctx.currentTime;

    // Create nodes for this voice
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const voiceGain = this.ctx.createGain();

    osc.type = this.waveform;
    osc.frequency.setValueAtTime(frequency, now);

    filter.type = this.filterType;
    filter.frequency.setValueAtTime(this.filterFreq, now);
    filter.Q.setValueAtTime(this.filterQ, now);

    // Initialize voice gain to 0
    voiceGain.gain.setValueAtTime(0, now);

    // Connect: Osc -> Filter -> VoiceGain -> Effects Chain
    osc.connect(filter);
    this.connectToFXChain(filter, voiceGain);

    // Apply ADSR Envelope
    const peakVolume = this.synthVolume * 0.5; // Scale volume to avoid clipping
    const attackEnd = now + Math.max(0.001, this.attack);

    // Attack
    voiceGain.gain.linearRampToValueAtTime(peakVolume, attackEnd);
    // Decay to Sustain
    voiceGain.gain.setTargetAtTime(peakVolume * this.sustain, attackEnd, Math.max(0.001, this.decay));

    // Start oscillator
    osc.start(now);

    // Save voice reference
    this.activeVoices.set(note, {
      osc,
      filter,
      gainNode: voiceGain,
      startTime: now
    });
  }

  public triggerRelease(note: string) {
    const voice = this.activeVoices.get(note);
    if (!voice || !this.ctx) return;

    const now = this.ctx.currentTime;
    const { osc, gainNode } = voice;

    // Remove from active list immediately to prevent release overlaps
    this.activeVoices.delete(note);

    try {
      // Cancel scheduled ramps
      gainNode.gain.cancelScheduledValues(now);
      // Fade out based on Release duration
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.setTargetAtTime(0, now, Math.max(0.001, this.release));

      const stopTime = now + (this.release * 5); // Allow time for decay tail
      osc.stop(stopTime);
    } catch (e) {
      console.warn('Error during voice release:', e);
    }
  }

  // --- DRUM SYNTHESIZERS ---
  
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public triggerKick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    
    // Pitch sweep (Kick thud): start high (150Hz) and slide to deep bottom (45Hz) rapidly
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    // Amplitude decay envelope
    gainNode.gain.setValueAtTime(this.drumVolume * 1.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    this.connectToFXChain(gainNode, gainNode); // Self-gain thud

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public triggerSnare() {
    this.init();
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;

    // 1. Noise channel (snare wires rattle)
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1000, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.drumVolume * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    this.connectToFXChain(noiseGain, noiseGain);

    // 2. Body Tone channel (snare drum snap)
    const toneOsc = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    toneOsc.type = 'triangle';
    toneOsc.frequency.setValueAtTime(180, now);
    toneOsc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

    toneGain.gain.setValueAtTime(this.drumVolume * 0.5, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    toneOsc.connect(toneGain);
    this.connectToFXChain(toneGain, toneGain);

    noiseSource.start(now);
    toneOsc.start(now);
    
    noiseSource.stop(now + 0.2);
    toneOsc.stop(now + 0.1);
  }

  public triggerHiHat() {
    this.init();
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;

    // Synthesized Hi-Hat using high-pass filtered white noise
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, now); // extreme high frequency

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.drumVolume * 0.35, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06); // very short snap

    noiseSource.connect(filter);
    filter.connect(gainNode);
    this.connectToFXChain(gainNode, gainNode);

    noiseSource.start(now);
    noiseSource.stop(now + 0.08);
  }

  public triggerClap() {
    this.init();
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;

    // Synthesize handclap using multiple rapid noise bursts (3 quick triggers, 1 decay tail)
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.5, now);

    const gainNode = this.ctx.createGain();
    
    // Multiple rapid thuds
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.setValueAtTime(this.drumVolume * 0.7, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.015);
    
    gainNode.gain.setValueAtTime(this.drumVolume * 0.6, now + 0.018);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.033);
    
    gainNode.gain.setValueAtTime(this.drumVolume * 0.5, now + 0.036);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.051);

    // Final clap decay release
    gainNode.gain.setValueAtTime(this.drumVolume * 0.8, now + 0.054);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    this.connectToFXChain(gainNode, gainNode);

    noiseSource.start(now);
    noiseSource.stop(now + 0.22);
  }
}
