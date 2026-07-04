import "./skeletons.css";

function ViewLocalSkeleton() {
  return (
    <div className="skl">
      <div className="sk skl-localhero" />
      <div className="sk-wrap">
        <div className="sk skl-bar" />
        <div className="skl-row">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="sk skl-card" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewLocalSkeleton;
