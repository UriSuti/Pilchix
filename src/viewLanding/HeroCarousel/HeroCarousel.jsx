import { useState } from "react";
import "./HeroCarousel.css";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function HeroCarousel({ productos = [], cargando, titulo = "CREEMOS QUE TE GUSTARA" }) {
  const [paginaActual, setPaginaActual] = useState(0);
  const [cantidadVisible, setCantidadVisible] = useState(6);

  const productosMostrados = productos.slice(0, cantidadVisible);
  const cantidadPorPagina = 6;
  const totalPaginas = Math.max(1, Math.ceil(productosMostrados.length / cantidadPorPagina));
  const inicio = paginaActual * cantidadPorPagina;
  const productosVisibles = productosMostrados.slice(inicio, inicio + cantidadPorPagina);
  const puedeIrAtras = paginaActual > 0;
  const puedeIrAdelante = paginaActual < totalPaginas - 1;
  const hayMasProductos = cantidadVisible < productos.length;

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
        {hayMasProductos ? (
          <button className="rail-section__link" type="button" onClick={mostrarMas}>
            Ver mas
          </button>
        ) : null}
      </div>

      {cargando ? (
        <p className="rail-section__empty">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="rail-section__empty">No hay productos para mostrar.</p>
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
            {productosVisibles.map((producto) => (
              <article key={producto.id_producto} className="product-rail__card">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} />
                ) : (
                  <div className="product-rail__placeholder">{producto.nombre.slice(0, 1)}</div>
                )}
                <div className="product-rail__body">
                  <p>{producto.marca || "Producto destacado"}</p>
                  <span>{producto.categoria || "11km"}</span>
                  <strong>{formatPrice(producto.precio)}</strong>
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

export default HeroCarousel;
