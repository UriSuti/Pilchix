import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import {
  iniciarImportacion, getImportacion, confirmarImportacion, cancelarImportacion, getModuloCategorias,
} from "../services/catalogo";
import "./ImportarProductos.css";

const INTERVALO_MS = 1500;
const CLAVE_ACTIVA = "pilchix_importacion_activa";

const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));

function guardarActiva(id) {
  try {
    if (id) sessionStorage.setItem(CLAVE_ACTIVA, id);
    else sessionStorage.removeItem(CLAVE_ACTIVA);
  } catch { /* sin storage: solo se pierde el retomar al recargar */ }
}

function leerActiva() {
  try { return sessionStorage.getItem(CLAVE_ACTIVA); } catch { return null; }
}

function Progreso({ titulo, progreso }) {
  const { hechos = 0, total } = progreso ?? {};
  const pct = total ? Math.round((hechos / total) * 100) : null;
  return (
    <div className="imp__progreso">
      <p>{titulo}</p>
      <div className={`imp__barra ${pct === null ? "is-indeterminada" : ""}`}>
        <span style={pct === null ? undefined : { width: `${pct}%` }} />
      </div>
      <small>{total ? `${hechos} de ${total}` : hechos ? `${hechos} productos encontrados` : "Conectando con tu tienda…"}</small>
    </div>
  );
}

function FilaProducto({ p, edicion, categorias, onCambio }) {
  const [colorNuevo, setColorNuevo] = useState("#123d59");
  const v = { ...p, ...edicion };
  const portada = v.imagenes[0]?.url;
  const set = (campo) => (valor) => onCambio(p.indice, { [campo]: valor });
  const sinColor = !v.colores.length;

  return (
    <article className={`imp-fila ${v.seleccionado ? "" : "is-off"}`}>
      <label className="imp-fila__check">
        <input type="checkbox" checked={v.seleccionado} onChange={(e) => set("seleccionado")(e.target.checked)} />
      </label>

      <a className="imp-fila__img" href={p.url} target="_blank" rel="noreferrer" title="Ver en tu tienda">
        {portada ? <img src={portada} alt="" loading="lazy" /> : <span>Sin foto</span>}
        {v.imagenes.length > 1 && <em>+{v.imagenes.length - 1}</em>}
      </a>

      <div className="imp-fila__datos">
        <input
          className="imp-fila__nombre"
          value={v.nombre}
          onChange={(e) => set("nombre")(e.target.value)}
          aria-label="Nombre"
        />
        <div className="imp-fila__badges">
          {p.yaExiste && <span className="imp-badge is-info">Ya está en tu catálogo</span>}
          {p.repetido && <span className="imp-badge is-info">Repetido en la tienda</span>}
          {sinColor && <span className="imp-badge is-alerta">Sin color</span>}
          {!v.precio && <span className="imp-badge is-alerta">Sin precio</span>}
          {p.stockEstimado && <span className="imp-badge">Stock estimado</span>}
          {!v.imagenes.length && <span className="imp-badge is-alerta">Sin imágenes</span>}
        </div>

        <div className="imp-fila__campos">
          <label>
            Precio
            <input type="number" min="0" value={v.precio} onChange={(e) => set("precio")(e.target.value)} />
          </label>
          <label>
            Stock
            <input type="number" min="0" value={v.stock} onChange={(e) => set("stock")(e.target.value)} />
          </label>
          <label className="imp-fila__talles">
            Talles
            <input
              value={v.tallesTexto ?? v.talles.join(", ")}
              placeholder="S, M, L"
              onChange={(e) => onCambio(p.indice, {
                tallesTexto: e.target.value,
                talles: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })}
            />
          </label>
        </div>

        <div className="imp-fila__extras">
          <div className={`imp-fila__colores ${sinColor ? "is-falta" : ""}`}>
            <span>Colores</span>
            {v.colores.map((c) => (
              <button
                key={c}
                type="button"
                className="imp-color"
                style={{ background: c }}
                title="Quitar color"
                onClick={() => set("colores")(v.colores.filter((x) => x !== c))}
              />
            ))}
            <input type="color" value={colorNuevo} onChange={(e) => setColorNuevo(e.target.value)} aria-label="Color nuevo" />
            <button
              type="button"
              className="imp-fila__mini"
              onClick={() => !v.colores.includes(colorNuevo) && set("colores")([...v.colores, colorNuevo])}
            >
              + agregar
            </button>
          </div>

          <div className="imp-fila__cats">
            <span>Categorías</span>
            {v.categorias.map((id) => (
              <button
                key={id}
                type="button"
                className="imp-chip"
                title="Quitar categoría"
                onClick={() => set("categorias")(v.categorias.filter((x) => x !== id))}
              >
                {categorias.find((c) => c.id_categoria === id)?.nombre ?? id} ×
              </button>
            ))}
            <select
              value=""
              onChange={(e) => e.target.value && set("categorias")([...v.categorias, Number(e.target.value)])}
              aria-label="Agregar categoría"
            >
              <option value="">+ categoría</option>
              {categorias.filter((c) => !v.categorias.includes(c.id_categoria)).map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
              ))}
            </select>
            {p.categoriasTienda.length > 0 && (
              <small title="Categoría en tu tienda">en tu tienda: {p.categoriasTienda.join(" › ")}</small>
            )}
          </div>
        </div>
      </div>

      <div className="imp-fila__precio">{formatPrecio(v.precio)}</div>
    </article>
  );
}

