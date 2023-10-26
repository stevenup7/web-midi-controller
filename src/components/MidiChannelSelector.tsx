import { MIDIPORTNUMBERS } from "../Midi/MusicConstants";

interface Props {
  id?: string;
  allowMultiple: boolean;
  defaultValues: number[] | number;
  onSelectionChange: (selection: number[]) => void;
}
function MidiChannelSelector({
  id = "midi-selector",
  allowMultiple,
  defaultValues,
  onSelectionChange,
}: Props) {
  let defaultsAsStrings;
  if (typeof defaultValues == "object") {
    defaultsAsStrings = defaultValues.map((item: number) => {
      return item.toString();
    });
  } else {
    defaultsAsStrings = defaultValues.toString();
  }
  console.log(defaultsAsStrings, defaultValues);

  return (
    <select
      id={id}
      className="form-select"
      multiple={allowMultiple}
      aria-label="Select a MIDI Port"
      defaultValue={defaultsAsStrings}
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
        // let selected = false;
        // if (defaultValues.indexOf(asInt) !== -1) {
        //   selected = true;
        // }

        return (
          // <option selected={selected} key={asInt} value={asInt}>
          <option key={asInt} value={asInt}>
            {i}
          </option>
        );
      })}
    </select>
  );
}
export default MidiChannelSelector;
