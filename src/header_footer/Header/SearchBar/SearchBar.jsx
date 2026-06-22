import "./SearchBar.css";
import { Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify.js";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function SearchBar({ resultados = [], marcas = [], textoBusqueda = "" }) {
  if (!textoBusqueda.trim()) return null;

  const total = resultados.length + marcas.length;

  return (
    <section className="search-results">
      <div className="search-results__header">
        <div>
          <p className="search-results__eyebrow">Busqueda</p>
          <h2>Resultados para "{textoBusqueda}"</h2>
        </div>
        <span>{total} items</span>
      </div>

      {total === 0 ? (
        <p className="search-results__empty">No encontramos coincidencias exactas.</p>
      ) : (
        <>
          {marcas.length > 0 && (
            <div className="search-results__seccion">
              <p className="search-results__seccion-titulo">Marcas</p>
              <div className="search-results__grid">
                {marcas.slice(0, 4).map((marca) => (
                  <article key={`marca-${marca.id_marca}`} className="search-results__card">
                    <Link to={`/${slugify(marca.nombre)}`} className="search-results__link">
                      {marca.logo ? (
                        <img src={marca.logo} alt={marca.nombre} />
                      ) : (
                        <div className="search-results__placeholder">{marca.nombre.slice(0, 1)}</div>
                      )}
                      <div className="search-results__body">
                        <h3>{marca.nombre}</h3>
                        <p>{marca.descripcion || "Marca"}</p>
                        <div className="search-results__meta">
                          <span>Ver local</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

          {resultados.length > 0 && (
            <div className="search-results__seccion">
              <p className="search-results__seccion-titulo">Productos</p>
              <div className="search-results__grid">
                {resultados.slice(0, 6).map((producto) => (
                  <article key={producto.id_producto} className="search-results__card">
                    <Link
                      to={`/producto/${slugify(producto.nombre || String(producto.id_producto))}`}
                      className="search-results__link"
                    >
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
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default SearchBar;