import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import CheckboxGroup, { CheckboxItemData } from "./CheckboxGroup";
import Button from "./Button";
import { MIDIPORTNUMBERS } from "../Midi/MusicConstants";
import MidiChannelSelector from "./MidiChannelSelector";
import MidiMachineEditor from "./MidiMachineEditor";
import MidiMachine from "../Midi/MidiMachine";

interface Props {
  midiManager: MidiManager;
  onClose: () => void;
}

function MidiConfig({ midiManager, onClose }: Props) {
  const initVal: CheckboxItemData[] = [];

  const [inPortList, setInPorts] = useState(initVal);
  const [outPortList, setOutPorts] = useState(initVal);

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
    console.log(midiManager.fxChannels);

    currConfig.fxPortList = midiManager.fxChannels;
    localStorage.setItem("midi-manager-config", JSON.stringify(currConfig));
  };

  let currConfig = getLocalStorageConnectionData();

  useEffect(() => {
    setInPorts(midiManager.getSimplePortList("input"));
    setOutPorts(midiManager.getSimplePortList("output"));

    console.log(currConfig);

    for (const portId in currConfig.midiConnections) {
      if (midiManager.getPortById(portId)) {
        const portConfig = currConfig.midiConnections[portId];
        if (portConfig) {
          midiManager.listenToPort(portId);
        }
      }
    }
  }, []);

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

  const handleFXPortSelection = (selectedChannels: number[] | number): void => {
    if (typeof selectedChannels == "object") {
      midiManager.fxChannels = selectedChannels;
      saveSettingsConfig();
    }
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
      <MidiChannelSelector
        allowMultiple={true}
        defaultValues={midiManager.fxChannels}
        onSelectionChange={handleFXPortSelection}
      ></MidiChannelSelector>

      <hr />
      <h3>
        <i className="bi bi-device-ssd"></i> Machines
      </h3>
      <MidiMachineEditor
        midiManager={midiManager}
        midiMachine={new MidiMachine("New Machine")}
      ></MidiMachineEditor>
      <hr />
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
