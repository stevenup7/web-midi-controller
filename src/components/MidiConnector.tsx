import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import CheckboxGroup, { CheckboxItemData } from "./CheckboxGroup";
import Keyboard from "./Keyboard";
import Slider from "./Slider";

let midiManager: MidiManager;

const MidiConnector = () => {
  const [bpm, setBPM] = useState(0);
  const initVal: CheckboxItemData[] = [];

  const [inPortList, setInPorts] = useState(initVal);
  const [outPortList, setOutPorts] = useState(initVal);

  useEffect(() => {
    midiManager = new MidiManager(
      () => {
        setInPorts(midiManager.getSimplePortList("input"));
        setOutPorts(midiManager.getSimplePortList("output"));
      },
      () => {
        setBPM(midiManager.clock.bpm);
        midiManager.sendNote(2, "C", 4);
      }
    );

    // cleanup function
    return () => {
      midiManager.reset();
    };
  }, []);

  const handleInPortSelection = (_text: string, id: string, state: boolean) => {
    if (state) {
      midiManager.listenToPort(id);
    } else {
      midiManager.closePort(id);
    }
  };
  const handleOutPortSelection = (_text: string, id: string) => {
    midiManager.listenToPort(id);
  };
  const keyboardClick = (_data: string) => {
    // do nothing
  };

  const keyboardUp = (data: string) => {
    midiManager.noteUp(3, data, 4);
  };
  const keyboardDown = (data: string) => {
    midiManager.noteDown(3, data, 4);
  };
  const delayChange = (val: number) => {
    // cc 85 for digitakt
    midiManager.sendCC(8, 85, val);
  };

  const delayFeedbackChange = (val: number) => {
    // cc 88 for digitakt
    midiManager.sendCC(8, 88, val);
  };
  return (
    <>
      <span>BPM {bpm}</span>

      <h4>Inputs</h4>

      <CheckboxGroup
        items={inPortList}
        onSelectItem={handleInPortSelection}
      ></CheckboxGroup>
      <h4>Outputs</h4>

      <CheckboxGroup
        items={outPortList}
        onSelectItem={handleOutPortSelection}
      ></CheckboxGroup>

      <Slider
        id="delaytime"
        min={0}
        max={127}
        value={24}
        onChange={delayChange}
      >
        Delay Time
      </Slider>
      <Slider
        id="delayfeedback"
        min={0}
        max={127}
        value={24}
        onChange={delayFeedbackChange}
      >
        Delay Feedback
      </Slider>

      <Keyboard
        onDown={keyboardDown}
        onUp={keyboardUp}
        onClick={keyboardClick}
      ></Keyboard>
    </>
  );
};

export default MidiConnector;
