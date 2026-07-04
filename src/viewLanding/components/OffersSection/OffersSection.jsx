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
            {lista.map((descuento) => {
              const nombre = descuento.producto;
              const contenido = (
                <>
                  {descuento.imagen ? (
                    <img src={descuento.imagen} alt={nombre || descuento.marca} />
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

              // solo enlazamos si hay nombre de producto (evita rutas /producto/ vacías)
              return nombre ? (
                <Link key={descuento.id_descuento} className="offer" to={`/producto/${slugify(nombre)}`}>
                  {contenido}
                </Link>
              ) : (
                <div key={descuento.id_descuento} className="offer offer--static">
                  {contenido}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default OffersSection;
