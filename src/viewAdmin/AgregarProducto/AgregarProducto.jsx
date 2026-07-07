import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMarcaAuth } from "../../context/MarcaAuthContext";
import { useToast } from "../../context/ToastContext.jsx";
import { subirImagenProducto } from "../../services/storage";
import {
  getCategorias, crearProducto, setCategoriasProducto, setImagenesProducto,
} from "../services/catalogo";
import TallesPicker from "../components/TallesPicker/TallesPicker";
import "./AgregarProducto.css";

function AgregarProducto() {
  const navigate = useNavigate();
  const { idMarca } = useMarcaAuth();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({
    nombre: "", descripcion: "", precio: "", stock: "", estado: true,
  });
  const [talles, setTalles] = useState([]);
  const [colores, setColores] = useState([]);
  const [colorTemp, setColorTemp] = useState("#123d59");
  const [categorias, setCategorias] = useState([]);
  const [catSeleccionadas, setCatSeleccionadas] = useState([]);
  const [imagenes, setImagenes] = useState([]);      // { file, preview, color, esPortada }[]
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getCategorias().then(({ data }) => setCategorias(data ?? []));
  }, []);

  const setCampo = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const agregarColor = () => {
    if (!colores.includes(colorTemp)) setColores([...colores, colorTemp]);
  };
  const quitarColor = (c) => setColores(colores.filter((x) => x !== c));

  const toggleCategoria = (id) =>
    setCatSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);
    setImagenes((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file), color: "", esPortada: false })),
    ]);
  };
  const quitarImagen = (i) => setImagenes((prev) => prev.filter((_, idx) => idx !== i));
  const setColorImagen = (i, color) =>
    setImagenes((prev) => prev.map((img, idx) => (idx === i ? { ...img, color } : img)));
  const marcarPortadaImagen = (i) =>
    setImagenes((prev) => prev.map((img, idx) => ({ ...img, esPortada: idx === i })));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { mostrarToast("Poné un nombre al producto", "error"); return; }
    setGuardando(true);
    try {
      // 1) crear el producto
      const { idProducto, error } = await crearProducto({
        id_marca: idMarca,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0,
        estado: form.estado,
        guia_talles: talles,
        colores: colores,
      });
      if (error) { mostrarToast(error, "error"); return; }

      // 2) categorías
      if (catSeleccionadas.length) {
        const { error: errorCat } = await setCategoriasProducto(idProducto, catSeleccionadas);
        if (errorCat) mostrarToast(errorCat, "error");
      }

      // 3) imágenes → Storage → tabla Imagen
      if (imagenes.length) {
        const subidas = [];
        for (const img of imagenes) {
          const { url, error: errImg } = await subirImagenProducto(img.file);
          if (url) subidas.push({ imagen: url, color: img.color, es_portada: img.esPortada });
          else mostrarToast(errImg, "error");
        }
        if (subidas.length) await setImagenesProducto(idProducto, subidas);
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
            <label className="ap__field"><span>Descripción</span>
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
            <div className="ap__color-add">
              <input type="color" value={colorTemp} onChange={(e) => setColorTemp(e.target.value)} />
              <button type="button" onClick={agregarColor}>Agregar color</button>
            </div>
            <div className="ap__colores">
              {colores.map((c) => (
                <span key={c} className="ap__color-chip" style={{ background: c }}
                  onClick={() => quitarColor(c)} title="Quitar">
                  <i>✕</i>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* columna derecha: imágenes, categorías, estado */}
        <section className="ap__col">
          <div className="ap__card">
            <h2>Imágenes</h2>
            <label className="ap__dropzone">
              <input type="file" accept="image/*" multiple hidden onChange={handleImagenes} />
              <span>+ Subir imágenes</span>
            </label>
            <div className="ap__previews">
              {imagenes.map((img, i) => (
                <div key={i} className="ap__preview">
                  <div className="ap__preview-img">
                    <img src={img.preview} alt="" />
                    <button type="button" onClick={() => quitarImagen(i)}>✕</button>
                  </div>
                  <div className="ap__preview-colores">
                    <button
                      type="button"
                      className={`ap__preview-swatch ap__preview-swatch--none ${!img.color ? "is-selected" : ""}`}
                      title="Sin color"
                      onClick={() => setColorImagen(i, "")}
                    >
                      <i>✕</i>
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
                    ★ Portada
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ap__card">
            <h2>Categorías</h2>
            <div className="ap__cats">
              {categorias.map((c) => (
                <label key={c.id_categoria} className="ap__cat">
                  <input type="checkbox"
                    checked={catSeleccionadas.includes(c.id_categoria)}
                    onChange={() => toggleCategoria(c.id_categoria)} />
                  {c.nombre}
                </label>
              ))}
            </div>
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