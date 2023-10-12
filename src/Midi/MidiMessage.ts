import { A0, NOTES } from "./MusicConstants";

const NOTE_ON = 144;
const NOTE_OFF = 128;

class MidiMessage {
  constructor() {}
  // TODO velocity
  noteOn(channel: number, note: string): number[] {
    const int_1 = NOTE_ON | channel;
    const noteRe = /([A-G]#?)([0-9])/i;
    const match = note.match(noteRe);
    if (match) {
      const octave = parseInt(match[2], 10);
      const noteoffset = NOTES.indexOf(match[1]);
      return [int_1, A0 + noteoffset + octave * 12, 127];
    }
    return [];
  }
  noteOff(channel: number, note: string): number[] {
    const int_1 = NOTE_OFF | channel;
    const noteRe = /([A-G]#?)([0-9])/i;
    const match = note.match(noteRe);
    if (match) {
      console.log(match[1]);
      const octave = parseInt(match[2], 10);
      const noteoffset = NOTES.indexOf(match[1]);
      return [int_1, A0 + noteoffset + octave * 12, 127];
    }
    return [];
  }
}

export default MidiMessage;
