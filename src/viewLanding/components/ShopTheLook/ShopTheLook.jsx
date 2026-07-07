import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify";
import "./ShopTheLook.css";

// fotos editoriales (decorativas, del front). En serio, cada marca sube la suya.
const LOOK_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1100&q=80",
];

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

function ShopTheLook({ productos = [], cargando }) {
  // arma un "look" por marca: sus productos + una foto editorial
  const looks = useMemo(() => {
    const byBrand = new Map();
    productos.forEach((p) => {
      const m = p.marca || "Pilchix";
      if (!byBrand.has(m)) byBrand.set(m, []);
      byBrand.get(m).push(p);
    });
    const out = [];
    let i = 0;
    for (const [marca, prods] of byBrand) {
      out.push({ marca, img: LOOK_IMAGES[i % LOOK_IMAGES.length], productos: prods.slice(0, 3) });
      i += 1;
      if (out.length >= 4) break;
    }
    return out;
  }, [productos]);

  const [actual, setActual] = useState(0);

  // avance automático (se reinicia con cada cambio)
  useEffect(() => {
    if (looks.length <= 1) return undefined;
    const id = setTimeout(() => setActual((a) => (a + 1) % looks.length), 6500);
    return () => clearTimeout(id);
  }, [actual, looks.length]);

  if (cargando) {
    return (
      <section className="lp-section lp-section--alt" id="look">
        <div className="lp-wrap">
          <p className="lp-empty">Cargando looks...</p>
        </div>
      </section>
    );
  }

  if (looks.length === 0) return null;

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
          <Link className="look__foto" to={`/${slugify(look.marca)}`}>
            <img key={look.marca} src={look.img} alt={`Look de ${look.marca}`} />
            <span className="look__tag">El look de {look.marca}</span>
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
                      <p className="look__marca">{p.marca}</p>
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
