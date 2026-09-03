import "./ViewOfertas.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import { getLandingDescuentos } from "../viewLanding/services/landing";
import { formatDescuentos } from "../viewLanding/helpers/formatters";
import { slugify } from "../utils/slugify";

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));

function OfertaCard({ oferta }) {
  return (
    <Link className="ofe-card" to={`/producto/${slugify(oferta.producto)}`}>
      <div className="ofe-card__media">
        {oferta.imagen ? (
          <img src={oferta.imagen} alt={oferta.producto} loading="lazy" />
        ) : (
          <span className="ofe-card__mono">{oferta.producto?.charAt(0)}</span>
        )}
        <span className="ofe-card__badge">-{oferta.porcentaje}%</span>
      </div>
      <div className="ofe-card__body">
        <p className="ofe-card__marca">{oferta.marca}</p>
        <h3 className="ofe-card__name">{oferta.producto}</h3>
        <p className="ofe-card__precios">
          <span className="ofe-card__final">{formatPrecio(oferta.precio_final)}</span>
          <span className="ofe-card__anterior">{formatPrecio(oferta.precio_anterior)}</span>
        </p>
      </div>
    </Link>
  );
}

function ViewOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    let activo = true;
    getLandingDescuentos(new Date().toISOString()).then(({ data, error }) => {
      if (!activo) return;
      setOfertas(!error && data ? formatDescuentos(data) : []);
      setLoading(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ofertas;
    return ofertas.filter(
      (o) =>
        o.producto?.toLowerCase().includes(t) ||
        o.marca?.toLowerCase().includes(t)
    );
  }, [ofertas, q]);

  return (
    <div className="view-ofertas">
      <Header />

      <header className="ofe-hero">
        <div className="ofe-wrap">
          <p className="ofe-hero__eyebrow">No te las pierdas</p>
          <h1 className="ofe-hero__title">Todas las ofertas</h1>
          <p className="ofe-hero__sub">
            Los productos con descuento vigente de todas las marcas de Pilchix, en un solo lugar.
          </p>
          <div className="ofe-search">
            <IconSearch />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar producto o marca…"
              aria-label="Buscar oferta"
            />
          </div>
        </div>
      </header>

      <main className="ofe-wrap ofe-main">
        {loading ? (
          <div className="ofe-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ofe-card ofe-card--sk">
                <div className="ofe-card__media ofe-sk" />
                <div className="ofe-card__body">
                  <div className="ofe-sk ofe-sk--line" />
                  <div className="ofe-sk ofe-sk--line ofe-sk--short" />
                </div>
              </div>
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <p className="ofe-empty">
            {q ? `No encontramos ofertas para “${q}”.` : "Todavía no hay ofertas activas. Volvé pronto."}
          </p>
        ) : (
          <>
            <p className="ofe-count">
              {filtradas.length} {filtradas.length === 1 ? "oferta" : "ofertas"}
            </p>
            <div className="ofe-grid">
              {filtradas.map((o) => (
                <OfertaCard key={o.id_descuento} oferta={o} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ViewOfertas;
