import MidiMessageDecoder from "./MidiMessageDecoder";
import MidiPort, { MidiPortDirection } from "./MidiPort";
import { CheckboxItemData } from "../components/CheckboxGroup";
import MidiClock from "./MidiClock";
import MidiMessage from "./MidiMessage";
interface cbFn {
  (beatNumber: number): void;
}

class MidiManager {
  midi: MIDIAccess | undefined;
  inPorts: { [key: string]: MidiPort };
  outPorts: { [key: string]: MidiPort };
  successCallback: () => void;
  onBeatCallBackFunctionList: cbFn[];
  isReset: boolean;
  clock: MidiClock;
  fxChannels: number[];
  activeOutPorts: { [key: string]: MIDIOutput };
  constructor(successCallback: () => void) {
    this.midi = undefined;
    this.clock = new MidiClock(this);
    this.inPorts = {};
    this.outPorts = {};
    this.activeOutPorts = {};
    this.onBeatCallBackFunctionList = [];
    this.successCallback = successCallback;
    this.fxChannels = [];
    // was this reset during init
    this.isReset = false;

    const onMIDIFailure = (msg: string) => {
      console.error(`Failed to get MIDI access - ${msg}`);
    };

    // see if we can get access to some midi ports
    // TODO: smart errors here
    // need https:// for midi access (navigator.requestMIDIAccess is not a function on an insecure context)
    navigator
      .requestMIDIAccess()
      .then(this.onMIDISuccess.bind(this), onMIDIFailure);
  }

  addBeatHandler(onBeat: (beatCount: number) => void) {
    if (this.onBeatCallBackFunctionList.indexOf(onBeat) == -1) {
      this.onBeatCallBackFunctionList.push(onBeat);
    } else {
      // this is called at the moment when useeffect is called twice becuase of StrictMode in main.tsx
      console.warn(
        "not adding beathandler becuase funciton already in beathandlers"
      );
    }
  }
  beatHandler(beatCount: number) {
    // call all the handler functions in the list
    this.onBeatCallBackFunctionList.forEach((cb) => {
      cb(beatCount);
    }, this);
  }

  addFXChannel(channel: number) {
    if (this.fxChannels.indexOf(channel) == -1) {
      this.fxChannels.push(channel);
    }
  }

  removeFXChannel(channel: number) {
    const idx = this.fxChannels.indexOf(channel);
    if (idx > -1) {
      this.fxChannels.splice(channel, idx);
    }
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
      if (p.name.indexOf("Midi Through") !== 0) {
        returnList.push({ id: p.id, text: p.name, checked: p.connected });
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
      p = this.midi.outputs.get(portId);
    }
    port.connected = false;
    p.close();
  }
  sendNote(channel: number, note: string, octave: number) {
    const m = new MidiMessage();
    this.sendToAll(m.noteOn(channel, this.makeNote(note, octave)));
    setTimeout(() => {
      this.sendToAll(m.noteOff(channel, this.makeNote(note, octave)));
    }, 5);
  }
  sendToAll(thingToSend: any) {
    for (const port in this.activeOutPorts) {
      const op = this.activeOutPorts[port];
      console.log(thingToSend);

      op.send(thingToSend); //omitting the timestamp means send immediately.
    }
  }
  sendFXMessage(ccNumber: number, ccValue: number) {
    for (let i = 0; i < this.fxChannels.length; i++) {
      this.sendCC(this.fxChannels[i], ccNumber, ccValue);
    }
  }
  sendCC(channel: number, ccNumber: number, ccValue: number) {
    const m = new MidiMessage();
    const message = m.ccValue(channel, ccNumber, ccValue);
    this.sendToAll(message);
  }
  makeNote(note: string, octave: number) {
    return note + octave;
  }
  noteDown(channel: number, note: string) {
    const m = new MidiMessage();
    console.log("note on");

    this.sendToAll(m.noteOn(channel, note));
  }
  noteUp(channel: number, note: string) {
    const m = new MidiMessage();
    console.log("note off");
    this.sendToAll(m.noteOff(channel, note));
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
      port.connected = true;
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
      port.connected = true;
      this.activeOutPorts[portId] = output;
    }
  }
}

export default MidiManager;
