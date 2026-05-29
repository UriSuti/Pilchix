import { useState } from "react";
import "./CategorySection.css";

function CategorySection({ categorias = [], cargando }) {
  const [cantidadVisible, setCantidadVisible] = useState(5);

  const categoriasVisibles = categorias.slice(0, cantidadVisible);

  function mostrarMas() {
    setCantidadVisible(cantidadVisible + 5);
  }

  return (
    <section className="category-strip">
      <div className="category-strip__scroller">
        {cargando ? (
          <p className="category-strip__empty">Cargando categorias...</p>
        ) : categorias.length === 0 ? (
          <p className="category-strip__empty">No hay categorias para mostrar.</p>
        ) : (
          categoriasVisibles.map((categoria) => (
            <article key={categoria.id_categoria} className="category-strip__card">
              {categoria.imagen_categoria ? (
                <img src={categoria.imagen_categoria} alt={categoria.nombre} />
              ) : (
                <div className="category-strip__placeholder">
                  {categoria.nombre.slice(0, 1)}
                </div>
              )}
              <div className="category-strip__overlay">{categoria.nombre}</div>
            </article>
          ))
        )}
      </div>  
        <button className="category-strip__button" type="button">Ver mas</button>
    </section>
  );
}

export default CategorySection;