function ImportarProductos() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const [link, setLink] = useState("");
  const [imp, setImp] = useState(null);           // estado que devuelve el backend
  const [ediciones, setEdiciones] = useState({}); // indice → campos cambiados
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [enviando, setEnviando] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    getModuloCategorias().then(({ data }) => data && setCategorias(data.globales));
    // si se recargó la página en medio de una importación, la retoma
    const activa = leerActiva();
    if (activa) consultar(activa);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function consultar(id) {
    const { data, error, status } = await getImportacion(id);
    if (error) {
      guardarActiva(null);
      if (status !== 404) mostrarToast(error, "error");
      setImp(null);
      return;
    }
    setImp(data);
    if (data.estado === "leyendo" || data.estado === "importando") {
      timer.current = setTimeout(() => consultar(id), INTERVALO_MS);
    } else if (data.estado !== "listo") {
      guardarActiva(null);
    }
  }

  const empezar = async (e) => {
    e.preventDefault();
    if (!link.trim()) { mostrarToast("Pegá el link de tu tienda", "error"); return; }
    setEnviando(true);
    const { data, error } = await iniciarImportacion(link.trim());
    setEnviando(false);
    if (error) { mostrarToast(error, "error"); return; }
    setEdiciones({});
    setFiltro("todos");
    guardarActiva(data.id);
    setImp(data);
    timer.current = setTimeout(() => consultar(data.id), INTERVALO_MS);
  };

  const reiniciar = async () => {
    clearTimeout(timer.current);
    if (imp?.id && imp.estado === "listo") await cancelarImportacion(imp.id);
    guardarActiva(null);
    setImp(null);
    setEdiciones({});
  };

  const productos = useMemo(() => imp?.productos ?? [], [imp]);
  const valor = (p) => ({ ...p, ...ediciones[p.indice] });
  const onCambio = (indice, cambios) =>
    setEdiciones((prev) => ({ ...prev, [indice]: { ...prev[indice], ...cambios } }));

  const seleccionados = productos.filter((p) => valor(p).seleccionado);
  const visibles = productos.filter((p) => {
    const v = valor(p);
    if (filtro === "seleccionados") return v.seleccionado;
    if (filtro === "revisar") return !v.colores.length || !Number(v.precio) || !v.categorias.length;
    if (filtro === "existentes") return p.yaExiste || p.repetido;
    return true;
  });
  const sinColorSel = seleccionados.filter((p) => !valor(p).colores.length).length;

  const marcarTodos = (si) =>
    setEdiciones((prev) => {
      const nuevo = { ...prev };
      for (const p of visibles) nuevo[p.indice] = { ...nuevo[p.indice], seleccionado: si };
      return nuevo;
    });

  const importar = async () => {
    if (!seleccionados.length) { mostrarToast("Elegí al menos un producto", "error"); return; }
    setEnviando(true);
    const { data, error } = await confirmarImportacion(
      imp.id,
      seleccionados.map((p) => {
        const v = valor(p);
        return {
          indice: p.indice,
          nombre: v.nombre,
          descripcion: v.descripcion,
          precio: Number(v.precio) || 0,
          stock: Number(v.stock) || 0,
          talles: v.talles,
          colores: v.colores,
          categorias: v.categorias,
          imagenes: v.imagenes.map((i) => i.url),
        };
      })
    );
    setEnviando(false);
    if (error) { mostrarToast(error, "error"); return; }
    setImp(data);
    timer.current = setTimeout(() => consultar(data.id), INTERVALO_MS);
  };

  const estado = imp?.estado;

  return (
    <div className="imp">
      <header className="imp__head">
        <div>
          <h1>Importar productos</h1>
          <p>Traé tu catálogo desde tu tienda online (Tiendanube, Shopify, WooCommerce u otra).</p>
        </div>
        <button className="imp__btn-sec" onClick={() => navigate("/admin/catalogo")}>Volver al catálogo</button>
      </header>

      {!imp && (
        <form className="imp__caja" onSubmit={empezar}>
          <label htmlFor="imp-link">Link de tu tienda</label>
          <div className="imp__link">
            <input
              id="imp-link"
              type="text"
              inputMode="url"
              placeholder="https://mitienda.com.ar o mitienda.mitiendanube.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              autoFocus
            />
            <button className="imp__btn-pri" disabled={enviando}>
              {enviando ? "Conectando…" : "Buscar productos"}
            </button>
          </div>
          <p className="imp__ayuda">
            Leemos los productos publicados en tu tienda: nombre, precio, stock, talles, colores y fotos.
            Antes de guardar vas a poder revisar y corregir cada uno. Hasta 500 productos por vez.
          </p>
        </form>
      )}

      {estado === "leyendo" && (
        <div className="imp__caja">
          <Progreso titulo={`Leyendo los productos de ${imp.link}…`} progreso={imp.progreso} />
        </div>
      )}

      {estado === "error" && (
        <div className="imp__caja imp__caja--error">
          <p>{imp.error}</p>
          <button className="imp__btn-pri" onClick={reiniciar}>Probar con otro link</button>
        </div>
      )}

      {estado === "listo" && (
        <>
          <div className="imp__resumen">
            <p>
              Encontramos <strong>{productos.length}</strong> productos en <strong>{imp.plataforma}</strong>
              {productos.length >= imp.maxProductos && " (el máximo por importación)"}.
              {imp.noLeidos.length > 0 && ` ${imp.noLeidos.length} no se pudieron leer.`}
            </p>
            <button className="imp__btn-sec" onClick={reiniciar}>Cambiar link</button>
          </div>

          <div className="imp__barra-herr">
            <div className="imp__filtros">
              {[
                ["todos", `Todos (${productos.length})`],
                ["seleccionados", `Seleccionados (${seleccionados.length})`],
                ["revisar", "Para revisar"],
                ["existentes", "Ya cargados"],
              ].map(([clave, texto]) => (
                <button key={clave} className={filtro === clave ? "is-activo" : ""} onClick={() => setFiltro(clave)}>
                  {texto}
                </button>
              ))}
            </div>
            <div className="imp__filtros">
              <button onClick={() => marcarTodos(true)}>Marcar visibles</button>
              <button onClick={() => marcarTodos(false)}>Desmarcar visibles</button>
            </div>
          </div>

          <div className="imp__lista">
            {visibles.map((p) => (
              <FilaProducto key={p.indice} p={p} edicion={ediciones[p.indice]} categorias={categorias} onCambio={onCambio} />
            ))}
            {!visibles.length && <p className="imp__vacio">No hay productos en este filtro.</p>}
          </div>

          <footer className="imp__pie">
            <span>
              {seleccionados.length} productos seleccionados
              {sinColorSel > 0 && ` · ${sinColorSel} sin color (el estilista no los va a poder combinar bien)`}
            </span>
            <button className="imp__btn-pri" onClick={importar} disabled={enviando || !seleccionados.length}>
              {enviando ? "Enviando…" : `Importar ${seleccionados.length} productos`}
            </button>
          </footer>
        </>
      )}

      {estado === "importando" && (
        <div className="imp__caja">
          <Progreso titulo="Guardando productos y copiando las fotos…" progreso={imp.progreso} />
          <p className="imp__ayuda">Podés salir de esta página: la importación sigue sola.</p>
        </div>
      )}

      {estado === "terminado" && (
        <div className="imp__caja">
          <h2>¡Listo!</h2>
          <p>Se importaron <strong>{imp.resultado.creados}</strong> productos.</p>
          {imp.resultado.imagenesFallidas > 0 && (
            <p className="imp__ayuda">{imp.resultado.imagenesFallidas} fotos no se pudieron copiar; podés subirlas desde cada producto.</p>
          )}
          {imp.resultado.errores.length > 0 && (
            <details className="imp__errores">
              <summary>{imp.resultado.errores.length} productos no se pudieron guardar</summary>
              <ul>{imp.resultado.errores.map((e, i) => <li key={i}>{e.nombre}</li>)}</ul>
            </details>
          )}
          <div className="imp__acciones">
            <button className="imp__btn-pri" onClick={() => navigate("/admin/catalogo")}>Ver catálogo</button>
            <button className="imp__btn-sec" onClick={reiniciar}>Importar otra tienda</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportarProductos;
