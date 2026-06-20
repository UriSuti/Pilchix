import { useState } from "react";
import "./CategorySection.css";

function CategorySection({ categorias = [], cargando }) {
  const lista = categorias.slice(0, 6);
  const [activa, setActiva] = useState(0);

  return (
    <section className="lp-section" id="categorias">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <p className="lp-eyebrow">Explorá por estilo</p>
            <h2>Categorías</h2>
          </div>
        </div>

        {cargando ? (
          <p className="lp-empty">Cargando categorías...</p>
        ) : lista.length === 0 ? (
          <p className="lp-empty">No hay categorías para mostrar.</p>
        ) : (
          <div className="catacc">
            {lista.map((categoria, i) => (
              <article
                key={categoria.id_categoria}
                className={`catp ${i === activa ? "is-active" : ""}`}
                style={
                  categoria.imagen_categoria
                    ? { backgroundImage: `url(${categoria.imagen_categoria})` }
                    : undefined
                }
                onClick={() => setActiva(i)}
              >
                {!categoria.imagen_categoria && (
                  <span className="catp__placeholder">
                    {categoria.nombre?.slice(0, 1)}
                  </span>
                )}
                <div className="catp__label">
                  <b>{categoria.nombre}</b>
                  <span className="catp__cta">Explorar →</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategorySection;
