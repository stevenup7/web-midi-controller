import { useState } from "react";
import ScreenLandingPage from "./components/ScreenLandingPage";
import MidiConnector from "./components/MidiWrapper";

function App() {
  const [shownItem, setShownItem] = useState("landing");

  const landingHidden = () => {
    setShownItem("midi");
  };

  return (
    <div className="container">
      {shownItem == "landing" ? (
        <ScreenLandingPage onHide={landingHidden}></ScreenLandingPage>
      ) : null}

      {shownItem == "midi" ? <MidiConnector></MidiConnector> : null}
    </div>
  );
}

export default App;
