import { Link } from "react-router-dom";
import "./HeroCarousel.css";
import { slugify } from "../../../utils/slugify";
import { useShowroomDrift } from "../../hooks/useShowroomDrift";
import BotonFavorito from "../../../viewLocal/components/BotonFavorito/BotonFavorito";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function ProductCard({ producto }) {
  return (
    <Link className="sh-card" to={`/producto/${slugify(producto.nombre || "")}`}>
      <div className="sh-card__img">
        <div className="sh-card__fav">
          <BotonFavorito idProducto={producto.id_producto} />
        </div>
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
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
  );
}

function HeroCarousel({
  productos = [],
  cargando,
  titulo = "CREEMOS QUE TE GUSTARÁ",
  eyebrow = "Pensado para vos",
  direccion = "izquierda",
  alt = false,
}) {
  const trackRef = useShowroomDrift({ direccion });

  // contenido duplicado para el loop continuo
  const fila = productos.length > 0 ? [...productos, ...productos] : [];

  return (
    <section className={`lp-section ${alt ? "lp-section--alt" : ""}`}>
      <div className="lp-wrap">
        <div className="lp-head">
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
        <div className="showroom">
          <div className="showroom__track" ref={trackRef}>
            {fila.map((producto, i) => (
              <ProductCard key={`${producto.id_producto}-${i}`} producto={producto} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroCarousel;
