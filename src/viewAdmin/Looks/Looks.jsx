import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { getProductosDeMarca } from "../services/catalogo";
import { getMisLooks, crearLook, borrarLook } from "../../services/looks";
import { getImagenPortada } from "../../utils/producto";
import "../AgregarProducto/AgregarProducto.css";
import "./Looks.css";

function Looks() {
  const { mostrarToast } = useToast();

  const [looks, setLooks] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // form
  const [imagen, setImagen] = useState(null); // { file, preview }
  const [imagenHover, setImagenHover] = useState(null); // 2da foto (efecto hover), opcional
  const [titulo, setTitulo] = useState("");
  const [seleccionados, setSeleccionados] = useState([]); // ids de producto
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    const [{ data: ls }, { data: ps }] = await Promise.all([getMisLooks(), getProductosDeMarca()]);
    setLooks(ls ?? []);
    setProductos(ps ?? []);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const onImagen = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) setter({ file, preview: URL.createObjectURL(file) });
  };

  const toggleProducto = (id) =>
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const limpiarForm = () => {
    setImagen(null);
    setImagenHover(null);
    setTitulo("");
    setSeleccionados([]);
  };

  const publicar = async (e) => {
    e.preventDefault();
    if (!imagen) { mostrarToast("Subí una foto para el look", "error"); return; }
    if (seleccionados.length === 0) { mostrarToast("Elegí al menos un producto del look", "error"); return; }

    setGuardando(true);
    const { error } = await crearLook({
      imagen: imagen.file,
      imagenHover: imagenHover?.file,
      titulo: titulo.trim(),
      productos: seleccionados,
    });
    setGuardando(false);
    if (error) { mostrarToast(error, "error"); return; }

    mostrarToast("Look publicado", "exito");
    limpiarForm();
    cargar();
  };

  const eliminar = async (idLook) => {
    if (!window.confirm("¿Borrar este look?")) return;
    const previos = looks;
    setLooks((prev) => prev.filter((l) => l.id_look !== idLook));
    const { error } = await borrarLook(idLook);
    if (error) { setLooks(previos); mostrarToast(error, "error"); }
    else mostrarToast("Look borrado", "info");
  };

  return (
    <div className="ap">
      <header className="ap__head">
        <div>
          <h1>Shop the Look</h1>
          <p style={{ color: "#5f6368", margin: "4px 0 0" }}>
            Subí una foto de un outfit y etiquetá tus productos. Aparece en la landing.
          </p>
        </div>
      </header>

      <div className="ap__grid">
        {/* columna izquierda: crear look */}
        <section className="ap__col">
          <form className="ap__card" onSubmit={publicar}>
            <h2>Nuevo look</h2>

            <label className="ap__field"><span>Título (opcional)</span>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Look urbano otoño" />
            </label>

            <div className="ap__field">
              <span>Fotos del look</span>
              <div className="look-fotos">
                <div className="look-foto-slot">
                  {imagen ? (
                    <div className="look-preview">
                      <img src={imagen.preview} alt="" />
                      <button type="button" onClick={() => setImagen(null)}>✕</button>
                    </div>
                  ) : (
                    <label className="ap__dropzone">
                      <input type="file" accept="image/*" hidden onChange={onImagen(setImagen)} />
                      <span>+ Foto principal</span>
                    </label>
                  )}
                  <small className="look-foto-hint">Principal</small>
                </div>

                <div className="look-foto-slot">
                  {imagenHover ? (
                    <div className="look-preview">
                      <img src={imagenHover.preview} alt="" />
                      <button type="button" onClick={() => setImagenHover(null)}>✕</button>
                    </div>
                  ) : (
                    <label className="ap__dropzone">
                      <input type="file" accept="image/*" hidden onChange={onImagen(setImagenHover)} />
                      <span>+ Foto hover</span>
                    </label>
                  )}
                  <small className="look-foto-hint">Al pasar el cursor (opcional)</small>
                </div>
              </div>
            </div>

            <div className="ap__field">
              <span>Productos del look ({seleccionados.length})</span>
              {productos.length === 0 ? (
                <p className="look-empty">Primero cargá productos en tu catálogo.</p>
              ) : (
                <div className="look-picker">
                  {productos.map((p) => {
                    const portada = getImagenPortada(p.Imagen);
                    const on = seleccionados.includes(p.id_producto);
                    return (
                      <button
                        type="button"
                        key={p.id_producto}
                        className={`look-pick ${on ? "is-on" : ""}`}
                        onClick={() => toggleProducto(p.id_producto)}
                      >
                        <div className="look-pick__img">
                          {portada?.imagen ? <img src={portada.imagen} alt="" /> : <span>{p.nombre?.charAt(0)}</span>}
                          {on && <span className="look-pick__check">✓</span>}
                        </div>
                        <span className="look-pick__nombre">{p.nombre}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button type="submit" className="ap__btn-pri" disabled={guardando} style={{ width: "100%" }}>
              {guardando ? "Publicando…" : "Publicar look"}
            </button>
          </form>
        </section>

        {/* columna derecha: looks publicados */}
        <section className="ap__col">
          <div className="ap__card">
            <h2>Looks publicados ({looks.length})</h2>
            {cargando ? (
              <p className="look-empty">Cargando…</p>
            ) : looks.length === 0 ? (
              <p className="look-empty">Todavía no publicaste ningún look.</p>
            ) : (
              <div className="look-list">
                {looks.map((l) => (
                  <article className="look-item" key={l.id_look}>
                    <div className="look-item__img">
                      <img src={l.imagen} alt={l.titulo || "Look"} />
                    </div>
                    <div className="look-item__body">
                      <strong>{l.titulo || "Sin título"}</strong>
                      <span>{l.Look_Producto?.length ?? 0} productos</span>
                    </div>
                    <button type="button" className="look-item__del" onClick={() => eliminar(l.id_look)}>
                      Borrar
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Looks;
