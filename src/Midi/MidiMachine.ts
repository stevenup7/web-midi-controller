import MidiPort from "./MidiPort";

interface MidiMachineProps {
  name: string;
  portId: string;
  channels: number[];
  channelAliases: string[];
}
class MidiMachine {
  name: string;
  port?: MidiPort;
  portId: string;
  channels: number[];
  channelAliases: string[];

  constructor(name: string) {
    this.name = name;
    this.channels = [];
    this.channelAliases = [];
    this.portId = "unset";
  }
  update(data: MidiMachineProps): void {
    this.name = data.name;
    this.channels = data.channels;
    this.channelAliases = data.channelAliases;
  }
  getProps(): MidiMachineProps {
    const p: MidiMachineProps = {
      name: this.name,
      portId: this.portId,
      channels: this.channels,
      channelAliases: this.channelAliases,
    };
    return p;
  }
  toJSON(): string {
    return `{
name: ${this.name}, 
channels: ${JSON.stringify(this.channels)},
channelAliases: ${JSON.stringify(this.channelAliases)}
        }`;
  }
}

export default MidiMachine;
