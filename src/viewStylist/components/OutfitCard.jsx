import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { agregarFavorito } from "../../viewPerfil/services/perfil";
import { cambiarPrenda } from "../services/stylist";
import { TIPOS_OUTFIT, CAMBIOS_RAPIDOS, formatPrecio } from "../constants";
import { IconFlecha } from "./Iconos.jsx";
import ProbadorVirtualModal from "../../viewProducto/components/ProbadorVirtualModal/ProbadorVirtualModal.jsx";

function PanelCambio({ prenda, cargando, onPedir, onCerrar }) {
  const [texto, setTexto] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    onPedir(texto.trim());
  };

  return (
    <form className="sty-cambio" onSubmit={enviar}>
      <p className="sty-cambio__titulo">¿Qué querés cambiar de <b>{prenda.nombre}</b>?</p>
      <div className="sty-chips">
        {CAMBIOS_RAPIDOS.map((c) => (
          <button key={c} type="button" className="sty-chip" disabled={cargando} onClick={() => onPedir(c)}>
            {c}
          </button>
        ))}
      </div>
      <input
        className="sty-input"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O contalo con tus palabras…"
        disabled={cargando}
        maxLength={300}
      />
      <div className="sty-cambio__acciones">
        <button type="button" className="sty-btn-sec" onClick={onCerrar} disabled={cargando}>
          Cancelar
        </button>
        <button type="submit" className="sty-btn sty-btn--sm" disabled={cargando}>
          {cargando ? "Buscando…" : "Cambiar prenda"}
        </button>
      </div>
    </form>
  );
}

// Un outfit con sus prendas. Se puede cambiar una sola prenda (función B), guardar
// en favoritos, abrir cada producto o mandarlo al probador virtual.
// Es controlado: el outfit vive en ViewStylist para que el cambio se mantenga entre pasos.
function OutfitCard({ outfit, onChange, preferencias, onElegir, destacado = false }) {
  const { idUsuario } = useAuth();
  const { mostrarToast } = useToast();
  const [cambiandoId, setCambiandoId] = useState(null);
  const [cargandoCambio, setCargandoCambio] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [probando, setProbando] = useState(null); // props del probador: { prendas } (el look completo)
  const [guardando, setGuardando] = useState(false);

  const tipo = TIPOS_OUTFIT[outfit.tipo] ?? { label: outfit.tipo };
  const presupuesto = Number(preferencias?.presupuesto) || null;
  const probables = outfit.prendas.filter((p) => p.imagen);

  const pedirCambio = async (pedido) => {
    setCargandoCambio(true);
    setAviso(null);
    try {
      const { reemplazo, motivo, explicacion } = await cambiarPrenda({
        preferencias,
        outfit,
        idProducto: cambiandoId,
        pedido,
      });
      if (!reemplazo) {
        setAviso(motivo || "No encontramos una alternativa para esa prenda.");
        return;
      }
      const prendas = outfit.prendas.map((p) => (p.id_producto === cambiandoId ? reemplazo : p));
      const total = prendas.reduce((acc, p) => acc + p.precio, 0);
      onChange({
        ...outfit,
        prendas,
        total,
        explicacion: explicacion || outfit.explicacion,
        supera_presupuesto: Boolean(presupuesto && total > presupuesto),
      });
      setAviso(motivo);
      setCambiandoId(null);
    } catch (err) {
      mostrarToast(err.message || "No se pudo cambiar la prenda", "error");
    } finally {
      setCargandoCambio(false);
    }
  };

  const guardarEnFavoritos = async () => {
    setGuardando(true);
    const resultados = await Promise.all(
      outfit.prendas.map((p) => agregarFavorito(idUsuario, p.id_producto))
    );
    setGuardando(false);
    // si alguna ya estaba en favoritos el back devuelve error: no es un problema real
    const guardadas = resultados.filter((r) => !r.error).length;
    mostrarToast(
      guardadas > 0 ? "Guardamos el look en tus favoritos" : "Estas prendas ya estaban en tus favoritos",
      "exito"
    );
  };

  return (
    <article className={`sty-look sty-look--${outfit.tipo} ${destacado ? "sty-look--destacado" : ""}`}>
      <header className="sty-look__head">
        <span className="sty-look__tipo">{tipo.label}</span>
        <h3 className="sty-look__titulo">{outfit.titulo}</h3>
        <p className="sty-look__explicacion">{outfit.explicacion}</p>
      </header>

      <ul className="sty-prendas">
        {outfit.prendas.map((p) => (
          <Fragment key={p.id_producto}>
            <li className={`sty-prenda ${cambiandoId === p.id_producto ? "is-cambiando" : ""}`}>
              <Link to={`/producto/${slugify(p.nombre)}`} className="sty-prenda__media" title={p.nombre}>
                {p.imagen ? <img src={p.imagen} alt={p.nombre} loading="lazy" /> : <span>{p.nombre.charAt(0)}</span>}
              </Link>
              <Link to={`/producto/${slugify(p.nombre)}`} className="sty-prenda__nombre" title={`${p.nombre} · ${p.marca}`}>
                {p.nombre}
              </Link>
              <p className="sty-prenda__precio">
                {formatPrecio(p.precio)}
                {p.precio_original && <s>{formatPrecio(p.precio_original)}</s>}
              </p>
              <div className="sty-prenda__acciones">
                <button
                  type="button"
                  className="sty-link"
                  onClick={() => { setCambiandoId(p.id_producto); setAviso(null); }}
                  disabled={cargandoCambio}
                >
                  Cambiar
                </button>
              </div>
            </li>
            {/* el panel ocupa todo el ancho de la grilla, debajo de la prenda */}
            {cambiandoId === p.id_producto && (
              <li className="sty-prendas__panel">
                <PanelCambio
                  prenda={p}
                  cargando={cargandoCambio}
                  onPedir={pedirCambio}
                  onCerrar={() => setCambiandoId(null)}
                />
              </li>
            )}
          </Fragment>
        ))}
      </ul>

      {probables.length > 1 && (
        <button
          type="button"
          className="sty-btn-sec sty-look__probar"
          onClick={() => setProbando({ prendas: probables })}
          disabled={cargandoCambio}
        >
          Probarme el look completo
        </button>
      )}

      {aviso && <p className="sty-look__aviso">{aviso}</p>}

      <footer className="sty-look__foot">
        <div>
          <p className="sty-look__total-label">Total del look</p>
          <p className="sty-look__total">{formatPrecio(outfit.total)}</p>
          {outfit.supera_presupuesto && (
            <p className="sty-look__alerta">Supera tu presupuesto de {formatPrecio(presupuesto)}</p>
          )}
        </div>
        {onElegir ? (
          <button type="button" className="sty-btn sty-btn--sm" onClick={onElegir}>
            Elegir este look <IconFlecha />
          </button>
        ) : (
          <button type="button" className="sty-btn-sec" onClick={guardarEnFavoritos} disabled={guardando}>
            {guardando ? "Guardando…" : "♡ Guardar look"}
          </button>
        )}
      </footer>

      {probando && <ProbadorVirtualModal {...probando} onClose={() => setProbando(null)} />}
    </article>
  );
}

export default OutfitCard;
