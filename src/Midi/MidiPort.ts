type MidiPortDirection = "input" | "output";

class MidiPort {
  id: string;
  manufacturer: string;
  name: string;
  version: string;
  direction: MidiPortDirection;

  constructor(
    id: string,
    manufacturer: string,
    name: string,
    version: string,
    direction: MidiPortDirection
  ) {
    this.id = id;
    this.manufacturer = manufacturer;
    this.name = name;
    this.version = version;
    this.direction = direction;
  }

  toString(): string {
    return this.name + " : " + this.direction;
  }

  log() {
    console.log(
      `Input port [type:'${this.direction}']` +
        ` id:'${this.id}'` +
        ` manufacturer:'${this.manufacturer}'` +
        ` name:'${this.name}'` +
        ` version:'${this.version}'`
    );
  }
}
export type { MidiPortDirection };
export default MidiPort;
