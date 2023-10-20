import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import "./barlights.css";

interface Props {
  midiManager: MidiManager;
}

function BarLights(props: Props) {
  const [currBeat, setCurrBeat] = useState(0);
  const [barCount, setBarCount] = useState(0);
  let steps = [];
  const beatHandler = (beatNumber: number) => {
    console.log("this is a beat");
    setCurrBeat(beatNumber % 16);
    setBarCount(Math.floor(beatNumber / 16));
  };
  useEffect(() => {
    props.midiManager.addBeatHandler(beatHandler);
  }, []);

  for (let s = 0; s < 16; s++) {
    steps.push(s);
  }

  const getClassName = (i: number): string => {
    let itemClass = "bi bi-record-fill barlight";
    if (i % 4 === 0) {
      itemClass += " beat4th";
    }
    if (i === currBeat) {
      itemClass += " current-beat";
    }
    return itemClass;
  };
  return (
    <div>
      <div>Bar: {barCount}</div>
      {steps.map((item, i) => {
        return <i key={item} className={getClassName(i)}></i>;
      })}
    </div>
  );
}
export default BarLights;
