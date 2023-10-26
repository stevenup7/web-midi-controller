import { useState } from "react";
import MidiMachine from "../Midi/MidiMachine";
import MidiManager from "../Midi/MidiManager";
import MidiChannelSelector from "./MidiChannelSelector";
import Button from "./Button";

interface Props {
  midiManager: MidiManager;
  midiMachine: MidiMachine;
}
function MidiMachineEditor({ midiManager, midiMachine }: Props) {
  console.log(midiMachine, midiManager);
  const [formState, setFormState] = useState(midiMachine.getProps());

  const handleUpdate = () => {
    midiMachine.update(formState);

    alert(midiMachine.toJSON());
  };

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="machineName  " className="form-label">
          Machine Name
        </label>
        <input
          type="text"
          className="form-control"
          id="machineName"
          aria-describedby="nameHelp"
          value={formState.name}
          onChange={(event) => {
            setFormState({ ...formState, name: event.target.value });
          }}
        />
        <div id="nameHelp" className="form-text">
          A name for this machine eg Elektron Digitakt.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="midi-machine-channel" className="form-label">
          Machine Channels
        </label>
        <MidiChannelSelector
          id="midi-machine-channel"
          allowMultiple={true}
          defaultValues={formState.channels}
          onSelectionChange={(selection) => {
            setFormState({
              ...midiMachine,
              channels: selection,
            });
          }}
        ></MidiChannelSelector>
        <div id="channel-help" className="form-text">
          Midi Channels connected to this machine
        </div>
      </div>
      {formState.channels.map((c) => {
        return (
          <div className="mb-3" key={c}>
            <label htmlFor="machine-channel-{c}" className="form-label">
              Midi Channel {c + 1} alias
            </label>
            <input
              type="text"
              className="form-control"
              id="machine-channel-{c}"
              defaultValue={formState.channelAliases[c]}
              onChange={(event) => {
                console.log(event.target.value, formState);
                let channelAliases = formState.channelAliases;
                channelAliases[c] = event.target.value;
                setFormState({ ...formState, channelAliases: channelAliases });
              }}
            />
          </div>
        );
      })}
      <Button onClick={handleUpdate}>Save Machine</Button>
    </form>
  );
}
export default MidiMachineEditor;
