import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import { subirImagenProducto } from "../../services/storage";
import { useMarcaAuth } from "../../context/MarcaAuthContext.jsx";
import {
  getCategorias, getProductoPorId, actualizarProducto,
  actualizarCategoriasProducto, setImagenesProducto, borrarImagen, borrarProducto,
} from "../services/catalogo";
import "../AgregarProducto/AgregarProducto.css";

const TALLES_DISPONIBLES = ["XS", "S", "M", "L", "XL", "XXL"];

function EditarProducto() {
  const navigate = useNavigate();
  const { idProducto } = useParams();
  const { mostrarToast } = useToast();
  const { idMarca } = useMarcaAuth();

  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", stock: "", estado: true });
  const [talles, setTalles] = useState([]);
  const [colores, setColores] = useState([]);
  const [colorTemp, setColorTemp] = useState("#123d59");
  const [categorias, setCategorias] = useState([]);
  const [catSeleccionadas, setCatSeleccionadas] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]); // {id_imagen, imagen}
  const [imagenesNuevas, setImagenesNuevas] = useState([]);          // File[]
  const [previewsNuevas, setPreviewsNuevas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // precarga
  useEffect(() => {
    async function cargar() {
      const [{ data: cats }, { data: prod, error }] = await Promise.all([
        getCategorias(),
        getProductoPorId(idProducto, idMarca),
      ]);
      setCategorias(cats ?? []);
      if (error || !prod) { mostrarToast("No se encontró el producto", "error"); navigate("/admin/catalogo"); return; }

      setForm({
        nombre: prod.nombre ?? "",
        descripcion: prod.descripcion ?? "",
        precio: prod.precio ?? "",
        stock: prod.stock ?? "",
        estado: prod.estado ?? true,
      });
      setTalles(prod.guia_talles ?? []);
      setColores(prod.colores ?? []);
      setCatSeleccionadas((prod.Producto_Categoria ?? []).map((c) => c.id_categoria));
      setImagenesExistentes(prod.Imagen ?? []);
      setCargando(false);
    }
    cargar();
  }, [idProducto, navigate, mostrarToast]);

  const setCampo = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const toggleTalle = (t) =>
    setTalles((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  const agregarColor = () => { if (!colores.includes(colorTemp)) setColores([...colores, colorTemp]); };
  const quitarColor = (c) => setColores(colores.filter((x) => x !== c));
  const toggleCategoria = (id) =>
    setCatSeleccionadas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleImagenesNuevas = (e) => {
    const files = Array.from(e.target.files);
    setImagenesNuevas((p) => [...p, ...files]);
    setPreviewsNuevas((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const quitarImagenNueva = (i) => {
    setImagenesNuevas(imagenesNuevas.filter((_, idx) => idx !== i));
    setPreviewsNuevas(previewsNuevas.filter((_, idx) => idx !== i));
  };

  // borra una imagen YA guardada (de la base y el bucket)
  const handleBorrarExistente = async (img) => {
    const { error } = await borrarImagen(img.id_imagen, img.imagen);
    if (error) { mostrarToast(error, "error"); return; }
    setImagenesExistentes((prev) => prev.filter((x) => x.id_imagen !== img.id_imagen));
    mostrarToast("Imagen eliminada", "info");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { mostrarToast("Poné un nombre", "error"); return; }
    setGuardando(true);
    try {
      const { error } = await actualizarProducto(idProducto, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0,
        estado: form.estado,
        guia_talles: talles,
        colores,
      });
      if (error) { mostrarToast(error, "error"); return; }

      await actualizarCategoriasProducto(idProducto, catSeleccionadas);

      if (imagenesNuevas.length) {
        const urls = [];
        for (const file of imagenesNuevas) {
          const { url } = await subirImagenProducto(file);
          if (url) urls.push(url);
        }
        if (urls.length) await setImagenesProducto(idProducto, urls);
      }

      mostrarToast("Cambios guardados", "exito");
      navigate("/admin/catalogo");
    } catch {
      mostrarToast("Ocurrió un error", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleBorrarProducto = async () => {
    if (!window.confirm("¿Seguro que querés borrar este producto? No se puede deshacer.")) return;
    const { error } = await borrarProducto(idProducto);
    if (error) { mostrarToast(error, "error"); return; }
    mostrarToast("Producto borrado", "info");
    navigate("/admin/catalogo");
  };

  if (cargando) return null;

  return (
    <form className="ap" onSubmit={handleGuardar}>
      <header className="ap__head">
        <h1>Editar producto</h1>
        <div className="ap__head-actions">
          <button type="button" className="ap__btn-danger" onClick={handleBorrarProducto}>Borrar</button>
          <button type="button" className="ap__btn-sec" onClick={() => navigate("/admin/catalogo")}>Cancelar</button>
          <button type="submit" className="ap__btn-pri" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </header>

      <div className="ap__grid">
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
            <div className="ap__talles">
              {TALLES_DISPONIBLES.map((t) => (
                <button type="button" key={t}
                  className={`ap__talle ${talles.includes(t) ? "is-on" : ""}`}
                  onClick={() => toggleTalle(t)}>{t}</button>
              ))}
            </div>
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
                  onClick={() => quitarColor(c)} title="Quitar"><i>✕</i></span>
              ))}
            </div>
          </div>
        </section>

        <section className="ap__col">
          <div className="ap__card">
            <h2>Imágenes</h2>
            {/* existentes */}
            <div className="ap__previews">
              {imagenesExistentes.map((img) => (
                <div key={img.id_imagen} className="ap__preview">
                  <img src={img.imagen} alt="" />
                  <button type="button" onClick={() => handleBorrarExistente(img)}>✕</button>
                </div>
              ))}
            </div>
            {/* nuevas */}
            <label className="ap__dropzone">
              <input type="file" accept="image/*" multiple hidden onChange={handleImagenesNuevas} />
              <span>+ Agregar imágenes</span>
            </label>
            <div className="ap__previews">
              {previewsNuevas.map((src, i) => (
                <div key={i} className="ap__preview">
                  <img src={src} alt="" />
                  <button type="button" onClick={() => quitarImagenNueva(i)}>✕</button>
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

export default EditarProducto;