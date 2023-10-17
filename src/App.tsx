import { useState } from "react";
import LandingPage from "./components/LandingPage";
import MidiConnector from "./components/MidiConnector";

function App() {
  const [shownItem, setShownItem] = useState("landing");

  const landingHidden = () => {
    setShownItem("midi");
  };

  return (
    <div className="container">
      {shownItem == "landing" ? (
        <LandingPage onHide={landingHidden}></LandingPage>
      ) : null}

      {shownItem == "midi" ? <MidiConnector></MidiConnector> : null}
    </div>
  );
}

export default App;
