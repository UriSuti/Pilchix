import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FeaturedStoresSection.css";
import { slugify } from "../../../utils/slugify";
import { getImagenMarca } from "../../services/landing";

function inicial(nombre = "") {
  return nombre.trim().slice(0, 1).toUpperCase();
}

function FeaturedStoresSection({ marcas = [], marcasPopulares = [], productos = [], cargando }) {
  const locales = (marcasPopulares.length > 0 ? marcasPopulares : marcas).slice(0, 6);
  const [activa, setActiva] = useState(0);
  const [fachadas, setFachadas] = useState({}); // cache id_marca -> url

  const marcaActiva = locales[activa];

  // Trae la fachada real del local activo (una vez por marca)
  useEffect(() => {
    if (!marcaActiva || fachadas[marcaActiva.id_marca] !== undefined) return;

    let activo = true;
    getImagenMarca(marcaActiva.id_marca).then(({ data, error }) => {
      if (!activo) return;
      const url = !error ? data?.[0]?.imagen_fachada ?? null : null;
      setFachadas((prev) => ({ ...prev, [marcaActiva.id_marca]: url }));
    });

    return () => {
      activo = false;
    };
  }, [marcaActiva, fachadas]);

  if (cargando) {
    return (
      <section className="lp-section lp-section--alt" id="locales">
        <div className="lp-wrap">
          <p className="lp-empty">Cargando locales...</p>
        </div>
      </section>
    );
  }

  if (locales.length === 0) {
    return (
      <section className="lp-section lp-section--alt" id="locales">
        <div className="lp-wrap">
          <p className="lp-empty">No hay locales disponibles.</p>
        </div>
      </section>
    );
  }

  const fachada =
    fachadas[marcaActiva.id_marca] || marcaActiva.logo || null;

  const thumbs = (() => {
    const propios = productos.filter((p) => p.marca === marcaActiva.nombre && p.imagen);
    const fuente = propios.length > 0 ? propios : productos.filter((p) => p.imagen);
    return fuente.slice(0, 3);
  })();

  return (
    <section className="lp-section lp-section--alt" id="locales">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <p className="lp-eyebrow">Los que están rompiendo</p>
            <h2>Locales destacados</h2>
          </div>
        </div>

        <div className="spotlight">
          <ul className="spot__list">
            {locales.map((marca, i) => (
              <li
                key={marca.id_marca}
                className={`spot__item ${i === activa ? "is-active" : ""}`}
                onMouseEnter={() => setActiva(i)}
                onClick={() => setActiva(i)}
              >
                <span className="spot__idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="spot__name">{marca.nombre}</span>
                <span className="spot__cat">{marca.ubicacion || "Local destacado"}</span>
              </li>
            ))}
          </ul>

          <Link className="spot__stage" to={`/${slugify(marcaActiva.nombre)}`}>
            {fachada ? (
              <img className="spot__bg" src={fachada} alt={marcaActiva.nombre} />
            ) : (
              <div className="spot__bg spot__bg--placeholder" />
            )}

            <span className="spot__logo">{inicial(marcaActiva.nombre)}</span>

            <div className="spot__info">
              <small>{marcaActiva.ubicacion || "Local destacado"}</small>
              <h3>{marcaActiva.nombre}</h3>
              {thumbs.length > 0 && (
                <div className="spot__thumbs">
                  {thumbs.map((p) => (
                    <img key={p.id_producto} src={p.imagen} alt={p.nombre} />
                  ))}
                </div>
              )}
              <span className="spot__cta">Visitar local →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedStoresSection;
