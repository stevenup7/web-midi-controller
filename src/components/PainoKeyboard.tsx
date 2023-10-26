import { useEffect, useState } from "react";
import { OCTAVE } from "../Midi/MusicConstants";

import "./paino-keyboard.css";
import PainoKey from "./PainoKeyboardKey";
import MidiChannelSelector from "./MidiChannelSelector";

interface KeyboardProps {
  onDown: (channel: number, note: string) => void;
  onUp: (channel: number, note: string) => void;
}

const Keyboard = ({ onDown, onUp }: KeyboardProps) => {
  let initVal: string[] = [];
  const [keyList, setKeyList] = useState(initVal);
  const [midiChannel, setMidiChannel] = useState(0);
  // set up the keyboard
  useEffect(() => {
    let allKeys: string[] = [];
    for (let oct = 0; oct < 8; oct++) {
      for (let n = 0; n < OCTAVE.length; n++) {
        const currNote = OCTAVE[n];
        allKeys.push(currNote + oct);
      }
    }
    setKeyList(allKeys);
  }, []);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
  };
  const handleChannelSelection = (selectedChannel: number[]) => {
    setMidiChannel(selectedChannel[0]);
  };
  return (
    <>
      <div className="keyboard-config">
        <MidiChannelSelector
          allowMultiple={false}
          defaultValues={-1}
          onSelectionChange={handleChannelSelection}
        ></MidiChannelSelector>
      </div>

      <div
        className="keyboard-wrapper"
        onContextMenu={handleContextMenu}
        onSelect={handleContextMenu}
      >
        {keyList.map((n) => {
          return (
            <PainoKey
              key={n}
              note={n}
              onUp={() => {
                onUp(midiChannel, n);
              }}
              onDown={() => {
                onDown(midiChannel, n);
              }}
            ></PainoKey>
          );
        })}
        <hr />
      </div>
    </>
  );
};

export default Keyboard;

// <span key={n}>
//   <Button data={n} onClick={onClick}>
//     {n}
//   </Button>
//   &nbsp;
// </span>;
