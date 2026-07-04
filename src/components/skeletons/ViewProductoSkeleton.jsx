import "./skeletons.css";

function ViewProductoSkeleton() {
  return (
    <div className="skl">
      <div className="sk-wrap skl-pdp">
        <div className="skl-gallery">
          <div className="skl-thumbs">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="sk skl-thumb" key={i} />
            ))}
          </div>
          <div className="sk skl-main" />
        </div>

        <div className="skl-info">
          <div className="sk skl-line skl-line--brand" />
          <div className="sk skl-line skl-line--title" />
          <div className="sk skl-line skl-line--price" />
          <div className="sk skl-block" />
          <div className="sk skl-block" />
          <div className="sk skl-btn" />
        </div>
      </div>
    </div>
  );
}

export default ViewProductoSkeleton;
