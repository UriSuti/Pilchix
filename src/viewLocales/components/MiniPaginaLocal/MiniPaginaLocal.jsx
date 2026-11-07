import "./MiniPaginaLocal.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Producto from "../../../viewLocal/components/Producto/Producto";
import { slugify } from "../../../utils/slugify";
import { ETIQUETA_APERTURA, estadoApertura, horarioDeHoy, inicial } from "../../helpers/locales";

const MAX_PRODUCTOS = 10;

const IconEstrella = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z" />
  </svg>
);
const IconFlecha = ({ izquierda }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points={izquierda ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
  </svg>
);

// fila de productos con flechas; las flechas se apagan en los extremos
function Carrusel({ children, etiqueta }) {
  const trackRef = useRef(null);
  const [bordes, setBordes] = useState({ inicio: true, fin: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const medir = () =>
      setBordes({
        inicio: track.scrollLeft <= 4,
        fin: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    medir();
    track.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, []);

  const mover = (dir) => {
    const track = trackRef.current;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reducir ? "auto" : "smooth" });
  };

  return (
    <div className="mp__carrusel">
      <div className="mp__carrusel-top">
        <h3 className="mp__carrusel-titulo">{etiqueta}</h3>
        {!(bordes.inicio && bordes.fin) && (
          <div className="mp__flechas">
            <button type="button" onClick={() => mover(-1)} disabled={bordes.inicio} aria-label="Ver anteriores">
              <IconFlecha izquierda />
            </button>
            <button type="button" onClick={() => mover(1)} disabled={bordes.fin} aria-label="Ver más">
              <IconFlecha />
            </button>
          </div>
        )}
      </div>
      <ul className="mp__track" ref={trackRef}>
        {children}
      </ul>
    </div>
  );
}

// "Mini página" de un local: banner con la marca y, debajo, sus productos más
// vendidos en fila horizontal. Cada dato aparece solo si existe.
function MiniPaginaLocal({ local }) {
  const [sinFachada, setSinFachada] = useState(!local.fachada);
  const [sinLogo, setSinLogo] = useState(!local.logo);
  const urlLocal = `/${slugify(local.nombre)}`;
  const estado = estadoApertura(local);
  const horario = horarioDeHoy(local);
  const texto = local.frase || local.descripcion;
  const productos = local.productos.slice(0, MAX_PRODUCTOS);
  const cant = local.cantidadProductos;
  const meta = [
    local.ubicacion,
    local.anioFundacion && `desde ${local.anioFundacion}`,
    horario,
    local.envio,
  ].filter(Boolean);

  return (
    <section className="mp" id={`local-${local.id}`} aria-labelledby={`local-${local.id}-nombre`}>
      <header className="mp__banner">
        <div className="mp__foto" aria-hidden="true">
          {sinFachada ? (
            <span className="mp__mono">{inicial(local.nombre)}</span>
          ) : (
            <img src={local.fachada} alt="" loading="lazy" onError={() => setSinFachada(true)} />
          )}
        </div>

        <div className="mp__banner-inner">
          <span className="mp__logo" aria-hidden="true">
            {sinLogo ? inicial(local.nombre) : <img src={local.logo} alt="" onError={() => setSinLogo(true)} />}
          </span>

          <div className="mp__datos">
            {(estado || local.etiquetas.length > 0) && (
              <ul className="mp__chips">
                {estado && (
                  <li className={`mp__estado mp__estado--${estado}`}>
                    {estado === "abierto" && <i aria-hidden="true" />}
                    {ETIQUETA_APERTURA[estado]}
                  </li>
                )}
                {local.etiquetas.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
            <h2 className="mp__nombre" id={`local-${local.id}-nombre`}>
              {local.nombre}
            </h2>
            <p className="mp__meta">
              {local.recomendacion !== null && (
                <span
                  className="mp__rating"
                  title={`${local.recomendacion}% lo recomienda`}
                >
                  <IconEstrella />
                  {local.recomendacion}%
                  <small>
                    ({local.opiniones} {local.opiniones === 1 ? "opinión" : "opiniones"})
                  </small>
                </span>
              )}
              {meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </p>
            {texto && <p className={`mp__frase ${local.frase ? "mp__frase--cita" : ""}`}>{texto}</p>}
          </div>

          <Link className="mp__ver" to={urlLocal}>
            Ver local <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      {productos.length > 0 ? (
        <Carrusel etiqueta="Lo más vendido">
          {productos.map((p) => (
            <li key={p.id} className="mp__item">
              <Producto
                producto={{
                  id_producto: p.id,
                  nombre: p.nombre,
                  precio: p.precio,
                  Imagen: [{ imagen: p.imagen, es_portada: true }],
                }}
              />
            </li>
          ))}
          <li className="mp__item mp__item--mas">
            <Link to={urlLocal} className="mp__mas">
              <span className="mp__mas-flecha" aria-hidden="true">→</span>
              <b>Ver todo el local</b>
              <span>
                {cant} {cant === 1 ? "prenda" : "prendas"}
              </span>
            </Link>
          </li>
        </Carrusel>
      ) : (
        <p className="mp__vacio">Este local todavía no publicó prendas.</p>
      )}
    </section>
  );
}

export default MiniPaginaLocal;
