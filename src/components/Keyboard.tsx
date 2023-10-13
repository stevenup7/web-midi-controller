import { NOTES } from "../Midi/MusicConstants";
import Button from "./Button";

interface Props {
  onClick: (data: string) => void;
}

const Keyboard = ({ onClick }: Props) => {
  const clickHandler = (data: string): void => {
    onClick(data);
  };
  return (
    <>
      {NOTES.map((n) => {
        return (
          <Button key={n} data={n} onClick={clickHandler}>
            {n}
          </Button>
        );
      })}
    </>
  );
};

export default Keyboard;
