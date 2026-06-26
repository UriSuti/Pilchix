import "./OverlayCarga.css";

function OverlayCarga({ visible }) {
  return (
    <div
      className={`overlay-carga ${visible ? "overlay-carga--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="overlay-carga__spinner" />
    </div>
  );
}

export default OverlayCarga;