import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { importacionApi } from "../services/importacion";
import { categoriasApi } from "../services/categorias";
import { useToast } from "../../context/ToastContext";
import "./ImportarTiendanube.css";

const PAUSA_MS = 400; // entre producto y producto, para no saturar la tienda

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const fmtARS = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));
const nombreDesdeUrl = (url) =>
  decodeURIComponent(url.replace(/\/$/, "").split("/").pop() ?? "").replace(/-/g, " ");

function ImportarTiendanube() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const [paso, setPaso] = useState("inicio"); // inicio | listo | importando | fin
  const [link, setLink] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [tienda, setTienda] = useState(null); // { tienda, total, productos: [{ url, yaImportado }] }

  const [progreso, setProgreso] = useState({ hechos: 0, total: 0, actual: "" });
  const [importados, setImportados] = useState([]);
  const [revisar, setRevisar] = useState([]);
  const [errores, setErrores] = useState([]);
  const [duplicados, setDuplicados] = useState(0);

  const [globales, setGlobales] = useState([]);
  const [eleccion, setEleccion] = useState({}); // url -> id_categoria
  const [resolviendo, setResolviendo] = useState(null);
  const cancelarRef = useRef(false);

  useEffect(() => {
    categoriasApi.getModulo().then((d) => setGlobales(d.globales ?? [])).catch(() => {});
  }, []);

  // avisa si se intenta cerrar la pestaña a mitad de la importación
  useEffect(() => {
    if (paso !== "importando") return;
    const aviso = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [paso]);

  // url -> categorías de la tienda donde aparece (pista para adivinar la categoría)
  const pistas = useMemo(
    () => new Map((tienda?.productos ?? []).map((p) => [p.url, p.categorias ?? []])),
    [tienda]
  );

  const pendientes = tienda?.productos.filter((p) => !p.yaImportado) ?? [];
  const yaImportados = (tienda?.productos.length ?? 0) - pendientes.length;

  const buscar = async (e) => {
    e.preventDefault();
    if (!link.trim()) return;
    setBuscando(true);
    try {
      setTienda(await importacionApi.listar(link.trim()));
      setPaso("listo");
    } catch (err) {
      mostrarToast(err.message, "error");
    } finally {
      setBuscando(false);
    }
  };

  const procesar = async (url) => {
    try {
      const r = await importacionApi.importar(url, null, pistas.get(url));
      if (r.estado === "importado") setImportados((prev) => [...prev, r]);
      else if (r.estado === "revisar") {
        setRevisar((prev) => [...prev.filter((x) => x.url !== r.url), r]);
        setEleccion((prev) => ({ ...prev, [r.url]: r.sugeridas?.[0]?.id_categoria ?? "" }));
      } else if (r.estado === "duplicado") setDuplicados((n) => n + 1);
      return true;
    } catch (err) {
      setErrores((prev) => [...prev.filter((x) => x.url !== url), { url, mensaje: err.message }]);
      return false;
    }
  };

  const importar = async (urls) => {
    cancelarRef.current = false;
    setPaso("importando");
    let hechos = 0;
    for (const url of urls) {
      if (cancelarRef.current) break;
      setProgreso({ hechos, total: urls.length, actual: nombreDesdeUrl(url) });
      await procesar(url);
      hechos += 1;
      await esperar(PAUSA_MS);
    }
    setProgreso({ hechos, total: urls.length, actual: "" });
    setPaso("fin");
  };

  const importarTodo = () => {
    setImportados([]);
    setRevisar([]);
    setErrores([]);
    setDuplicados(0);
    importar(pendientes.map((p) => p.url));
  };

  const reintentarErrores = () => {
    const urls = errores.map((e) => e.url);
    setErrores([]);
    importar(urls);
  };

  const resolver = async (item) => {
    const idCategoria = Number(eleccion[item.url]);
    if (!idCategoria) { mostrarToast("Elegí una categoría", "error"); return; }
    setResolviendo(item.url);
    try {
      const r = await importacionApi.importar(item.url, idCategoria, pistas.get(item.url));
      setRevisar((prev) => prev.filter((x) => x.url !== item.url));
      if (r.estado === "importado") setImportados((prev) => [...prev, r]);
      mostrarToast(`${item.producto.nombre} importado`, "exito");
    } catch (err) {
      mostrarToast(err.message, "error");
    } finally {
      setResolviendo(null);
    }
  };

  const omitir = (item) => setRevisar((prev) => prev.filter((x) => x.url !== item.url));

  const reiniciar = () => {
    setPaso("inicio");
    setTienda(null);
    setImportados([]);
    setRevisar([]);
    setErrores([]);
    setDuplicados(0);
  };

  const porcentaje = progreso.total ? Math.round((progreso.hechos / progreso.total) * 100) : 0;
  const conAvisos = importados.filter((p) => p.avisos?.length);

  return (
    <div className="imp">
      <header className="imp__head">
        <h1>Importar desde Tiendanube</h1>
        <p>Traé el catálogo de tu tienda Tiendanube a Pilchix con datos, talles, colores e imágenes.</p>
      </header>

      {paso === "inicio" && (
        <form className="imp__card" onSubmit={buscar}>
          <label className="imp__field">
            <span>Link de tu tienda</span>
            <input
              type="text"
              placeholder="https://tumarca.mitiendanube.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={buscando}
            />
          </label>
          <label className="imp__check">
            <input type="checkbox" checked={confirmado} onChange={(e) => setConfirmado(e.target.checked)} />
            Confirmo que esta tienda es de mi marca
          </label>
          <button className="imp__btn" type="submit" disabled={!confirmado || !link.trim() || buscando}>
            {buscando ? "Leyendo productos y categorías (puede tardar un poco)..." : "Buscar productos"}
          </button>
        </form>
      )}

      {paso === "listo" && tienda && (
        <div className="imp__card">
          <p className="imp__resumen">
            Encontramos <b>{tienda.total}</b> productos
            {(() => {
              const n = new Set(tienda.productos.flatMap((p) => p.categorias ?? [])).size;
              return n ? <> en <b>{n}</b> categorías</> : null;
            })()}{" "}
            de <b>{tienda.tienda}</b>
            {yaImportados > 0 && <> · {yaImportados} ya estaban importados</>}
            {tienda.total > tienda.productos.length && <> · se procesan los primeros {tienda.productos.length}</>}
          </p>
          <p className="imp__nota">
            La categoría de cada producto se asigna sola. Si hay dudas, te los dejamos al final para que elijas.
          </p>
          <div className="imp__acciones">
            <button className="imp__btn-sec" onClick={reiniciar}>Cambiar link</button>
            <button className="imp__btn" onClick={importarTodo} disabled={!pendientes.length}>
              {pendientes.length ? `Importar ${pendientes.length} productos` : "No hay productos nuevos"}
            </button>
          </div>
        </div>
      )}

      {(paso === "importando" || paso === "fin") && (
        <div className="imp__card">
          <div className="imp__barra-head">
            <span>
              {paso === "importando"
                ? `Importando ${progreso.hechos + 1} de ${progreso.total}${progreso.actual ? ` · ${progreso.actual}` : ""}`
                : `Listo: se procesaron ${progreso.hechos} de ${progreso.total}`}
            </span>
            <strong>{porcentaje}%</strong>
          </div>
          <div className="imp__barra"><div style={{ width: `${porcentaje}%` }} /></div>

          <div className="imp__contadores">
            <span className="imp__chip imp__chip--ok">{importados.length} importados</span>
            <span className="imp__chip imp__chip--duda">{revisar.length} para revisar</span>
            <span className="imp__chip imp__chip--error">{errores.length} con error</span>
            {duplicados > 0 && <span className="imp__chip">{duplicados} ya existían</span>}
          </div>

          <div className="imp__acciones">
            {paso === "importando" ? (
              <button className="imp__btn-sec" onClick={() => { cancelarRef.current = true; }}>
                Frenar
              </button>
            ) : (
              <>
                <button className="imp__btn-sec" onClick={reiniciar}>Importar otra tienda</button>
                <button className="imp__btn" onClick={() => navigate("/admin/catalogo")}>Ver catálogo</button>
              </>
            )}
          </div>
        </div>
      )}

      {revisar.length > 0 && (
        <section className="imp__card">
          <h2>Para revisar</h2>
          <p className="imp__nota">No pudimos decidir la categoría de estos productos. Elegila y se importan.</p>
          <div className="imp__revisar">
            {revisar.map((item) => (
              <div key={item.url} className="imp-rev">
                {item.producto.imagen ? (
                  <img src={item.producto.imagen} alt="" className="imp-rev__img" />
                ) : (
                  <div className="imp-rev__img imp-rev__img--ph">{item.producto.nombre?.charAt(0)}</div>
                )}
                <div className="imp-rev__info">
                  <strong>{item.producto.nombre}</strong>
                  <span>
                    {fmtARS(item.producto.precio)}
                    {item.producto.categoriaTienda && <> · en tu tienda: {item.producto.categoriaTienda}</>}
                  </span>
                </div>
                <select
                  value={eleccion[item.url] ?? ""}
                  onChange={(e) => setEleccion((prev) => ({ ...prev, [item.url]: e.target.value }))}
                >
                  <option value="">Elegí categoría</option>
                  {globales.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                  ))}
                </select>
                <button
                  className="imp__btn imp__btn--chico"
                  onClick={() => resolver(item)}
                  disabled={resolviendo === item.url}
                >
                  {resolviendo === item.url ? "..." : "Importar"}
                </button>
                <button className="imp-rev__omitir" onClick={() => omitir(item)}>Omitir</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {paso === "fin" && errores.length > 0 && (
        <section className="imp__card">
          <div className="imp__seccion-head">
            <h2>Con error</h2>
            <button className="imp__btn-sec" onClick={reintentarErrores}>Reintentar</button>
          </div>
          <ul className="imp__lista">
            {errores.map((e) => (
              <li key={e.url}><b>{nombreDesdeUrl(e.url)}</b><small>{e.mensaje}</small></li>
            ))}
          </ul>
        </section>
      )}

      {paso === "fin" && conAvisos.length > 0 && (
        <section className="imp__card">
          <h2>Importados con avisos</h2>
          <p className="imp__nota">Se crearon igual; revisalos desde el catálogo si querés corregir algo.</p>
          <ul className="imp__lista">
            {conAvisos.map((p) => (
              <li key={p.url}>
                <b>{p.nombre}</b>
                <small>{p.avisos.join(" · ")}</small>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default ImportarTiendanube;
