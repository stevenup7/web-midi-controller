import { useState } from "react";

interface PainoKeyProps {
  note: string;
  onDown: (data: string) => void;
  onUp: (data: string) => void;
}

// this should stop the context menu appearing when you hold a touch on a key
// TODO: seems to not prevent selection on the span with the key name
const handleContextMenu = (e: any) => {
  e.preventDefault();
};

function PainoKey({ note, onUp, onDown }: PainoKeyProps) {
  const [isActive, setIsActive] = useState(false);

  const getNoteClass = (note: string) => {
    let cls = "paino-key";

    if (note.indexOf("#") > 0) {
      cls += " black-paino-key";
    }
    if (isActive) {
      cls += " active-key";
    }
    return cls;
  };

  const keyUp = (note: string) => {
    setIsActive(false);
    onUp(note);
  };
  const keyDown = (note: string) => {
    setIsActive(true);
    onDown(note);
  };
  return (
    <div
      className={getNoteClass(note)}
      onMouseDown={() => {
        keyDown(note);
      }}
      onMouseUp={() => {
        keyUp(note);
      }}
      onMouseOut={() => {
        keyUp(note);
      }}
      onMouseOver={(event: React.MouseEvent<HTMLDivElement>) => {
        if (event.buttons == 1) {
          keyDown(note);
        }
      }}
      onTouchStart={() => {
        keyDown(note);
      }}
      onTouchEnd={() => {
        keyUp(note);
      }}
    >
      <span onContextMenu={handleContextMenu} onSelect={handleContextMenu}>
        {note.indexOf("C") == 0 && note.indexOf("#") == -1 ? note : note}
      </span>
    </div>
  );
}

export default PainoKey;
