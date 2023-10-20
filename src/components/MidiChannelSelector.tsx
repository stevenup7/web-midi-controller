import { MIDIPORTNUMBERS } from "../Midi/MusicConstants";

interface Props {
  allowMultiple: boolean;
  defaultValues: number[];
  onSelectionChange: (selection: number[]) => void;
}
function MidiChannelSelector({
  allowMultiple,
  defaultValues,
  onSelectionChange,
}: Props) {
  return (
    <select
      className="form-select"
      multiple={allowMultiple}
      aria-label="Select a MIDI Port"
      onChange={(event) => {
        let results = [];
        for (let o = 0; o < event.target.options.length; o++) {
          if (event.target.options[o].selected) {
            results.push(parseInt(event.target.options[o].value));
          }
        }
        onSelectionChange(results);
      }}
    >
      {MIDIPORTNUMBERS.map((i) => {
        const asInt = parseInt(i, 10) - 1;
        let selected = false;
        if (defaultValues.indexOf(asInt) !== -1) {
          selected = true;
        }

        return (
          <option selected={selected} value={asInt}>
            {i}
          </option>
        );
      })}
    </select>
  );
}
export default MidiChannelSelector;
