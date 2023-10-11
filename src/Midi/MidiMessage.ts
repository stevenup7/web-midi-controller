// midi message specification
// https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message

class MidiMessage {
  message: Uint8Array;
  type: string;
  port: number;
  note: number;
  velocity: number;

  constructor(message: Uint8Array) {
    this.message = message;
    this.type = "unknown";
    this.port = -1;
    this.note = -1;
    this.velocity = 0;
    this.parse();
  }

  dec2bin(dec: number): string {
    return (dec >>> 0).toString(2);
  }

  noteToString(): string {
    const NOTES = [
      "A",
      "A#",
      "B",
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#,",
    ];
    // A0 = 21

    return NOTES[(this.note - 21) % 12];
  }
  noteToOctave(): number {
    // A0 = 21
    // TODO: this is wrong (octave 0 starts at C0 to A0)
    return Math.floor((this.note - 21) / 12);
  }

  debugPrint(): void {
    console.log(
      this.type,
      "port",
      this.port,
      "note",
      this.noteToString(),
      "oct",
      this.noteToOctave(),
      this.dec2bin(this.message[0])
    );
  }

  parse(): string {
    switch (this.message[0]) {
      case 248:
        this.type = "clock";
        break;
      case 252:
        this.type = "stop";
        break;
      case 250:
        this.type = "start";
        break;
      default:
        this.type = "unknown";
    }
    if (this.type === "unknown") {
      let binaryMessage = this.dec2bin(this.message[0]);
      let messageType = binaryMessage.substring(0, 4);
      let midiPortNumber = binaryMessage.substring(4, 8);
      this.port = parseInt(midiPortNumber, 2) + 1;
      this.note = this.message[1];
      this.velocity = this.message[2];
      switch (messageType) {
        case "1001":
          this.type = "noteoff";
          break;
        case "1000":
          this.type = "noteon";
          break;
        default:
          this.type = "unknown";
          break;
      }
    }
    return this.type;
  }
}

export default MidiMessage;
