import { useToast } from "../../../context/ToastContext";
import "./ComunidadPilchix.css";

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
const IconChat = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// opiniones ilustrativas (así se va a ver la comunidad)
const OPINIONES = [
  { inicial: "M", nombre: "Meli R.", sobre: "Zara", texto: "Compré un tapado y la calidad me sorprendió. Llegó en 2 días, recontra recomiendo.", tipo: "pro" },
  { inicial: "F", nombre: "Fede G.", sobre: "Nike Air Max", texto: "El talle venía más chico que la guía. Ojo con eso antes de comprar.", tipo: "con" },
  { inicial: "J", nombre: "Juli P.", sobre: "una marca chica", texto: "Descubrí un local increíble que no conocía. Precios justos y atención de diez.", tipo: "pro" },
  { inicial: "N", nombre: "Nico T.", sobre: "Adidas", texto: "Buenísimo el producto, pero tardó en llegar. Igual volvería a comprar.", tipo: "con" },
];

function ComunidadPilchix({ max }) {
  const { mostrarToast } = useToast();
  const opiniones = typeof max === "number" ? OPINIONES.slice(0, max) : OPINIONES;

  return (
    <section className="comu" id="comunidad">
      <div className="comu__wrap">
        <div className="comu__head">
          <div>
            <p className="comu__eyebrow">Comunidad</p>
            <h2 className="comu__titulo">Una comunidad abierta, sin vueltas</h2>
          </div>
          <span className="comu__badge">
            <IconChat /> Muy pronto
          </span>
        </div>

        <p className="comu__intro">
          Hablá con otros, opiná sobre marcas y productos —lo bueno y lo malo— y enterate qué recomienda
          la gente antes de comprar. Reseñas reales, sin filtros.
        </p>

        <div className="comu__grid">
          {opiniones.map((op) => (
            <article className="op" key={op.nombre}>
              <div className="op__head">
                <span className="op__avatar">{op.inicial}</span>
                <div className="op__quien">
                  <b>{op.nombre}</b>
                  <span>opinó sobre {op.sobre}</span>
                </div>
                <span className={`op__tag op__tag--${op.tipo}`}>
                  {op.tipo === "pro" ? <IconThumbUp /> : <IconThumbDown />}
                  {op.tipo === "pro" ? "Recomienda" : "A tener en cuenta"}
                </span>
              </div>
              <p className="op__texto">{op.texto}</p>
            </article>
          ))}
        </div>

        <div className="comu__cta">
          <button
            type="button"
            className="comu__btn"
            onClick={() => mostrarToast("Próximamente 🙂", "info")}
          >
            Sumate a la comunidad
          </button>
        </div>
      </div>
    </section>
  );
}

export default ComunidadPilchix;
