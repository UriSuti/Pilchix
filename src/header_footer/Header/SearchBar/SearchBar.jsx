import "./SearchBar.css";
import { Link } from 'react-router-dom'
import { slugify } from '../../../utils/slugify.js'

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function SearchBar({ resultados = [], textoBusqueda = "", cargando = false }) {
  return (
    <div className="search-dropdown">
      <div className="search-dropdown__header">
        <span>Resultados para "{textoBusqueda}"</span>
        {!cargando && (
          <span className="search-dropdown__count">{resultados.length} items</span>
        )}
      </div>

      {cargando ? (
        <div className="search-dropdown__loading">
          <span className="search-dropdown__spinner" aria-hidden="true" />
          Buscando…
        </div>
      ) : resultados.length === 0 ? (
        <p className="search-dropdown__empty">No encontramos coincidencias exactas.</p>
      ) : (
        <ul className="search-dropdown__list">
          {resultados.slice(0, 6).map((producto) => (
            <li key={producto.id_producto} className="search-dropdown__item">
              <Link to={`/producto/${slugify(producto.nombre || String(producto.id_producto))}`} className="search-dropdown__link">
                <div className="search-dropdown__thumb">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre} />
                  ) : (
                    <span>{producto.nombre.slice(0, 1)}</span>
                  )}
                </div>
                <div className="search-dropdown__body">
                  <p className="search-dropdown__nombre">{producto.nombre}</p>
                  <p className="search-dropdown__marca">{producto.marca}</p>
                </div>
                <strong className="search-dropdown__precio">
                  {formatPrice(producto.precio)}
                </strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;