import { useEffect, useState } from "react";
import { OCTAVE } from "../Midi/MusicConstants";

import "./keyboard.css";

interface KeyboardProps {
  onDown: (data: string) => void;
  onUp: (data: string) => void;
}

interface KeyProps {
  note: string;
  onDown: (data: string) => void;
  onUp: (data: string) => void;
}
const handleContextMenu = (e: any) => {
  console.log("blocking context menu now");
  e.preventDefault();
};

function PainoKey({ note, onUp, onDown }: KeyProps) {
  const getNoteClass = (note: string) => {
    if (note.indexOf("#") > 0) {
      return "paino-key black-paino-key";
    } else {
      return "paino-key";
    }
  };
  return (
    <div
      className={getNoteClass(note)}
      onMouseDown={() => {
        onDown(note);
      }}
      onMouseUp={() => {
        onUp(note);
      }}
      onTouchStart={() => {
        onDown(note);
      }}
      onTouchEnd={() => {
        onUp(note);
      }}
    >
      <span onContextMenu={handleContextMenu} onSelect={handleContextMenu}>
        {note.indexOf("C") == 0 && note.indexOf("#") == -1 ? note : null}
      </span>
    </div>
  );
}

const Keyboard = ({ onDown, onUp }: KeyboardProps) => {
  // TODO: remove right click on key hold (see below )
  // document.addEventListener("contextmenu", (event) => event.preventDefault());
  let initVal: string[] = [];
  const [keyList, setKeyList] = useState(initVal);
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
  return (
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
