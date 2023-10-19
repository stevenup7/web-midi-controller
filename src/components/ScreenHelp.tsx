interface Props {
  onHide: () => void;
}

function ScreenHelp(_props: Props) {
  return (
    <>
      <div className="container">
        <h4>
          <i className="bi bi-question-square"></i>
          &nbsp;Oh Halp
        </h4>

        <p className="lead mb-4">
          Project is very new and VERY subject to change.
        </p>
        <p>Table of contents to go here</p>
      </div>
    </>
  );
}
export default ScreenHelp;
