import { A0, NOTES } from "./MusicConstants";

const NOTE_ON = 144; // 1001nnnn
const NOTE_OFF = 128; // 1000nnnn
const CC_SEND = 176; // 1011nnnn

class MidiMessage {
  constructor() {}
  // TODO velocity

  ccValue(channel: number, ccNumber: number, ccValue: number) {
    return [CC_SEND | channel, ccNumber, ccValue];
  }
  parseNote(
    noteDescription: string
  ): [noteoffset: number, octave: number] | false {
    const noteRe = /([A-G]#?)([0-9])/i;
    const match = noteDescription.match(noteRe);
    if (match) {
      const octave = parseInt(match[2], 10);
      const noteoffset = NOTES.indexOf(match[1]);
      return [noteoffset, octave];
    }
    return false;
  }

  makeNote(type: number, channel: number, note: string): number[] {
    const noteInfo = this.parseNote(note);
    if (noteInfo) {
      return [type | channel, A0 + noteInfo[0] + noteInfo[1] * 12, 127];
    } else {
      throw new Error("Not a valid note");
    }
  }
  noteOn(channel: number, note: string): number[] {
    return this.makeNote(NOTE_ON, channel, note);
  }
  noteOff(channel: number, note: string): number[] {
    return this.makeNote(NOTE_OFF, channel, note);
  }
}

export default MidiMessage;
