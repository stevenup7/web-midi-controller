import { useState } from "react";

interface Props {
  onHide: () => void;
}

function LandingPage(props: Props) {
  const defaultWrapperClass = "px-4 py-5 my-5 text-center";
  const [wrapperClass, setWrapperClass] = useState(defaultWrapperClass);

  const hide = () => {
    setWrapperClass(defaultWrapperClass + " d-none");
    props.onHide();
  };

  return (
    <>
      <div className={wrapperClass}>
        <h1 className="display-5 fw-bold">Web Midi Controller</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            This is supposed to be the missing controller for the digi boxes by
            elektron.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 gap-3"
              onClick={hide}
            >
              Continue to config screen
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Buy me some coffffffeeee | get more info about the project{" "}
              <i class="bi bi-github"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default LandingPage;
