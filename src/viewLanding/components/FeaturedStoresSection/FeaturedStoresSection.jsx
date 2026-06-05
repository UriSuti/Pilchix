import { useState } from "react";
import "./FeaturedStoresSection.css";
import { Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify";

function FeaturedStoresSection({ marcas = [], marcasPopulares = [], cargando, local, setLocal }) {
  const [paginaActual, setPaginaActual] = useState(0);
  const [cantidadVisible, setCantidadVisible] = useState(10);

  const locales = marcasPopulares.length > 0 ? marcasPopulares : marcas;
  const localesMostrados = locales.slice(0, cantidadVisible);
  const cantidadPorPagina = 4;
  const totalPaginas = Math.max(1, Math.ceil(localesMostrados.length / cantidadPorPagina));
  const inicio = paginaActual * cantidadPorPagina;
  const localesVisibles = localesMostrados.slice(inicio, inicio + cantidadPorPagina);
  const puedeIrAtras = paginaActual > 0;
  const puedeIrAdelante = paginaActual < totalPaginas - 1;
  const hayMasLocales = cantidadVisible < locales.length;

  function irAtras() {
    if (puedeIrAtras) {
      setPaginaActual(paginaActual - 1);
    }
  }

  function irAdelante() {
    if (puedeIrAdelante) {
      setPaginaActual(paginaActual + 1);
    }
  }

  function mostrarMas() {
    setCantidadVisible(cantidadVisible + 4);
  }

  return (
    <section className="rail-section">
      <div className="rail-section__header">
        <h2>LOCALES DESTACADOS</h2>
        {hayMasLocales ? (
          <button className="rail-section__link" type="button" onClick={mostrarMas}>
            Ver mas
          </button>
        ) : null}
      </div>

      {cargando ? (
        <p className="rail-section__empty">Cargando locales...</p>
      ) : locales.length === 0 ? (
        <p className="rail-section__empty">No hay locales disponibles.</p>
      ) : (
        <div className="rail-section__frame">
          <button
            className="rail-section__arrow"
            type="button"
            aria-label="Anterior"
            onClick={irAtras}
            disabled={!puedeIrAtras}
          >
            ‹
          </button>

          <div className="stores-rail">
            {localesVisibles.map((marca) => (
              <Link
                key={marca.id_marca}
                to={`/${slugify(marca.nombre)}`}
                className="store-tile"
              >
                {marca.logo ? (
                  <img src={marca.logo} alt={marca.nombre} />
                ) : (
                  <div className="store-tile__placeholder">{marca.nombre.slice(0, 1)}</div>
                )}
                <div className="store-tile__info">
                  <h3>{marca.nombre}</h3>
                  <p>{marca.ubicacion || "Local destacado"}</p>
                </div>
              </Link>
            ))}
          </div>

          <button
            className="rail-section__arrow"
            type="button"
            aria-label="Siguiente"
            onClick={irAdelante}
            disabled={!puedeIrAdelante}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default FeaturedStoresSection;