export class AudioEngine {
  context: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  masterGain: GainNode | null = null;

  constructor() {}

  init(): AudioContext {
    if (this.context) return this.context;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass();
    
    this.masterGain = this.context.createGain();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;

    // Connect: Master Gain -> Analyser -> Destination
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    return this.context;
  }

  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  get isInitialized(): boolean {
    return this.context !== null;
  }

  async loadSound(url: string): Promise<AudioBuffer> {
    if (!this.context) throw new Error("AudioEngine not initialized");
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }

  playBuffer(buffer: AudioBuffer): AudioBufferSourceNode {
    if (!this.context || !this.masterGain) throw new Error("AudioEngine not initialized");
    
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start(0);
    return source;
  }

  createOscillator(frequency: number = 15000, type: OscillatorType = 'sine'): OscillatorNode {
    if (!this.context || !this.masterGain) throw new Error("AudioEngine not initialized");

    const osc = this.context.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.context.currentTime);
    osc.connect(this.masterGain);
    return osc;
  }

  connectMicrophone(stream: MediaStream): AnalyserNode {
    if (!this.context) throw new Error("AudioEngine not initialized");

    const source = this.context.createMediaStreamSource(stream);
    const micAnalyser = this.context.createAnalyser();
    micAnalyser.fftSize = 2048;
    // Do NOT connect to destination to avoid feedback
    source.connect(micAnalyser);
    
    return micAnalyser;
  }
}

export function calculateRMS(dataArray: Uint8Array): number {
  let sum = 0;
  // dataArray values are 0-255 (128 is silence)
  const len = dataArray.length;
  for (let i = 0; i < len; i++) {
    const x = (dataArray[i] - 128) / 128.0;
    sum += x * x;
  }
  return Math.sqrt(sum / len);
}
