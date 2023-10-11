import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import CheckboxGroup, { CheckboxItemData } from "./CheckboxGroup";

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
        setBPM(midiManager.bpm);
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
  const handleOutPortSelection = (_text: string, _id: string) => {
    alert("not done");
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
    </>
  );
};

export default MidiConnector;
