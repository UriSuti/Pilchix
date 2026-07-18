import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify";
import { getImagenPortada } from "../../../utils/producto";
import { getLooks } from "../../../services/looks";
import "./ShopTheLook.css";

const IconPrev = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconNext = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function ShopTheLook() {
  const [looks, setLooks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    let activo = true;
    getLooks().then(({ data }) => {
      if (!activo) return;
      const norm = (data ?? [])
        .map((l) => ({
          id: l.id_look,
          titulo: l.titulo,
          img: l.imagen,
          imgHover: l.imagen_hover || null,
          marca: l.Marca?.nombre || "Pilchix",
          productos: (l.Look_Producto ?? [])
            .map((lp) => lp.Producto)
            .filter(Boolean)
            .map((p) => ({
              id_producto: p.id_producto,
              nombre: p.nombre,
              precio: p.precio,
              marca: p.Marca?.nombre,
              imagen: getImagenPortada(p.Imagen)?.imagen || null,
            })),
        }))
        .filter((l) => l.img && l.productos.length > 0);
      setLooks(norm);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  // avance automático (se reinicia con cada cambio)
  useEffect(() => {
    if (looks.length <= 1) return undefined;
    const id = setTimeout(() => setActual((a) => (a + 1) % looks.length), 6500);
    return () => clearTimeout(id);
  }, [actual, looks.length]);

  // sin looks cargados, la sección no se muestra (nada de fotos falsas)
  if (cargando || looks.length === 0) return null;

  const idx = Math.min(actual, looks.length - 1);
  const look = looks[idx];
  const total = look.productos.reduce((s, p) => s + (Number(p.precio) || 0), 0);
  const ir = (i) => setActual((i + looks.length) % looks.length);

  return (
    <section className="lp-section lp-section--alt" id="look">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <p className="lp-eyebrow">Inspirate</p>
            <h2>Shop the look</h2>
          </div>
          {looks.length > 1 && (
            <div className="look__nav">
              <button type="button" onClick={() => ir(idx - 1)} aria-label="Look anterior">
                <IconPrev />
              </button>
              <button type="button" onClick={() => ir(idx + 1)} aria-label="Siguiente look">
                <IconNext />
              </button>
            </div>
          )}
        </div>

        <div className="look">
          <Link
            className={`look__foto ${look.imgHover ? "has-hover" : ""}`}
            to={`/${slugify(look.marca)}`}
          >
            <img key={look.id} src={look.img} alt={look.titulo || `Look de ${look.marca}`} />
            {look.imgHover && (
              <img
                className="look__foto-hover"
                key={`${look.id}-h`}
                src={look.imgHover}
                alt=""
                aria-hidden="true"
              />
            )}
            <span className="look__tag">{look.titulo || `El look de ${look.marca}`}</span>
          </Link>

          <div className="look__panel">
            <p className="look__intro">
              Así combina <b>{look.marca}</b> sus prendas. Sumá el look completo o llevate tu pieza favorita.
            </p>

            <ol className="look__list">
              {look.productos.map((p, i) => (
                <li key={p.id_producto ?? i}>
                  <Link className="look__item" to={`/producto/${slugify(p.nombre || "")}`}>
                    <div className="look__thumb">
                      {p.imagen ? (
                        <img src={p.imagen} alt={p.nombre} loading="lazy" />
                      ) : (
                        <span>{p.nombre?.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="look__info">
                      <p className="look__marca">{p.marca || look.marca}</p>
                      <p className="look__nombre">{p.nombre}</p>
                    </div>
                    <span className="look__precio">{formatPrice(p.precio)}</span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="look__total">
              <span>Total del look</span>
              <b>{formatPrice(total)}</b>
            </div>

            {looks.length > 1 && (
              <div className="look__bar">
                <span className="look__bar-fill" key={idx} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopTheLook;
