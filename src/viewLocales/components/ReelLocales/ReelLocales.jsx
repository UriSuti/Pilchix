import "./ReelLocales.css";
import { useState } from "react";
import { formatPrecio, inicial } from "../../helpers/locales";
import { useReducirMovimiento } from "../../hooks/useReducirMovimiento";

// cuánto queda cada local en pantalla (también lo usa el CSS para las barras)
const DURACION_MS = 6500;
const MAX_EN_REEL = 8;

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconPausa = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
  </svg>
);
const IconSiguiente = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const dosDigitos = (n) => String(n).padStart(2, "0");
const formatNum = (n) => new Intl.NumberFormat("es-AR").format(n);

function ReelLocales({ locales, stats, cargando, q, onBuscar, onEnviarBusqueda, onPresentar }) {
  const reducir = useReducirMovimiento();
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [fallidas, setFallidas] = useState(() => new Set());

  // el reel muestra los locales con foto de portada (los más destacados primero)
  const conFoto = locales.filter((l) => l.fachada && !fallidas.has(l.id));
  const reel = (conFoto.length ? conFoto : locales).slice(0, MAX_EN_REEL);
  const indice = reel.length ? actual % reel.length : 0;
  const local = reel[indice];
  const autoplay = !reducir && !pausado && reel.length > 1;

  const siguiente = () => setActual((i) => (i + 1) % Math.max(reel.length, 1));
  const marcarFallida = (id) => setFallidas((prev) => new Set(prev).add(id));

  return (
    <section
      className={`reel ${autoplay ? "" : "reel--quieto"}`}
      style={{ "--reel-ms": `${DURACION_MS}ms` }}
      aria-roledescription="carrusel"
      aria-label="Locales destacados"
    >
      {/* fondo: una capa por local. La anterior conserva su zoom mientras se funde;
          kb-0/kb-1 alternan para que una capa que vuelve a estar activa reinicie el zoom */}
      <div className="reel__fondo" aria-hidden="true">
        {reel.map((l, i) => {
          const estado =
            i === indice
              ? `is-on kb-${actual % 2}`
              : reel.length > 1 && i === (indice - 1 + reel.length) % reel.length
                ? `is-prev kb-${(actual + 1) % 2}`
                : "";
          return (
            <div key={l.id} className={`reel__slide reel__slide--${i % 3} ${estado}`}>
              {l.fachada && !fallidas.has(l.id) ? (
                <img src={l.fachada} alt="" loading={i === 0 ? "eager" : "lazy"} onError={() => marcarFallida(l.id)} />
              ) : (
                <span className="reel__mono">{inicial(l.nombre)}</span>
              )}
            </div>
          );
        })}
        <div className="reel__velo" />
      </div>

      <div className="reel__inner">
        <div className="reel__intro">
          <p className="reel__eyebrow">Directorio</p>
          <h1 className="reel__title">Todos los locales</h1>
          <p className="reel__sub">
            Conocé cada marca de Pilchix: su estilo, sus prendas más vendidas y dónde encontrarla.
          </p>
          <form
            className="reel__search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onEnviarBusqueda();
            }}
          >
            <IconSearch />
            <input
              type="search"
              value={q}
              onChange={(e) => onBuscar(e.target.value)}
              placeholder="Buscá por nombre, barrio o estilo…"
              aria-label="Buscar locales por nombre, barrio o estilo"
            />
          </form>
        </div>

        <dl className="reel__stats">
          <div>
            <dt>Locales</dt>
            <dd>{cargando ? "—" : formatNum(stats.locales)}</dd>
          </div>
          <div>
            <dt>Prendas publicadas</dt>
            <dd>{cargando ? "—" : formatNum(stats.prendas)}</dd>
          </div>
          <div>
            <dt>Barrios</dt>
            <dd>{cargando ? "—" : formatNum(stats.barrios)}</dd>
          </div>
        </dl>

        {/* prendas del local en pantalla: entran desde abajo con desfase (key = local para re-animar) */}
        {local?.productos.length > 0 && (
          <ul className="reel__prendas" key={local.id} aria-hidden="true">
            {local.productos.slice(0, 4).map((p, i) => (
              <li key={p.id} className="reel__prenda" style={{ "--i": i }}>
                <img src={p.imagen} alt="" loading="lazy" />
                <span>{formatPrecio(p.precio)}</span>
              </li>
            ))}
          </ul>
        )}

        {local && (
          <aside className="reel__now" aria-live={autoplay ? "off" : "polite"}>
            <p className="reel__now-top">
              <span className="reel__rec" aria-hidden="true" />
              En pantalla · {dosDigitos(indice + 1)}/{dosDigitos(reel.length)}
            </p>
            <p className="reel__now-name">{local.nombre}</p>
            {(local.frase || local.ubicacion) && (
              <p className="reel__now-sub">{local.frase || local.ubicacion}</p>
            )}

            {/* barras tipo historias: la activa se llena por CSS y al terminar pasa al siguiente */}
            <div className="reel__bars" aria-hidden="true">
              {reel.map((l, i) => (
                <span
                  key={l.id}
                  className={`reel__bar ${i < indice ? "is-done" : ""} ${i === indice ? "is-on" : ""}`}
                >
                  <i key={`${l.id}-${actual}`} onAnimationEnd={i === indice ? siguiente : undefined} />
                </span>
              ))}
            </div>

            <div className="reel__now-actions">
              <button type="button" className="reel__cta" onClick={() => onPresentar(local)}>
                Ver presentación
              </button>
              {!reducir && reel.length > 1 && (
                <button
                  type="button"
                  className="reel__icon-btn"
                  onClick={() => setPausado((p) => !p)}
                  aria-label={pausado ? "Reanudar" : "Pausar"}
                  aria-pressed={pausado}
                >
                  {pausado ? <IconPlay /> : <IconPausa />}
                </button>
              )}
              {reel.length > 1 && (
                <button type="button" className="reel__icon-btn" onClick={siguiente} aria-label="Siguiente local">
                  <IconSiguiente />
                </button>
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

export default ReelLocales;
