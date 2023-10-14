import MidiManager from "./MidiManager";

class MidiClock {
  midiManager: MidiManager;
  clockTimes: number[];
  bpm: number;
  beatCounter: number;
  clockCounter: number;
  running: boolean;

  constructor(midiManager: MidiManager) {
    this.midiManager = midiManager;
    // bpm and clock details TODO move to seperate controller
    this.clockTimes = [];
    this.bpm = 0;
    this.beatCounter = 0;
    this.clockCounter = 0;
    this.running = false;
  }
  start() {
    this.running = true;
    this.clockTimes = [];
    this.bpm = 0;
    this.beatCounter = 0;
    this.clockCounter = 0;
  }
  stop() {
    this.running = false;
  }

  tick() {
    if (!this.running) return;
    // keep a running list of intervals since last clock time
    this.clockTimes.push(performance.now());
    if (this.clockTimes.length > 32) {
      this.clockTimes.shift(); // shift off the first element of the array so we only keep a certain length
    }
    let startTime = this.clockTimes[0];
    let endTime = this.clockTimes[this.clockTimes.length - 1];
    let totalInterval = endTime - startTime;
    let clockSpeed =
      60 / ((totalInterval / (this.clockTimes.length - 1) / 1000) * 24); // in seconds
    this.bpm = Math.round(clockSpeed * 10) / 10;
    this.clockCounter++;

    if (this.clockCounter % 6 === 0 && this.clockCounter > 0) {
      this.beatCounter++;
      this.midiManager.onBeat();
    }
  }
}

export default MidiClock;
