import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import {
  getCategorias, getEtiquetas, crearProducto, setCategoriasProducto, setSubcategoriasProducto,
  setEtiquetasProducto, subirImagenesProducto,
} from "../services/catalogo";
import TallesPicker from "../components/TallesPicker/TallesPicker";
import CategoriasSubcategoriasPicker from "../components/CategoriasSubcategoriasPicker/CategoriasSubcategoriasPicker";
import EtiquetasPicker from "../components/EtiquetasPicker/EtiquetasPicker";
import { obtenerColorPromedio } from "../../utils/colorImagen";
import "./AgregarProducto.css";

function AgregarProducto() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({
    nombre: "", descripcion: "", precio: "", stock: "", estado: true,
  });
  const [talles, setTalles] = useState([]);
  const [colores, setColores] = useState([]);
  const [colorTemp, setColorTemp] = useState("#123d59");
  const [categorias, setCategorias] = useState([]);
  const [catSeleccionadas, setCatSeleccionadas] = useState([]);
  const [subSeleccionadas, setSubSeleccionadas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiSeleccionadas, setEtiSeleccionadas] = useState([]);
  const [imagenes, setImagenes] = useState([]);      // { file, preview, color, esPortada }[]
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getCategorias().then(({ data }) => setCategorias(data ?? []));
    getEtiquetas().then(({ data }) => setEtiquetas(data ?? []));
  }, []);

  const setCampo = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const agregarColor = () => {
    if (!colores.includes(colorTemp)) setColores([...colores, colorTemp]);
  };
  const quitarColor = (c) => setColores(colores.filter((x) => x !== c));

  const toggleCategoria = (id) =>
    setCatSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSubcategoria = (id) =>
    setSubSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleEtiqueta = (id) =>
    setEtiSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleImagenes = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    setImagenes((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file), color: "", esPortada: false })),
    ]);
    // sugiere un color por defecto tomado de la primera foto, si todavÃ­a no hay colores cargados
    if (files[0] && colores.length === 0) {
      const colorSugerido = await obtenerColorPromedio(files[0]);
      if (colorSugerido) {
        setColorTemp(colorSugerido);
        setColores((prev) => (prev.length === 0 ? [colorSugerido] : prev));
      }
    }
  };
  const quitarImagen = (i) => setImagenes((prev) => prev.filter((_, idx) => idx !== i));
  const setColorImagen = (i, color) =>
    setImagenes((prev) => prev.map((img, idx) => (idx === i ? { ...img, color } : img)));
  const marcarPortadaImagen = (i) =>
    setImagenes((prev) => prev.map((img, idx) => ({ ...img, esPortada: idx === i })));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { mostrarToast("Poné un nombre al producto", "error"); return; }
    if (!colores.length) { mostrarToast("Agregá al menos un color al producto", "error"); return; }
    setGuardando(true);
    try {
      // 1) crear el producto
      const { idProducto, error } = await crearProducto({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0,
        estado: form.estado,
        guia_talles: talles,
        colores: colores,
      });
      if (error) { mostrarToast(error, "error"); return; }

      // 2) categori­as
      if (catSeleccionadas.length) {
        const { error: errorCat } = await setCategoriasProducto(idProducto, catSeleccionadas);
        if (errorCat) mostrarToast(errorCat, "error");
      }

      // 2.05) subcategorías
      if (subSeleccionadas.length) {
        const { error: errorSub } = await setSubcategoriasProducto(idProducto, subSeleccionadas);
        if (errorSub) mostrarToast(errorSub, "error");
      }

      // 2.1) etiquetas (ocasion/estilo: noche, boliche, elegante, etc.)
      if (etiSeleccionadas.length) {
        const { error: errorEti } = await setEtiquetasProducto(idProducto, etiSeleccionadas);
        if (errorEti) mostrarToast(errorEti, "error");
      }

      // 3) imagenes: el backend las sube a Storage y las guarda en la tabla Imagen
      if (imagenes.length) {
        const { error: errImg } = await subirImagenesProducto(
          idProducto,
          imagenes.map((img) => ({ file: img.file, color: img.color, esPortada: img.esPortada }))
        );
        if (errImg) mostrarToast(errImg, "error");
      }

      mostrarToast("Producto creado", "exito");
      navigate("/admin/catalogo");
    } catch (err) {
      console.log("ERROR CREAR PRODUCTO:", err);
      mostrarToast("Ocurrió un error inesperado", "error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="ap" onSubmit={handleSubmit}>
      <header className="ap__head">
        <h1>Agregar producto</h1>
        <div className="ap__head-actions">
          <button type="button" className="ap__btn-sec" onClick={() => navigate("/admin/catalogo")}>
            Cancelar
          </button>
          <button type="submit" className="ap__btn-pri" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </header>

      <div className="ap__grid">
        {/* columna izquierda: datos */}
        <section className="ap__col">
          <div className="ap__card">
            <h2>Información general</h2>
            <label className="ap__field"><span>Nombre</span>
              <input value={form.nombre} onChange={setCampo("nombre")} required /></label>
            <label className="ap__field"><span>Descripcion</span>
              <textarea rows={4} value={form.descripcion} onChange={setCampo("descripcion")} /></label>
            <div className="ap__row">
              <label className="ap__field"><span>Precio</span>
                <input type="number" min="0" value={form.precio} onChange={setCampo("precio")} /></label>
              <label className="ap__field"><span>Stock</span>
                <input type="number" min="0" value={form.stock} onChange={setCampo("stock")} /></label>
            </div>
          </div>

          <div className="ap__card">
            <h2>Talles</h2>
            <TallesPicker talles={talles} onChange={setTalles} />
          </div>

          <div className="ap__card">
            <h2>Colores</h2>
            <p style={{ color: "#5f6368", fontSize: 12, margin: "-8px 0 12px" }}>
              Obligatorio: al subir una foto se sugiere un color, pero podes agregar los que quieras.
            </p>
            <div className="ap__color-add">
              <input type="color" value={colorTemp} onChange={(e) => setColorTemp(e.target.value)} />
              <button type="button" onClick={agregarColor}>Agregar color</button>
            </div>
            <div className="ap__colores">
              {colores.map((c) => (
                <span key={c} className="ap__color-chip" style={{ background: c }}
                  onClick={() => quitarColor(c)} title="Quitar">
                  <i>x</i>
                </span>
              ))}
              {!colores.length && <span style={{ color: "#c0392b", fontSize: 13 }}>Sin colores todavi­a</span>}
            </div>
          </div>
        </section>

        {/* columna derecha: imagenes, categori­as, etiquetas, estado */}
        <section className="ap__col">
          <div className="ap__card">
            <h2>Imagenes</h2>
            <label className="ap__dropzone">
              <input type="file" accept="image/*" multiple hidden onChange={handleImagenes} />
              <span>+ Subir imagenes</span>
            </label>
            <div className="ap__previews">
              {imagenes.map((img, i) => (
                <div key={i} className="ap__preview">
                  <div className="ap__preview-img">
                    <img src={img.preview} alt="" />
                    <button type="button" onClick={() => quitarImagen(i)}>x</button>
                  </div>
                  <div className="ap__preview-colores">
                    <button
                      type="button"
                      className={`ap__preview-swatch ap__preview-swatch--none ${!img.color ? "is-selected" : ""}`}
                      title="Sin color"
                      onClick={() => setColorImagen(i, "")}
                    >
                      <i>x</i>
                    </button>
                    {colores.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className={`ap__preview-swatch ${img.color === c ? "is-selected" : ""}`}
                        style={{ background: c }}
                        title={c}
                        onClick={() => setColorImagen(i, c)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`ap__preview-portada ${img.esPortada ? "is-on" : ""}`}
                    onClick={() => marcarPortadaImagen(i)}
                  >
                    Portada
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ap__card">
            <h2>Categorí­as y subcategorías</h2>
            <CategoriasSubcategoriasPicker
              categorias={categorias}
              catSeleccionadas={catSeleccionadas}
              onToggleCategoria={toggleCategoria}
              subSeleccionadas={subSeleccionadas}
              onToggleSubcategoria={toggleSubcategoria}
              onError={(msg) => mostrarToast(msg, "error")}
            />
          </div>

          <div className="ap__card">
            <h2>Etiquetas</h2>
            <p style={{ color: "#5f6368", fontSize: 12, margin: "-8px 0 12px" }}>
              Ocasión o estilo de la prenda (noche, boliche, elegante...). Ayuda a que la
              recomendamos con más precisión en búsquedas y en el asistente de outfits.
            </p>
            <EtiquetasPicker
              etiquetas={etiquetas}
              seleccionadas={etiSeleccionadas}
              onToggle={toggleEtiqueta}
              onEtiquetaCreada={(e) => setEtiquetas((prev) => [...prev, e])}
              onError={(msg) => mostrarToast(msg, "error")}
            />
          </div>

          <div className="ap__card">
            <h2>Estado</h2>
            <label className="ap__switch">
              <input type="checkbox" checked={form.estado} onChange={setCampo("estado")} />
              <span>{form.estado ? "Activo (visible en la tienda)" : "Inactivo (oculto)"}</span>
            </label>
          </div>
        </section>
      </div>
    </form>
  );
}

export default AgregarProducto;