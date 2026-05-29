import { useState } from "react";
import "./OffersSection.css";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function OffersSection({ descuentos = [], cargando, titulo = "OFERTAS DESTACADAS" }) {
  const [paginaActual, setPaginaActual] = useState(0);
  const [cantidadVisible, setCantidadVisible] = useState(6);

  const descuentosMostrados = descuentos.slice(0, cantidadVisible);
  const cantidadPorPagina = 6;
  const totalPaginas = Math.max(1, Math.ceil(descuentosMostrados.length / cantidadPorPagina));
  const inicio = paginaActual * cantidadPorPagina;
  const descuentosVisibles = descuentosMostrados.slice(inicio, inicio + cantidadPorPagina);
  const puedeIrAtras = paginaActual > 0;
  const puedeIrAdelante = paginaActual < totalPaginas - 1;
  const hayMasDescuentos = cantidadVisible < descuentos.length;

  function irAtras() {
    if (puedeIrAtras) {
      setPaginaActual(paginaActual - 1);
    }
  }

  function irAdelante() {
    if (puedeIrAdelante) {
      setPaginaActual(paginaActual + 1);
    }
  }

  function mostrarMas() {
    setCantidadVisible(cantidadVisible + 6);
  }

  return (
    <section className="rail-section">
      <div className="rail-section__header">
        <h2>{titulo}</h2>
        {hayMasDescuentos ? (
          <button className="rail-section__link" type="button" onClick={mostrarMas}>
            Ver mas
          </button>
        ) : null}
      </div>

      {cargando ? (
        <p className="rail-section__empty">Cargando ofertas...</p>
      ) : descuentos.length === 0 ? (
        <p className="rail-section__empty">No hay descuentos activos.</p>
      ) : (
        <div className="rail-section__frame">
          <button
            className="rail-section__arrow"
            type="button"
            aria-label="Anterior"
            onClick={irAtras}
            disabled={!puedeIrAtras}
          >
            ‹
          </button>

          <div className="product-rail">
            {descuentosVisibles.map((descuento) => (
              <article key={descuento.id_descuento} className="product-rail__card">
                {descuento.imagen ? (
                  <img src={descuento.imagen} alt={descuento.producto} />
                ) : (
                  <div className="product-rail__placeholder">
                    {descuento.producto?.slice(0, 1) || "O"}
                  </div>
                )}
                <div className="product-rail__body">
                  <p>{descuento.marca || "Oferta"}</p>
                  <span>{descuento.porcentaje}% OFF</span>
                  <strong>{formatPrice(descuento.precio_final)}</strong>
                </div>
              </article>
            ))}
          </div>

          <button
            className="rail-section__arrow"
            type="button"
            aria-label="Siguiente"
            onClick={irAdelante}
            disabled={!puedeIrAdelante}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default OffersSection;
