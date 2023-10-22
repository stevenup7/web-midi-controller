import { useEffect, useState } from "react";
import { OCTAVE } from "../Midi/MusicConstants";

import "./paino-keyboard.css";
import PainoKey from "./PainoKeyboardKey";

interface KeyboardProps {
  onDown: (data: string) => void;
  onUp: (data: string) => void;
}

const Keyboard = ({ onDown, onUp }: KeyboardProps) => {
  let initVal: string[] = [];
  const [keyList, setKeyList] = useState(initVal);
  // set up the keyboard
  useEffect(() => {
    let allKeys: string[] = [];
    for (let oct = 3; oct < 8; oct++) {
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
  return (
    <div
      className="keyboard-wrapper"
      onContextMenu={handleContextMenu}
      onSelect={handleContextMenu}
    >
      <div className="keyboard-config">config</div>
      {keyList.map((n) => {
        return (
          <PainoKey
            key={n}
            note={n}
            onUp={() => {
              onUp(n);
            }}
            onDown={() => {
              onDown(n);
            }}
          ></PainoKey>
        );
      })}
      <hr />
    </div>
  );
};

export default Keyboard;

// <span key={n}>
//   <Button data={n} onClick={onClick}>
//     {n}
//   </Button>
//   &nbsp;
// </span>;
