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

    let currConfig = getLocalStorageConnectionData();
    console.log(currConfig);

    for (const portId in currConfig) {
      if (Object.prototype.hasOwnProperty.call(currConfig, portId)) {
        const portConfig = currConfig[portId];
        if (portConfig) {
          console.log(portId, portConfig);
          // const port = midiManager.getPortById(portId);
          midiManager.listenToPort(portId);
        }
      }
    }
  }, []);

  const getLocalStorageConnectionData = () => {
    const currData = localStorage.getItem("port-config");
    let currConfig: { [key: string]: boolean };
    if (currData !== null) {
      currConfig = JSON.parse(currData);
    } else {
      currConfig = {};
    }
    return currConfig;
  };
  const savePortConfig = () => {
    let currConfig = getLocalStorageConnectionData();
    // combine the in and out ports
    let allPorts = inPortList.concat(outPortList);
    for (let p = 0; p < allPorts.length; p++) {
      currConfig[allPorts[p].id] = midiManager.getPortById(
        allPorts[p].id
      ).connected;
    }
    console.log(currConfig);

    localStorage.setItem("port-config", JSON.stringify(currConfig));
  };

  // handle the turning on and off ports
  // TODO: only listen for clock on one port
  const handleInPortSelection = (_text: string, id: string, state: boolean) => {
    if (state) {
      midiManager.listenToPort(id);
    } else {
      midiManager.closePort(id);
    }
    savePortConfig();
  };

  // handle turning on and off a output port
  // TODO: turn back off
  // TODO: change call (should be open not listen)
  const handleOutPortSelection = (
    _text: string,
    id: string,
    state: boolean
  ) => {
    if (state) {
      midiManager.listenToPort(id);
    } else {
      midiManager.closePort(id);
    }
    savePortConfig();
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
