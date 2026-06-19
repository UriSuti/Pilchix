import "./SearchBar.css";
import { Link } from 'react-router-dom'
import { slugify } from '../../../utils/slugify.js'

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function SearchBar({ resultados = [], textoBusqueda = "" }) {
  if (!textoBusqueda.trim()) {
    return null;
  }

  return (
    <section className="search-results">
      <div className="search-results__header">
        <div>
          <p className="search-results__eyebrow">Busqueda</p>
          <h2>Resultados para "{textoBusqueda}"</h2>
        </div>
        <span>{resultados.length} items</span>
      </div>

      {resultados.length === 0 ? (
        <p className="search-results__empty">No encontramos coincidencias exactas.</p>
      ) : (
        <div className="search-results__grid">
          {resultados.slice(0, 6).map((producto) => (
            <article key={producto.id_producto} className="search-results__card">
              <Link to={`/producto/${slugify(producto.nombre || String(producto.id_producto))}`} className="search-results__link">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} />
                ) : (
                  <div className="search-results__placeholder">{producto.nombre.slice(0, 1)}</div>
                )}
                <div className="search-results__body">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.marca}</p>
                  <div className="search-results__meta">
                    <span>{producto.categoria || "Producto"}</span>
                    <strong>{formatPrice(producto.precio)}</strong>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchBar;
