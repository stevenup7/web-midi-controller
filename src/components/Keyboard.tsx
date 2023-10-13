import { NOTES } from "../Midi/MusicConstants";
import Button from "./Button";

interface Props {
  onClick: (data: string) => void;
  onDown: (data: string) => void;
  onUp: (data: string) => void;
}

const Keyboard = ({ onDown, onUp, onClick }: Props) => {
  return (
    <>
      {NOTES.map((n) => {
        return (
          <span key={n}>
            <Button data={n} onClick={onClick} onDown={onDown} onUp={onUp}>
              {n}
            </Button>
            &nbsp;
          </span>
        );
      })}
    </>
  );
};

export default Keyboard;
