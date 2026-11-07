import "./ViewLocales.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import { getLocales } from "../viewLanding/services/landing";
import ReelLocales from "./components/ReelLocales/ReelLocales";
import CintaMarcas from "./components/ReelLocales/CintaMarcas";
import MiniPaginaLocal from "./components/MiniPaginaLocal/MiniPaginaLocal";
import { coincide, estadisticas, normalizarLocal, ordenarDestacados } from "./helpers/locales";
import { useReducirMovimiento } from "./hooks/useReducirMovimiento";

function MiniPaginaSkeleton() {
  return (
    <div className="loc-skmp" aria-hidden="true">
      <div className="loc-sk loc-skmp__banner" />
      <div className="loc-skmp__fila">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="loc-sk loc-skmp__prenda" />
        ))}
      </div>
    </div>
  );
}

// alto del header sticky, para que los saltos de scroll no queden tapados
function useAltoHeader(ref) {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header || !ref.current) return;
    const nodo = ref.current;
    const medir = () => nodo.style.setProperty("--loc-header-h", `${header.offsetHeight}px`);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(header);
    return () => ro.disconnect();
  }, [ref]);
}

function ViewLocales() {
  const paginaRef = useRef(null);
  const resultadosRef = useRef(null);
  const reducir = useReducirMovimiento();
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const pendienteRef = useRef(null);
  useAltoHeader(paginaRef);

  useEffect(() => {
    let activo = true;
    getLocales().then(({ data, error }) => {
      if (!activo) return;
      setLocales(ordenarDestacados((!error && data ? data : []).map(normalizarLocal)));
      setLoading(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  const stats = useMemo(() => estadisticas(locales), [locales]);
  const visibles = useMemo(() => locales.filter((l) => coincide(l, q)), [locales, q]);
  const conducta = reducir ? "auto" : "smooth";

  // "Ver presentación" en la portada: baja hasta la mini página de ese local
  // (si la búsqueda la escondía, primero se limpia y se salta tras el render)
  const irALocal = (id) =>
    document.getElementById(`local-${id}`)?.scrollIntoView({ behavior: conducta, block: "start" });
  const presentar = (local) => {
    if (coincide(local, q)) return irALocal(local.id);
    pendienteRef.current = local.id;
    setQ("");
  };
  useEffect(() => {
    if (pendienteRef.current === null) return;
    irALocal(pendienteRef.current);
    pendienteRef.current = null;
  });

  return (
    <div className="view-locales" ref={paginaRef}>
      <Header />

      <ReelLocales
        locales={locales}
        stats={stats}
        cargando={loading}
        q={q}
        onBuscar={setQ}
        onEnviarBusqueda={() => resultadosRef.current?.scrollIntoView({ behavior: conducta, block: "start" })}
        onPresentar={presentar}
      />
      <CintaMarcas locales={locales} />

      <main className="loc-wrap loc-main" ref={resultadosRef}>
        {loading ? (
          <div className="loc-lista">
            <MiniPaginaSkeleton />
            <MiniPaginaSkeleton />
          </div>
        ) : visibles.length === 0 ? (
          <div className="loc-empty">
            <p>
              {locales.length === 0
                ? "Todavía no hay locales."
                : `No hay locales que coincidan con “${q.trim()}”. Probá con otro barrio o estilo.`}
            </p>
            {locales.length > 0 && (
              <button type="button" className="loc-empty__btn" onClick={() => setQ("")}>
                Ver todos los locales
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="loc-count" aria-live="polite">
              {q.trim()
                ? `${visibles.length} ${visibles.length === 1 ? "local" : "locales"} para “${q.trim()}”`
                : `${visibles.length} ${visibles.length === 1 ? "local" : "locales"}`}
            </p>
            <div className="loc-lista">
              {visibles.map((l) => (
                <MiniPaginaLocal key={l.id} local={l} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ViewLocales;
