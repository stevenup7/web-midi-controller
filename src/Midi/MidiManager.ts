import MidiMessage from "./MidiMessage";
import MidiPort, { MidiPortDirection } from "./MidiPort";
import { CheckboxItemData } from "../components/CheckboxGroup";

class MidiManager {
  midi: any; // TODO: change any to the proper midi type
  inPorts: { [key: string]: MidiPort };
  outPorts: { [key: string]: MidiPort };
  successCallback: () => void;
  onBeat: () => void;
  isReset: boolean;
  clockTimes: number[];
  bpm: number;
  beatCounter: number;
  clockCounter: number;

  constructor(successCallback: () => void, onBeat: () => void) {
    this.midi = null;
    this.inPorts = {};
    this.outPorts = {};
    this.successCallback = successCallback;
    this.onBeat = onBeat;

    // bpm and clock details TODO move to seperate controller
    this.clockTimes = [];
    this.bpm = 0;
    this.beatCounter = 0;
    this.clockCounter = 0;

    // was this reset during init
    this.isReset = false;

    const onMIDIFailure = (msg: string) => {
      console.error(`Failed to get MIDI access - ${msg}`);
    };

    // see if we can get access to some midi ports
    navigator
      .requestMIDIAccess()
      .then(this.onMIDISuccess.bind(this), onMIDIFailure);
  }

  onMIDISuccess(midiAccess: any): void {
    if (this.isReset) {
      return;
    }
    this.midi = midiAccess;
    this.getInputsAndOutputs();
    this.successCallback();
  }
  reset(): void {
    this.isReset = true;
  }

  getInputsAndOutputs(): void {
    const addPort = (
      details: any,
      direction: MidiPortDirection,
      list: { [key: string]: MidiPort }
    ) => {
      list[details.id] = new MidiPort(
        details.id,
        details.manufacturer,
        details.name,
        details.version,
        direction
      );
    };

    for (const entry of this.midi.inputs) {
      addPort(entry[1], "input", this.inPorts);
    }

    for (const entry of this.midi.outputs) {
      addPort(entry[1], "output", this.outPorts);
    }
  }
  getSimplePortList(direction: MidiPortDirection): CheckboxItemData[] {
    let portList = this.outPorts;
    let returnList: CheckboxItemData[] = [];
    if (direction === "input") {
      portList = this.inPorts;
    }

    for (const port in portList) {
      const p = portList[port];
      if (p.manufacturer !== "") {
        returnList.push({ id: p.id, text: p.name });
      }
    }
    return returnList;
  }
  getPortById(portID: string): MidiPort {
    try {
      return this.inPorts[portID];
    } catch (error) {
      return this.outPorts[portID];
    }
  }
  calculateClock() {
    // keep a running list of intervals since last clock time
    this.clockTimes.push(performance.now());
    if (this.clockTimes.length > 32) {
      this.clockTimes.shift(); // shift off the first element of the array so we only keep a certain length
      let startTime = this.clockTimes[0];
      let endTime = this.clockTimes[this.clockTimes.length - 1];
      let totalInterval = endTime - startTime;
      let clockSpeed = 60 / ((totalInterval / 31 / 1000) * 24); // in seconds
      this.bpm = Math.round(clockSpeed * 10) / 10;
      this.clockCounter++;
    }
    if (this.clockCounter % 3 === 0) {
      this.beatCounter++;
      this.onBeat();
    }
  }
  closePort(portId: string) {
    let port = this.getPortById(portId);
    let p: any;
    if (port.direction == "input") {
      p = this.midi.inputs.get(portId);
    } else {
      p = this.midi.inputs.get(portId);
    }
    p.close();
  }
  listenToPort(portId: string) {
    let port = this.getPortById(portId);

    if (port.direction == "input") {
      const input = this.midi.inputs.get(portId);
      input.open(); // opens the port
      input.onmidimessage = (msg: any) => {
        let midiMessage = new MidiMessage(msg.data);
        switch (midiMessage.type) {
          case "start":
            this.clockTimes = [];
            this.bpm = 0;
            this.beatCounter = 0;
            this.clockCounter = 0;
            break;
          case "clock":
            this.calculateClock();
            break;
          default:
            break;
        }
        if (
          midiMessage.type !== "start" &&
          midiMessage.type !== "stop" &&
          midiMessage.type !== "clock"
        ) {
          midiMessage.debugPrint();
        }
      };
    } else {
      const output = this.midi.outputs.get(portId);
      output.open(); // opens the port
      output.onmidimessage = (msg: any) => {
        console.log(msg);
      };
    }
  }
}

export default MidiManager;
