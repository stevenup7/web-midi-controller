import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import CheckboxGroup, { CheckboxItemData } from "./CheckboxGroup";
import Button from "./Button";
import { MIDIPORTNUMBERS } from "../Midi/MusicConstants";

interface Props {
  midiManager: MidiManager;
  onClose: () => void;
}

function MidiConfig({ midiManager, onClose }: Props) {
  const initVal: CheckboxItemData[] = [];
  const initialFxPortNumbers: CheckboxItemData[] = [];
  const [inPortList, setInPorts] = useState(initVal);
  const [outPortList, setOutPorts] = useState(initVal);
  const [fxPortList, setFxPorts] = useState(initialFxPortNumbers);

  useEffect(() => {
    setInPorts(midiManager.getSimplePortList("input"));
    setOutPorts(midiManager.getSimplePortList("output"));

    let currConfig = getLocalStorageConnectionData();
    console.log(currConfig);

    for (const portId in currConfig.midiConnections) {
      if (currConfig.midiConnections.hasOwnProperty(portId)) {
        const portConfig = currConfig.midiConnections[portId];
        if (portConfig) {
          midiManager.listenToPort(portId);
        }
      }
    }

    let fxPortNumbers: CheckboxItemData[] = [];
    for (let p = 0; p < MIDIPORTNUMBERS.length; p++) {
      const n = parseInt(MIDIPORTNUMBERS[p], 10) - 1;
      const connected = currConfig.fxPortList.indexOf(n) !== -1;
      fxPortNumbers.push({
        id: n.toString(),
        text: MIDIPORTNUMBERS[p],
        checked: connected,
      });
      if (connected) {
        midiManager.addFXChannel(n);
      }
    }
    setFxPorts(fxPortNumbers);
  }, []);

  const getLocalStorageConnectionData = () => {
    const currData = localStorage.getItem("midi-manager-config");
    let currConfig: {
      fxPortList: number[];
      midiConnections: { [key: string]: boolean };
    };

    if (currData !== null) {
      currConfig = JSON.parse(currData);
    } else {
      currConfig = { fxPortList: [], midiConnections: {} };
    }
    return currConfig;
  };
  const saveSettingsConfig = () => {
    let currConfig = getLocalStorageConnectionData();
    // combine the in and out ports
    let allPorts = inPortList.concat(outPortList);
    for (let p = 0; p < allPorts.length; p++) {
      currConfig.midiConnections[allPorts[p].id] = midiManager.getPortById(
        allPorts[p].id
      ).connected;
    }
    currConfig.fxPortList = midiManager.fxChannels;
    console.log(currConfig);
    localStorage.setItem("midi-manager-config", JSON.stringify(currConfig));
  };

  // handle the turning on and off ports
  // TODO: only listen for clock on one port
  const handleInPortSelection = (_text: string, id: string, state: boolean) => {
    if (state) {
      midiManager.listenToPort(id);
    } else {
      midiManager.closePort(id);
    }
    saveSettingsConfig();
  };

  const handleFXPortSelection = (_text: string, id: string, state: boolean) => {
    if (state) {
      midiManager.addFXChannel(parseInt(id, 10));
    } else {
      midiManager.removeFXChannel(parseInt(id, 10));
    }
    saveSettingsConfig();
  };

  // handle turning on and off a output port
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
    saveSettingsConfig();
  };

  return (
    <>
      <h3>
        <i className="bi bi-usb-plug"></i> Avaialable Midi Connections
      </h3>
      <br />
      <h4>
        <i className="bi bi-box-arrow-in-left"></i> Inputs
      </h4>
      <CheckboxGroup
        items={inPortList}
        onSelectItem={handleInPortSelection}
      ></CheckboxGroup>
      <br />
      <h4>
        <i className="bi bi-box-arrow-right"></i> Outputs
      </h4>
      <CheckboxGroup
        items={outPortList}
        onSelectItem={handleOutPortSelection}
      ></CheckboxGroup>
      <br />
      <h4>
        <i className="bi bi-soundwave"></i> FX Channels
      </h4>
      <CheckboxGroup
        style="default"
        items={fxPortList}
        onSelectItem={handleFXPortSelection}
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
