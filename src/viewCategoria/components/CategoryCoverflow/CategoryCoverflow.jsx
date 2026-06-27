import { useEffect, useRef } from "react";
import "./CategoryCoverflow.css";

const IconPrev = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconNext = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Ruleta 3D (coverflow) de categorías.
 * - categorias: [{ nombre, imagen, count, locales }]
 * - activeIndex: índice activo
 * - onChange(i): cambiar de categoría
 */
function CategoryCoverflow({ categorias = [], activeIndex = 0, onChange }) {
  const n = categorias.length;
  const dragX = useRef(null);

  // teclado ← →
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") onChange?.(activeIndex + 1);
      if (e.key === "ArrowLeft") onChange?.(activeIndex - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, onChange]);

  if (n === 0) return null;

  const activa = categorias[((activeIndex % n) + n) % n];

  // estilo 3D de cada card según su distancia (circular) al activo
  function cardStyle(i) {
    let off = i - activeIndex;
    if (off > n / 2) off -= n;
    if (off < -n / 2) off += n;
    const abs = Math.abs(off);
    const x = off * 175;
    const z = -abs * 220;
    const rot = off === 0 ? 0 : off < 0 ? 38 : -38;
    const scale = off === 0 ? 1.08 : 0.9;
    const visible = abs <= 2;
    return {
      transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg) scale(${scale})`,
      opacity: visible ? 1 : 0,
      zIndex: 100 - abs,
      pointerEvents: visible ? "auto" : "none",
    };
  }

  function onPointerDown(e) {
    dragX.current = e.clientX;
  }
  function onPointerUp(e) {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    if (dx > 60) onChange?.(activeIndex - 1);
    else if (dx < -60) onChange?.(activeIndex + 1);
    dragX.current = null;
  }

  return (
    <section className="catflow">
      <p className="catflow__eyebrow">Explorá por categoría</p>

      <div
        className="catflow__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (dragX.current = null)}
      >
        <button
          className="catflow__arrow catflow__arrow--prev"
          type="button"
          aria-label="Categoría anterior"
          onClick={() => onChange?.(activeIndex - 1)}
        >
          <IconPrev />
        </button>

        <div className="catflow__track">
          {categorias.map((cat, i) => (
            <article
              key={cat.id_categoria ?? cat.nombre}
              className={`cv-card ${i === activeIndex ? "is-active" : ""}`}
              style={cardStyle(i)}
              onClick={() => onChange?.(i)}
            >
              {cat.imagen ? (
                <img src={cat.imagen} alt={cat.nombre} draggable="false" />
              ) : (
                <span className="cv-card__placeholder">{cat.nombre?.slice(0, 1)}</span>
              )}
              <span className="cv-card__name">{cat.nombre}</span>
            </article>
          ))}
        </div>

        <button
          className="catflow__arrow catflow__arrow--next"
          type="button"
          aria-label="Categoría siguiente"
          onClick={() => onChange?.(activeIndex + 1)}
        >
          <IconNext />
        </button>
      </div>

      <div className="catflow__info">
        <h1 className="catflow__title">{activa.nombre}</h1>
        <p className="catflow__meta">
          <b>{activa.count} productos</b> · {activa.locales} {activa.locales === 1 ? "local" : "locales"}
        </p>
        <div className="catflow__dots">
          {categorias.map((cat, i) => (
            <button
              key={cat.id_categoria ?? i}
              type="button"
              className={`catflow__dot ${i === activeIndex ? "is-active" : ""}`}
              aria-label={`Ir a ${cat.nombre}`}
              onClick={() => onChange?.(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryCoverflow;
