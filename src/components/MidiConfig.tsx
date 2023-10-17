import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import CheckboxGroup, { CheckboxItemData } from "./CheckboxGroup";
import Button from "./Button";

interface Props {
  midiManager: MidiManager;
  onClose: () => void;
}

function MidiConfig({ midiManager, onClose }: Props) {
  const initVal: CheckboxItemData[] = [];
  const [inPortList, setInPorts] = useState(initVal);
  const [outPortList, setOutPorts] = useState(initVal);

  useEffect(() => {
    setInPorts(midiManager.getSimplePortList("input"));
    setOutPorts(midiManager.getSimplePortList("output"));
  }, []);

  // handle the turning on and off ports
  // TODO: only listen for clock on one port
  const handleInPortSelection = (_text: string, id: string, state: boolean) => {
    if (state) {
      midiManager.listenToPort(id);
    } else {
      midiManager.closePort(id);
    }
  };

  // handle turning on and off a output port
  // TODO: turn back off
  // TODO: change call (should be open not listen)
  const handleOutPortSelection = (_text: string, id: string) => {
    midiManager.listenToPort(id);
  };

  return (
    <>
      <h3>
        <i className="bi bi-usb-plug"></i> Avaialable Midi Connections
      </h3>

      <h4>
        <i className="bi bi-box-arrow-in-left"></i> Inputs
      </h4>
      <CheckboxGroup
        items={inPortList}
        onSelectItem={handleInPortSelection}
      ></CheckboxGroup>

      <h4>
        <i className="bi bi-box-arrow-right"></i> Outputs
      </h4>

      <CheckboxGroup
        items={outPortList}
        onSelectItem={handleOutPortSelection}
      ></CheckboxGroup>
      <hr></hr>
      <Button
        onClick={() => {
          onClose();
        }}
      >
        Done
      </Button>
    </>
  );
}

export default MidiConfig;
