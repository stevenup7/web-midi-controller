import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import Keyboard from "./Keyboard";
import Slider from "./Slider";

interface Props {
  midiManager: MidiManager;
}

function MidiController({ midiManager }: Props) {
  const [bpm, setBPM] = useState(0);

  useEffect(() => {
    midiManager.addBeatHandler(() => {
      // on Beat
      setBPM(midiManager.clock.bpm);
      //   midiManager.sendNote(2, "C", 4);
    });
  }, []);

  const keyboardUp = (data: string) => {
    midiManager.noteUp(4, data);
  };
  const keyboardDown = (data: string) => {
    midiManager.noteDown(4, data);
  };
  const delayChange = (val: number) => {
    // cc 85 for digitakt
    midiManager.sendFXMessage(85, val - 1);
  };

  const delayFeedbackChange = (val: number) => {
    // cc 88 for digitakt
    midiManager.sendFXMessage(88, val - 1);
  };
  return (
    <div className="container text-left">
      <div className="row">
        <div className="col">fx channel </div>
        <div className="col"></div>
        <div className="col text-right">
          <span>BPM {bpm}</span>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Slider
            id="delaytime"
            min={1}
            max={128}
            value={24}
            onChange={delayChange}
          >
            Delay Time
          </Slider>
        </div>

        <div className="col">
          <Slider
            id="delayfeedback"
            min={1}
            max={128}
            value={24}
            onChange={delayFeedbackChange}
          >
            Delay Feedback
          </Slider>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Keyboard onDown={keyboardDown} onUp={keyboardUp}></Keyboard>
        </div>
      </div>
    </div>
  );
}
export default MidiController;
