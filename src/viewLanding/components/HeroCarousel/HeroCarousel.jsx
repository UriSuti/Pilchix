import { Link } from "react-router-dom";
import "./HeroCarousel.css";
import { slugify } from "../../../utils/slugify";
import { useShowroomDrift } from "../../hooks/useShowroomDrift";
import { useReveal } from "../../../hooks/useReveal";
import BotonFavorito from "../../../viewLocal/components/BotonFavorito/BotonFavorito";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const HangerIcon = () => (
  <svg className="sh-hanger__icon" viewBox="0 0 48 30" aria-hidden="true">
    <circle cx="24" cy="5" r="3" />
    <path d="M24 8 L24 12" />
    <path d="M24 12 L4 26 L44 26 Z" />
  </svg>
);

function ProductCard({ producto, i }) {
  return (
    <div className="sh-hanger" style={{ "--sh-i": i }}>
      <HangerIcon />
      <Link className="sh-card" to={`/producto/${slugify(producto.nombre || "")}`} draggable={false}>
        <div className="sh-card__img">
          <div className="sh-card__fav">
            <BotonFavorito idProducto={producto.id_producto} />
          </div>
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} loading="lazy" draggable={false} />
          ) : (
            <div className="sh-card__placeholder">{producto.nombre?.slice(0, 1)}</div>
          )}
        </div>
        <div className="sh-card__body">
          <p className="sh-card__brand">{producto.marca || "Pilchix"}</p>
          <h4>{producto.nombre}</h4>
          <p className="sh-card__price">{formatPrice(producto.precio)}</p>
        </div>
      </Link>
    </div>
  );
}

function HeroCarousel({
  productos = [],
  cargando,
  titulo = "CREEMOS QUE TE GUSTARÁ",
  eyebrow = "Pensado para vos",
  direccion = "izquierda",
  alt = false,
  id,
}) {
  // contenido duplicado para el loop continuo
  const fila = productos.length > 0 ? [...productos, ...productos] : [];

  // se le pasa la cantidad para reiniciar la animación cuando llegan los productos
  const trackRef = useShowroomDrift({ direccion, cantidad: fila.length });
  const [headRef, headVisible] = useReveal();
  const [showroomRef, showroomVisible] = useReveal();

  return (
    <section className={`lp-section ${alt ? "lp-section--alt" : ""}`} id={id}>
      <div className="lp-wrap">
        <div className={`lp-head lp-reveal ${headVisible ? "is-visible" : ""}`} ref={headRef}>
          <div>
            <p className="lp-eyebrow">{eyebrow}</p>
            <h2>{titulo}</h2>
          </div>
        </div>
      </div>

      {cargando ? (
        <p className="lp-empty lp-wrap">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="lp-empty lp-wrap">No hay productos para mostrar.</p>
      ) : (
        <div className={`showroom lp-reveal ${showroomVisible ? "is-visible" : ""}`} ref={showroomRef}>
          <div className="showroom__rail" aria-hidden="true" />
          <div className="showroom__track" ref={trackRef}>
            {fila.map((producto, i) => (
              <ProductCard key={`${producto.id_producto}-${i}`} producto={producto} i={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroCarousel;
