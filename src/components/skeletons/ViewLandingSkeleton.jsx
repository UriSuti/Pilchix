import "./skeletons.css";

function ViewLandingSkeleton() {
  return (
    <div className="skl">
      <div className="sk skl-hero" />
      {[0, 1].map((s) => (
        <section className="sk-wrap skl-sec" key={s}>
          <div className="sk skl-eyebrow" />
          <div className="sk skl-h2" />
          <div className="skl-row">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="sk skl-card" key={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default ViewLandingSkeleton;
