import MidiMessageDecoder from "./MidiMessageDecoder";
import MidiPort, { MidiPortDirection } from "./MidiPort";
import { CheckboxItemData } from "../components/CheckboxGroup";
import MidiClock from "./MidiClock";
import MidiMessage from "./MidiMessage";

class MidiManager {
  midi: MIDIAccess | undefined;
  inPorts: { [key: string]: MidiPort };
  outPorts: { [key: string]: MidiPort };
  successCallback: () => void;
  onBeat: () => void;
  isReset: boolean;
  clock: MidiClock;
  activeOutPorts: { [key: string]: MIDIOutput };
  constructor(successCallback: () => void, onBeat: () => void) {
    this.midi = undefined;
    this.clock = new MidiClock(this);
    this.inPorts = {};
    this.outPorts = {};
    this.activeOutPorts = {};

    this.successCallback = successCallback;
    this.onBeat = onBeat;

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

  onMIDISuccess(midiAccess: MIDIAccess): void {
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
    if (!this.midi) throw new Error("No Midi Connection");

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
      if (p.name !== "") {
        returnList.push({ id: p.id, text: p.name });
      }
    }
    return returnList;
  }
  getPortById(portID: string): MidiPort {
    if (this.inPorts.hasOwnProperty(portID)) {
      return this.inPorts[portID];
    } else {
      return this.outPorts[portID];
    }
  }

  closePort(portId: string) {
    if (!this.midi) throw new Error("No Midi Connection");
    let port = this.getPortById(portId);
    let p: any;
    if (port.direction == "input") {
      p = this.midi.inputs.get(portId);
    } else {
      p = this.midi.inputs.get(portId);
    }
    p.close();
  }
  sendNote(_channel: number, _note: string, _octave: number) {
    // const m = new MidiMessage();
    // const noteCode = this.makeNote(note, octave);
    // for (const port in this.activeOutPorts) {
    //   const op = this.activeOutPorts[port];
    //   op.send(m.noteOn(channel, noteCode)); //omitting the timestamp means send immediately.
    //   console.log("test");
    //   op.send(m.noteOff(channel, noteCode), window.performance.now() + 1000.0); // timestamp = now + 1000ms.
    // }
  }
  sendToAll(thingToSend: any) {
    for (const port in this.activeOutPorts) {
      const op = this.activeOutPorts[port];
      console.log(thingToSend);

      op.send(thingToSend); //omitting the timestamp means send immediately.
    }
  }
  sendCC(channel: number, ccNumber: number, ccValue: number) {
    const m = new MidiMessage();
    const message = m.ccValue(channel, ccNumber, ccValue);
    console.log(message);
    this.sendToAll(message);
  }
  makeNote(note: string, octave: number) {
    return note + octave;
  }
  noteDown(channel: number, note: string, octave: number) {
    const m = new MidiMessage();
    this.sendToAll(m.noteOn(channel, this.makeNote(note, octave)));
  }
  noteUp(channel: number, note: string, octave: number) {
    const m = new MidiMessage();
    this.sendToAll(m.noteOff(channel, this.makeNote(note, octave)));
  }

  listenToPort(portId: string) {
    if (!this.midi) {
      throw new Error("No Midi Connection");
      return;
    }
    let port = this.getPortById(portId);

    if (port.direction == "input") {
      const input = this.midi.inputs.get(portId);

      if (!input) throw new Error("Not A valid Input");

      input.open(); // opens the port
      input.onmidimessage = (msg: any) => {
        let midiMessage = new MidiMessageDecoder(msg.data);
        switch (midiMessage.type) {
          case "start":
            this.clock.start();
            break;
          case "clock":
            this.clock.tick();
            break;
          case "stop":
            this.clock.stop();
            break;
          default:
            midiMessage.debugPrint();

            break;
        }
      };
    } else {
      const output = this.midi.outputs.get(portId);
      if (!output) throw new Error("Not A valid Output");
      output.open(); // opens the port
      this.activeOutPorts[portId] = output;
    }
  }
}

export default MidiManager;
