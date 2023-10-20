import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import "./barlights.css";

interface Props {
  midiManager: MidiManager;
}

function BarLights(props: Props) {
  let steps = [];
  const beatHandler = (beatNumber: number) => {
    console.log("this is a beat");
    setCurrBeat(beatNumber % 16);
  };

  const [currBeat, setCurrBeat] = useState(0);
  useEffect(() => {
    props.midiManager.addBeatHandler(beatHandler);
    // console.log("effffect");
  }, []);

  for (let s = 0; s < 16; s++) {
    steps.push(s);
  }
  const getClassName = (i: number): string => {
    if (i === currBeat) {
      if (i % 4 === 0) {
        return "bi bi-record-fill barlight current-beat4th";
      } else {
        return "bi bi-record-fill barlight current-beat";
      }
    } else {
      return "bi bi-record-fill barlight";
    }
  };
  return (
    <div>
      {steps.map((item, i) => {
        return <i key={item} className={getClassName(i)}></i>;
      })}
    </div>
  );
}
export default BarLights;
