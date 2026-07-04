import "./skeletons.css";

function ViewCategoriaSkeleton() {
  return (
    <div className="skl">
      <div className="sk skl-cover" />
      <div className="sk-wrap">
        <div className="sk skl-bar" />
        <div className="skl-catlayout">
          <div className="sk skl-side" />
          <div className="skl-row3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="sk skl-card" key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCategoriaSkeleton;
