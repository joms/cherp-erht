export class Speaker {
  audioCtx: AudioContext;
  gain: GainNode;
  finish: AudioDestinationNode;
  oscillator: OscillatorNode | null = null;

  constructor() {
    this.audioCtx = new AudioContext();

    this.gain = this.audioCtx.createGain();
    this.finish = this.audioCtx.destination;

    this.gain.connect(this.finish);
  }

  public play(frequency: number) {
    if (this.audioCtx && !this.oscillator) {
      this.oscillator = this.audioCtx.createOscillator();

      this.oscillator.frequency.setValueAtTime(
        frequency || 440,
        this.audioCtx.currentTime,
      );

      this.oscillator.type = "square";

      this.oscillator.connect(this.gain);
      this.oscillator.start();
    }
  }

  public stop() {
    if (!this.oscillator) {
      return;
    }

    this.oscillator.stop();
    this.oscillator.disconnect();
    this.oscillator = null;
  }
}
