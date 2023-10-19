interface Props {
  onHide: () => void;
}

function ScreenLandingPage(props: Props) {
  return (
    <>
      <div className="containerpx-4 py-5 my-5 text-center">
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
              onClick={props.onHide}
            >
              Continue to config screen
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => {
                const GITHUBLOCATION =
                  "https://github.com/stevenup7/web-midi-controller";
                document.location.href = GITHUBLOCATION;
              }}
            >
              See the project on github
              <i className="bi bi-github"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ScreenLandingPage;
