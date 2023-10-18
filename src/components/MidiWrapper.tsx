import { useEffect, useState } from "react";
import MidiManager from "../Midi/MidiManager";
import MidiConfig from "./MidiConfig";
import MidiController from "./MidiController";

let midiManager: MidiManager;

const MidiConnector = () => {
  const [displayMode, setDisplayMode] = useState("none");
  useEffect(() => {
    // create a new MidiManager Object
    // initialise it if allowed
    // TODO: display meaningful errors if it does not work
    midiManager = new MidiManager(() => {
      // Called when the midi connection has been initialized
      // this means the browser supports midi
      setDisplayMode("config");
    });

    // cleanup function
    return () => {
      midiManager.reset();
    };
  }, []);

  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <span className="fs-4">Midi Controller</span>
          </a>

          <ul className="nav nav-pills">
            <li className="nav-item">
              <a
                href="#"
                onClick={() => {
                  setDisplayMode("controller");
                }}
                className={
                  displayMode == "controller" ? "nav-link active" : "nav-link"
                }
                aria-current="page"
              >
                Controller
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={
                  displayMode == "config" ? "nav-link active" : "nav-link"
                }
                onClick={() => {
                  setDisplayMode("config");
                }}
              >
                Config
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Help
              </a>
            </li>
          </ul>
        </header>

        {displayMode == "config" ? (
          <MidiConfig
            midiManager={midiManager}
            onClose={() => {
              setDisplayMode("controller");
            }}
          ></MidiConfig>
        ) : null}

        {displayMode == "controller" ? (
          <MidiController midiManager={midiManager}></MidiController>
        ) : null}
      </div>
    </>
  );
};

export default MidiConnector;
