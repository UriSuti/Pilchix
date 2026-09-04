import { useState } from "react";
import { Link } from "react-router-dom";
import "./OffersSection.css";
import { slugify } from "../../../utils/slugify";
import { useReveal } from "../../../hooks/useReveal";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const IconBolt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconChevron = ({ direction = "left" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: direction === "right" ? "rotate(180deg)" : undefined }}
  >
    <polyline points="15 6 9 12 15 18" />
  </svg>
);

const ITEMS_PER_PAGE = 3;

function OffersSection({ descuentos = [], cargando, titulo = "OFERTAS DESTACADAS" }) {
  const lista = descuentos.slice(0, 8);
  const [headRef, headVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();
  const [activeIndex, setActiveIndex] = useState(0);

  // el selector agrupa las ofertas de a 3 por página
  const pages = [];
  for (let i = 0; i < lista.length; i += ITEMS_PER_PAGE) {
    pages.push(lista.slice(i, i + ITEMS_PER_PAGE));
  }

  // clampeado en el render (no en estado): si cambia la cantidad de ofertas
  // (llegan de la API, o cambian de local), el índice podría haber quedado
  // apuntando fuera de rango
  const safeIndex = pages.length === 0 ? 0 : Math.min(activeIndex, pages.length - 1);

  const goPrev = () => setActiveIndex((i) => {
    const current = pages.length === 0 ? 0 : Math.min(i, pages.length - 1);
    return (current - 1 + pages.length) % pages.length;
  });
  const goNext = () => setActiveIndex((i) => {
    const current = pages.length === 0 ? 0 : Math.min(i, pages.length - 1);
    return (current + 1) % pages.length;
  });

  return (
    <section className="lp-section" id="ofertas">
      <div className="lp-wrap">
        <div className={`lp-head lp-reveal ${headVisible ? "is-visible" : ""}`} ref={headRef}>
          <div>
            <p className="lp-eyebrow">No te las quedes mirando</p>
            <h2>{titulo}</h2>
          </div>
        </div>

        {cargando ? (
          <p className="lp-empty">Cargando ofertas...</p>
        ) : lista.length === 0 ? (
          <div className={`offers ${gridVisible ? "is-visible" : ""}`} ref={gridRef}>
            <div className="offer offer--teaser offer--static" style={{ "--lp-i": 0 }}>
              <div className="offer__body">
                <span className="offer__tag offer__tag--ghost"><IconBolt /> Muy pronto</span>
                <h3>Las próximas ofertas ya se están cocinando</h3>
                <p>Activá las notificaciones de tu local favorito para no perdértelas.</p>
              </div>
            </div>

            <Link className="offer offer--cta" to="/locales" style={{ "--lp-i": 1 }}>
              <div className="offer__body">
                <span className="offer__tag">Mientras tanto</span>
                <h3>Explorá el catálogo completo</h3>
                <p className="offer__cta-link">
                  Ver todos los locales <IconArrowRight />
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className={`offers-carousel ${gridVisible ? "is-visible" : ""}`} ref={gridRef}>
            {pages.length > 1 && (
              <button
                type="button"
                className="offers-nav offers-nav--prev"
                onClick={goPrev}
                aria-label="Página anterior"
              >
                <IconChevron direction="left" />
              </button>
            )}

            <div className="offers-viewport">
              <div className="offers-track" style={{ transform: `translateX(-${safeIndex * 100}%)` }}>
                {pages.map((pagina, p) => (
                  <div className="offers-page" key={pagina[0].id_descuento}>
                    {pagina.map((descuento, i) => {
                      const nombre = descuento.producto;
                      const contenido = (
                        <>
                          {descuento.imagen ? (
                            <img src={descuento.imagen} alt={nombre || descuento.marca} draggable={false} />
                          ) : (
                            <div className="offer__placeholder" />
                          )}
                          <div className="offer__body">
                            <span className="offer__tag">{descuento.porcentaje}% OFF</span>
                            <h3>{nombre || descuento.marca}</h3>
                            <p>
                              {descuento.marca}
                              {descuento.precio_final
                                ? ` · ${formatPrice(descuento.precio_final)}`
                                : ""}
                            </p>
                          </div>
                        </>
                      );

                      const lpi = p * ITEMS_PER_PAGE + i;
                      // solo enlazamos si hay nombre de producto (evita rutas /producto/ vacías)
                      return nombre ? (
                        <Link
                          key={descuento.id_descuento}
                          className="offer"
                          to={`/producto/${slugify(nombre)}`}
                          style={{ "--lp-i": lpi }}
                        >
                          {contenido}
                        </Link>
                      ) : (
                        <div key={descuento.id_descuento} className="offer offer--static" style={{ "--lp-i": lpi }}>
                          {contenido}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {pages.length > 1 && (
              <button
                type="button"
                className="offers-nav offers-nav--next"
                onClick={goNext}
                aria-label="Página siguiente"
              >
                <IconChevron direction="right" />
              </button>
            )}
          </div>
        )}

        {pages.length > 1 && (
          <div className="offers-dots">
            {pages.map((pagina, i) => (
              <button
                key={pagina[0].id_descuento}
                type="button"
                className={`offers-dot ${i === safeIndex ? "is-active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver ofertas ${i + 1}`}
                aria-current={i === safeIndex}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OffersSection;
