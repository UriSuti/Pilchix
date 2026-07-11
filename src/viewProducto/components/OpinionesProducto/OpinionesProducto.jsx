import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import {
  getOpinionesProducto,
  crearOpinion,
  eliminarOpinion,
} from "../../../services/opiniones";
import "./OpinionesProducto.css";

const IconThumbUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);
const IconThumbDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
);

// "hace 3 días", "hace 2 h", "recién"…
function tiempoRelativo(fechaISO) {
  const fecha = new Date(fechaISO);
  const seg = Math.max(0, (Date.now() - fecha.getTime()) / 1000);
  if (seg < 60) return "recién";
  const min = Math.floor(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} ${d === 1 ? "día" : "días"}`;
  return fecha.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function OpinionesProducto({ idProducto, nombreProducto }) {
  const { estaLogueado, idUsuario } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [opiniones, setOpiniones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState("");
  const [recomienda, setRecomienda] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [confirmando, setConfirmando] = useState(null); // id de la opinión a punto de borrarse
  const [verTodas, setVerTodas] = useState(false);

  const VISIBLES = 6; // muestra 3 filas de 2 y el resto detrás de "Ver más"

  useEffect(() => {
    if (!idProducto) return undefined;
    let activo = true;
    setCargando(true);
    getOpinionesProducto(idProducto).then(({ data, error }) => {
      if (!activo) return;
      setOpiniones(!error && data ? data : []);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [idProducto]);

  const total = opiniones.length;
  const recos = opiniones.filter((o) => o.recomienda).length;
  const pct = total ? Math.round((recos / total) * 100) : 0;
  const yaOpino = opiniones.some((o) => o.id_usuario === idUsuario);

  const enviar = async (e) => {
    e.preventDefault();
    if (!estaLogueado) {
      mostrarToast("Iniciá sesión para opinar", "info");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    const t = texto.trim();
    if (t.length < 3) {
      mostrarToast("Escribí un poco más 🙂", "info");
      return;
    }
    setEnviando(true);
    const { data, error } = await crearOpinion({
      id_producto: idProducto,
      id_usuario: idUsuario,
      texto: t,
      recomienda,
    });
    setEnviando(false);
    if (error) {
      mostrarToast(
        error.code === "23505"
          ? "Ya dejaste tu opinión sobre este producto"
          : "No se pudo publicar la opinión",
        "error"
      );
      return;
    }
    setOpiniones((prev) => [data, ...prev]);
    setTexto("");
    setRecomienda(true);
    mostrarToast("¡Gracias por tu opinión!", "exito");
  };

  const borrar = async (id) => {
    setConfirmando(null);
    const previas = opiniones;
    setOpiniones((prev) => prev.filter((o) => o.id_opinion !== id));
    const { error } = await eliminarOpinion(id);
    if (error) {
      setOpiniones(previas);
      mostrarToast("No se pudo borrar", "error");
    }
  };

  return (
    <section className="opr" id="opiniones">
      <div className="opr__wrap">
        <div className="opr__head">
          <div>
            <p className="opr__eyebrow">Comunidad</p>
            <h2 className="opr__titulo">
              Opiniones{total > 0 ? ` (${total})` : ""}
            </h2>
          </div>
          {total > 0 && (
            <span className="opr__score">
              <IconThumbUp /> {pct}% lo recomienda
            </span>
          )}
        </div>

        {!yaOpino && (
          <form className="opr__form" onSubmit={enviar}>
            <textarea
              className="opr__textarea"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={
                estaLogueado
                  ? `¿Qué te pareció ${nombreProducto || "este producto"}?`
                  : "Iniciá sesión para dejar tu opinión…"
              }
              maxLength={500}
              rows={3}
              onFocus={() => {
                if (!estaLogueado) {
                  mostrarToast("Iniciá sesión para opinar", "info");
                  navigate("/login", { state: { from: location.pathname } });
                }
              }}
            />
            <div className="opr__form-foot">
              <div className="opr__toggle">
                <button
                  type="button"
                  className={`opr__toggle-btn ${recomienda ? "is-on" : ""}`}
                  onClick={() => setRecomienda(true)}
                >
                  <IconThumbUp /> Lo recomiendo
                </button>
                <button
                  type="button"
                  className={`opr__toggle-btn ${!recomienda ? "is-on is-con" : ""}`}
                  onClick={() => setRecomienda(false)}
                >
                  <IconThumbDown /> A tener en cuenta
                </button>
              </div>
              <button type="submit" className="opr__enviar" disabled={enviando}>
                {enviando ? "Publicando…" : "Publicar opinión"}
              </button>
            </div>
          </form>
        )}

        {cargando ? (
          <p className="opr__estado">Cargando opiniones…</p>
        ) : total === 0 ? (
          <p className="opr__estado">
            Todavía no hay opiniones. {estaLogueado ? "¡Sé el primero en opinar!" : "Iniciá sesión y sé el primero en opinar."}
          </p>
        ) : (
          <div className="opr__grid">
            {(verTodas ? opiniones : opiniones.slice(0, VISIBLES)).map((op) => (
              <article className="opr__card" key={op.id_opinion}>
                <div className="opr__card-head">
                  <span className="opr__avatar">
                    {op.Usuario?.foto_perfil ? (
                      <img src={op.Usuario.foto_perfil} alt="" />
                    ) : (
                      op.Usuario?.nombre?.charAt(0).toUpperCase() ?? "?"
                    )}
                  </span>
                  <div className="opr__quien">
                    <b>{op.Usuario?.nombre ?? "Usuario"}</b>
                    <span>{tiempoRelativo(op.fecha)}</span>
                  </div>
                  <span className={`opr__tag opr__tag--${op.recomienda ? "pro" : "con"}`}>
                    {op.recomienda ? <IconThumbUp /> : <IconThumbDown />}
                    {op.recomienda ? "Recomienda" : "A tener en cuenta"}
                  </span>
                </div>
                <p className="opr__texto">{op.texto}</p>
                {op.id_usuario === idUsuario &&
                  (confirmando === op.id_opinion ? (
                    <div className="opr__confirm">
                      <span>¿Borrar tu opinión?</span>
                      <button
                        type="button"
                        className="opr__confirm-si"
                        onClick={() => borrar(op.id_opinion)}
                      >
                        Sí, borrar
                      </button>
                      <button
                        type="button"
                        className="opr__confirm-no"
                        onClick={() => setConfirmando(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="opr__borrar"
                      onClick={() => setConfirmando(op.id_opinion)}
                    >
                      Borrar
                    </button>
                  ))}
              </article>
            ))}
          </div>
        )}

        {!verTodas && total > VISIBLES && (
          <div className="opr__vermas">
            <button type="button" onClick={() => setVerTodas(true)}>
              Ver {total - VISIBLES} opiniones más
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default OpinionesProducto;
