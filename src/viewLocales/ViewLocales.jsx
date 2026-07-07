import "./ViewLocales.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import { getLocales } from "../viewLanding/services/landing";
import { slugify } from "../utils/slugify";

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function inicial(nombre = "") {
  return nombre.trim().slice(0, 1).toUpperCase();
}

function LocalCard({ marca }) {
  const [imgError, setImgError] = useState(false);
  const fachada = marca.imagen_fachada && !imgError ? marca.imagen_fachada : null;
  const cant = marca.cantidadProductos;

  return (
    <Link className="loc-card" to={`/${slugify(marca.nombre)}`}>
      <div className="loc-card__media">
        {fachada ? (
          <img src={fachada} alt={marca.nombre} loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <span className="loc-card__mono">{inicial(marca.nombre)}</span>
        )}
        <span className="loc-card__logo">{inicial(marca.nombre)}</span>
      </div>
      <div className="loc-card__body">
        <h3 className="loc-card__name">{marca.nombre}</h3>
        <p className="loc-card__meta">
          {marca.ubicacion || "Local"}
          {cant > 0 && <span className="loc-card__dot">·</span>}
          {cant > 0 && `${cant} ${cant === 1 ? "producto" : "productos"}`}
        </p>
        <span className="loc-card__cta">Visitar local →</span>
      </div>
    </Link>
  );
}

function ViewLocales() {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    let activo = true;
    getLocales().then(({ data, error }) => {
      if (!activo) return;
      const lista = (!error && data ? data : []).map((m) => {
        const productos = (m.Producto || []).filter((p) => p.estado === 1);
        const vistas = productos.reduce(
          (s, p) => s + (p.Metrica_Producto?.[0]?.visualizaciones ?? 0),
          0
        );
        return { ...m, cantidadProductos: productos.length, vistas };
      });
      // más populares primero
      lista.sort((a, b) => b.vistas - a.vistas || b.cantidadProductos - a.cantidadProductos);
      setLocales(lista);
      setLoading(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return locales;
    return locales.filter(
      (m) =>
        m.nombre?.toLowerCase().includes(t) ||
        m.ubicacion?.toLowerCase().includes(t)
    );
  }, [locales, q]);

  return (
    <div className="view-locales">
      <Header />

      <header className="loc-hero">
        <div className="loc-wrap">
          <p className="loc-hero__eyebrow">Directorio</p>
          <h1 className="loc-hero__title">Todos los locales</h1>
          <p className="loc-hero__sub">
            Explorá cada marca de Pilchix y entrá a su vidriera.
          </p>
          <div className="loc-search">
            <IconSearch />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar local o ciudad…"
              aria-label="Buscar local"
            />
          </div>
        </div>
      </header>

      <main className="loc-wrap loc-main">
        {loading ? (
          <div className="loc-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="loc-card loc-card--sk">
                <div className="loc-card__media loc-sk" />
                <div className="loc-card__body">
                  <div className="loc-sk loc-sk--line" />
                  <div className="loc-sk loc-sk--line loc-sk--short" />
                </div>
              </div>
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <p className="loc-empty">
            {q ? `No encontramos locales para “${q}”.` : "Todavía no hay locales."}
          </p>
        ) : (
          <>
            <p className="loc-count">
              {filtradas.length} {filtradas.length === 1 ? "local" : "locales"}
            </p>
            <div className="loc-grid">
              {filtradas.map((m) => (
                <LocalCard key={m.id_marca} marca={m} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ViewLocales;
