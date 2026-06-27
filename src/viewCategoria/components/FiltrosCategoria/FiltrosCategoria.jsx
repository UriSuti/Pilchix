import { useState } from "react";
import "./FiltrosCategoria.css";

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const money = (n) => "$" + Number(n || 0).toLocaleString("es-AR");

// avatar de marca con monograma de respaldo
function MarcaLogo({ marca }) {
  const [error, setError] = useState(false);
  if (marca.logo && !error) {
    return (
      <img className="fmarca__logo" src={marca.logo} alt={marca.nombre} onError={() => setError(true)} />
    );
  }
  return <span className="fmarca__mono">{marca.nombre?.[0] ?? "?"}</span>;
}

// grupo colapsable
function Grupo({ titulo, children }) {
  const [abierto, setAbierto] = useState(true);
  return (
    <div className={`fgroup ${abierto ? "" : "is-collapsed"}`}>
      <button type="button" className="fgroup__title" onClick={() => setAbierto((v) => !v)}>
        {titulo}
        <span className="fgroup__chev">
          <IconChevron />
        </span>
      </button>
      {abierto && <div className="fgroup__body">{children}</div>}
    </div>
  );
}

// slider de precio con dos manijas
function RangoPrecio({ min, max, valor, onChange }) {
  const [lo, hi] = valor;
  const span = max - min || 1;
  const leftPct = ((lo - min) / span) * 100;
  const rightPct = ((max - hi) / span) * 100;

  return (
    <>
      <div className="fprice__vals">
        <span>{money(lo)}</span>
        <span>{money(hi)}</span>
      </div>
      <div className="frange">
        <div className="frange__track" />
        <div className="frange__fill" style={{ left: `${leftPct}%`, right: `${rightPct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
        />
      </div>
    </>
  );
}

/**
 * Panel de filtros de la categoría.
 */
function FiltrosCategoria({
  marcas = [],
  marcasSel,
  onToggleMarca,
  talles = [],
  tallesSel,
  onToggleTalle,
  precioBounds,
  precio,
  onPrecio,
  hayFiltros,
  onLimpiar,
}) {
  const [bmin, bmax] = precioBounds;

  return (
    <aside className="filtros">
      <div className="filtros__head">
        <h3>Filtros</h3>
        {hayFiltros && (
          <button type="button" className="filtros__clear" onClick={onLimpiar}>
            Limpiar todo
          </button>
        )}
      </div>

      {marcas.length > 0 && (
        <Grupo titulo="Marca">
          <div className="fmarcas">
            {marcas.map((m) => (
              <label key={m.id_marca} className="fmarca">
                <input
                  type="checkbox"
                  checked={marcasSel.has(m.id_marca)}
                  onChange={() => onToggleMarca(m.id_marca)}
                />
                <span className="fmarca__box">
                  <IconCheck />
                </span>
                <MarcaLogo marca={m} />
                <span className="fmarca__name">{m.nombre}</span>
                <span className="fmarca__count">{m.count}</span>
              </label>
            ))}
          </div>
        </Grupo>
      )}

      {bmax > bmin && (
        <Grupo titulo="Precio">
          <RangoPrecio min={bmin} max={bmax} valor={precio} onChange={onPrecio} />
        </Grupo>
      )}

      {talles.length > 0 && (
        <Grupo titulo="Talle">
          <div className="ftalles">
            {talles.map((t) => (
              <button
                key={t}
                type="button"
                className={`ftalle ${tallesSel.has(t) ? "is-active" : ""}`}
                onClick={() => onToggleTalle(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </Grupo>
      )}
    </aside>
  );
}

export default FiltrosCategoria;
