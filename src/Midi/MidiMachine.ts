import MidiPort from "./MidiPort";

class MidiMachine {
  name: string;
  port: MidiPort;
  channels: number[];
  constructor(name: string, port: MidiPort, channels: number[]) {
    this.name = name;
    this.port = port;
    this.channels = channels;
  }
}

export default MidiMachine;
