import { Link } from "react-router-dom";
import "./OffersSection.css";
import { slugify } from "../../../utils/slugify";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function OffersSection({ descuentos = [], cargando, titulo = "OFERTAS DESTACADAS" }) {
  const lista = descuentos.slice(0, 2);

  return (
    <section className="lp-section" id="ofertas">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <p className="lp-eyebrow">No te las quedes mirando</p>
            <h2>{titulo}</h2>
          </div>
        </div>

        {cargando ? (
          <p className="lp-empty">Cargando ofertas...</p>
        ) : lista.length === 0 ? (
          <p className="lp-empty">No hay descuentos activos.</p>
        ) : (
          <div className="offers">
            {lista.map((descuento) => (
              <Link
                key={descuento.id_descuento}
                className="offer"
                to={`/producto/${slugify(descuento.producto || "")}`}
              >
                {descuento.imagen ? (
                  <img src={descuento.imagen} alt={descuento.producto} />
                ) : (
                  <div className="offer__placeholder" />
                )}
                <div className="offer__body">
                  <span className="offer__tag">{descuento.porcentaje}% OFF</span>
                  <h3>{descuento.producto || descuento.marca}</h3>
                  <p>
                    {descuento.marca}
                    {descuento.precio_final
                      ? ` · ${formatPrice(descuento.precio_final)}`
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OffersSection;
