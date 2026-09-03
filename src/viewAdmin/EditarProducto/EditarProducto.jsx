import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import {
  getCategorias, getEtiquetas, getProductoPorId, actualizarProducto,
  actualizarCategoriasProducto, actualizarSubcategoriasProducto, actualizarEtiquetasProducto,
  subirImagenesProducto, borrarImagen, borrarProducto, marcarPortada, actualizarColorImagen,
  getDescuentoProducto, setDescuentoProducto, quitarDescuentoProducto,
} from "../services/catalogo";
import TallesPicker from "../components/TallesPicker/TallesPicker";
import CategoriasSubcategoriasPicker from "../components/CategoriasSubcategoriasPicker/CategoriasSubcategoriasPicker";
import EtiquetasPicker from "../components/EtiquetasPicker/EtiquetasPicker";
import { obtenerColorPromedio } from "../../utils/colorImagen";
import "../AgregarProducto/AgregarProducto.css";

const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));

const DIAS_OFERTA_OPCIONES = [7, 15, 30, 60];

function EditarProducto() {
  const navigate = useNavigate();
  const { idProducto } = useParams();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", stock: "", estado: true });
  const [talles, setTalles] = useState([]);
  const [colores, setColores] = useState([]);
  const [colorTemp, setColorTemp] = useState("#123d59");
  const [categorias, setCategorias] = useState([]);
  const [catSeleccionadas, setCatSeleccionadas] = useState([]);
  const [subSeleccionadas, setSubSeleccionadas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiSeleccionadas, setEtiSeleccionadas] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]); // {id_imagen, imagen, color, es_portada}
  const [imagenesNuevas, setImagenesNuevas] = useState([]);          // { file, preview, color, esPortada }[]
  const [portada, setPortada] = useState(null);                     // { tipo: 'existente'|'nueva', ref }
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [descuento, setDescuento] = useState(null); // { id_descuento, porcentaje, precio_final, fecha_fin, ... } | null
  const [porcentajeOferta, setPorcentajeOferta] = useState(20);
  const [diasOferta, setDiasOferta] = useState(30);
  const [guardandoOferta, setGuardandoOferta] = useState(false);

  // precarga
  useEffect(() => {
    async function cargar() {
      const [{ data: cats }, { data: etis }, { data: prod, error }, { data: desc }] = await Promise.all([
        getCategorias(),
        getEtiquetas(),
        getProductoPorId(idProducto),
        getDescuentoProducto(idProducto),
      ]);
      setCategorias(cats ?? []);
      setEtiquetas(etis ?? []);
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
      setSubSeleccionadas((prod.Producto_Subcategoria ?? []).map((s) => s.id_subcategoria));
      setEtiSeleccionadas((prod.Producto_Etiqueta ?? []).map((e) => e.id_etiqueta));
      const imgs = prod.Imagen ?? [];
      setImagenesExistentes(imgs);
      const portadaExistente = imgs.find((img) => img.es_portada);
      if (portadaExistente) setPortada({ tipo: "existente", ref: portadaExistente.id_imagen });
      if (desc) { setDescuento(desc); setPorcentajeOferta(desc.porcentaje); }
      setCargando(false);
    }
    cargar();
  }, [idProducto, navigate, mostrarToast]);

  const setCampo = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const agregarColor = () => { if (!colores.includes(colorTemp)) setColores([...colores, colorTemp]); };
  const quitarColor = (c) => setColores(colores.filter((x) => x !== c));
  const toggleCategoria = (id) =>
    setCatSeleccionadas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleSubcategoria = (id) =>
    setSubSeleccionadas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleEtiqueta = (id) =>
    setEtiSeleccionadas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleImagenesNuevas = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    setImagenesNuevas((p) => [
      ...p,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file), color: "", esPortada: false })),
    ]);
    if (files[0] && colores.length === 0) {
      const colorSugerido = await obtenerColorPromedio(files[0]);
      if (colorSugerido) {
        setColorTemp(colorSugerido);
        setColores((prev) => (prev.length === 0 ? [colorSugerido] : prev));
      }
    }
  };
  const quitarImagenNueva = (i) => setImagenesNuevas((prev) => prev.filter((_, idx) => idx !== i));

  // borra una imagen YA guardada (de la base y el bucket)
  const handleBorrarExistente = async (img) => {
    const { error } = await borrarImagen(img.id_imagen);
    if (error) { mostrarToast(error, "error"); return; }
    setImagenesExistentes((prev) => prev.filter((x) => x.id_imagen !== img.id_imagen));
    if (portada?.tipo === "existente" && portada.ref === img.id_imagen) setPortada(null);
    mostrarToast("Imagen eliminada", "info");
  };

  // cambia el color asociado a una imagen ya guardada: se refleja al toque, el guardado va en segundo plano
  const handleColorExistente = (img, color) => {
    setImagenesExistentes((prev) =>
      prev.map((x) => (x.id_imagen === img.id_imagen ? { ...x, color } : x))
    );
    actualizarColorImagen(img.id_imagen, color).then(({ error }) => {
      if (!error) return;
      mostrarToast(error, "error");
      setImagenesExistentes((prev) =>
        prev.map((x) => (x.id_imagen === img.id_imagen ? { ...x, color: img.color } : x))
      );
    });
  };

  // marca una imagen ya guardada como portada: se refleja al toque, el guardado va en segundo plano
  const handleMarcarPortadaExistente = (img) => {
    const portadaAnterior = portada;
    setPortada({ tipo: "existente", ref: img.id_imagen });
    setImagenesNuevas((prev) => prev.map((x) => ({ ...x, esPortada: false })));
    marcarPortada(idProducto, img.id_imagen).then(({ error }) => {
      if (!error) return;
      mostrarToast(error, "error");
      setPortada(portadaAnterior);
    });
  };

  const setColorImagenNueva = (i, color) =>
    setImagenesNuevas((prev) => prev.map((img, idx) => (idx === i ? { ...img, color } : img)));

  // marca una imagen recién subida como portada (se persiste al guardar, cuando ya tenga id_imagen)
  const marcarPortadaImagenNueva = (i) => {
    setImagenesNuevas((prev) => prev.map((img, idx) => ({ ...img, esPortada: idx === i })));
    setPortada({ tipo: "nueva", ref: i });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { mostrarToast("Poné un nombre", "error"); return; }
    if (!colores.length) { mostrarToast("Agregá al menos un color al producto", "error"); return; }
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

      const { error: errorCat } = await actualizarCategoriasProducto(idProducto, catSeleccionadas);
      if (errorCat) mostrarToast(errorCat, "error");

      const { error: errorSub } = await actualizarSubcategoriasProducto(idProducto, subSeleccionadas);
      if (errorSub) mostrarToast(errorSub, "error");

      const { error: errorEti } = await actualizarEtiquetasProducto(idProducto, etiSeleccionadas);
      if (errorEti) mostrarToast(errorEti, "error");

      if (imagenesNuevas.length) {
        const { data: insertadas, error: errImg } = await subirImagenesProducto(
          idProducto,
          imagenesNuevas.map((img) => ({ file: img.file, color: img.color, esPortada: false }))
        );
        if (errImg) {
          mostrarToast(errImg, "error");
        } else if (portada?.tipo === "nueva" && insertadas[portada.ref]) {
          await marcarPortada(idProducto, insertadas[portada.ref].id_imagen);
        }
      }

      mostrarToast("Cambios guardados", "exito");
      navigate("/admin/catalogo");
    } catch {
      mostrarToast("Ocurrió un error", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleActivarOferta = async () => {
    const porcentaje = Number(porcentajeOferta);
    if (!Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje >= 100) {
      mostrarToast("El porcentaje tiene que estar entre 1 y 99", "error");
      return;
    }
    setGuardandoOferta(true);
    const { data, error } = await setDescuentoProducto(idProducto, { porcentaje, dias: diasOferta });
    setGuardandoOferta(false);
    if (error) { mostrarToast(error, "error"); return; }
    setDescuento(data);
    mostrarToast("Oferta activada", "exito");
  };

  const handleQuitarOferta = async () => {
    setGuardandoOferta(true);
    const { error } = await quitarDescuentoProducto(idProducto);
    setGuardandoOferta(false);
    if (error) { mostrarToast(error, "error"); return; }
    setDescuento(null);
    mostrarToast("Oferta eliminada", "info");
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
            <h2>Precio promocional</h2>
            {descuento ? (
              <p className="ap__oferta-activa">
                Oferta activa: <strong>-{descuento.porcentaje}%</strong> · precio final{" "}
                <strong>{formatPrecio(descuento.precio_final)}</strong> · vence el{" "}
                {new Date(`${descuento.fecha_fin}T00:00:00`).toLocaleDateString("es-AR")}
              </p>
            ) : (
              <p className="ap__oferta-activa ap__oferta-activa--off">Este producto no tiene ninguna oferta activa.</p>
            )}
            <div className="ap__row">
              <label className="ap__field"><span>Descuento (%)</span>
                <input
                  type="number" min="1" max="99" value={porcentajeOferta}
                  onChange={(e) => setPorcentajeOferta(e.target.value)}
                /></label>
              <label className="ap__field"><span>Duración</span>
                <select value={diasOferta} onChange={(e) => setDiasOferta(Number(e.target.value))}>
                  {DIAS_OFERTA_OPCIONES.map((d) => (
                    <option key={d} value={d}>{d} días</option>
                  ))}
                </select>
              </label>
            </div>
            {form.precio && porcentajeOferta > 0 && porcentajeOferta < 100 ? (
              <p className="ap__oferta-preview">
                Precio con oferta: <strong>{formatPrecio(form.precio * (1 - porcentajeOferta / 100))}</strong>
                {" "}<span className="ap__oferta-preview-tachado">{formatPrecio(form.precio)}</span>
              </p>
            ) : null}
            <div className="ap__oferta-acciones">
              <button type="button" className="ap__btn-pri" disabled={guardandoOferta} onClick={handleActivarOferta}>
                {guardandoOferta ? "Guardando..." : descuento ? "Actualizar oferta" : "Activar oferta"}
              </button>
              {descuento ? (
                <button type="button" className="ap__btn-sec" disabled={guardandoOferta} onClick={handleQuitarOferta}>
                  Quitar oferta
                </button>
              ) : null}
            </div>
          </div>

          <div className="ap__card">
            <h2>Talles</h2>
            <TallesPicker talles={talles} onChange={setTalles} />
          </div>

          <div className="ap__card">
            <h2>Colores</h2>
            <p style={{ color: "#5f6368", fontSize: 12, margin: "-8px 0 12px" }}>
              Obligatorio: al subir una foto se sugiere un color, pero podés agregar los que quieras.
            </p>
            <div className="ap__color-add">
              <input type="color" value={colorTemp} onChange={(e) => setColorTemp(e.target.value)} />
              <button type="button" onClick={agregarColor}>Agregar color</button>
            </div>
            <div className="ap__colores">
              {colores.map((c) => (
                <span key={c} className="ap__color-chip" style={{ background: c }}
                  onClick={() => quitarColor(c)} title="Quitar"><i>✕</i></span>
              ))}
              {!colores.length && <span style={{ color: "#c0392b", fontSize: 13 }}>Sin colores todavía</span>}
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
                  <div className="ap__preview-img">
                    <img src={img.imagen} alt="" />
                    <button type="button" onClick={() => handleBorrarExistente(img)}>✕</button>
                  </div>
                  <div className="ap__preview-colores">
                    <button
                      type="button"
                      className={`ap__preview-swatch ap__preview-swatch--none ${!img.color ? "is-selected" : ""}`}
                      title="Sin color"
                      onClick={() => handleColorExistente(img, "")}
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
                        onClick={() => handleColorExistente(img, c)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`ap__preview-portada ${portada?.tipo === "existente" && portada.ref === img.id_imagen ? "is-on" : ""}`}
                    onClick={() => handleMarcarPortadaExistente(img)}
                  >
                    ★ Portada
                  </button>
                </div>
              ))}
            </div>
            {/* nuevas */}
            <label className="ap__dropzone">
              <input type="file" accept="image/*" multiple hidden onChange={handleImagenesNuevas} />
              <span>+ Agregar imágenes</span>
            </label>
            <div className="ap__previews">
              {imagenesNuevas.map((img, i) => (
                <div key={i} className="ap__preview">
                  <div className="ap__preview-img">
                    <img src={img.preview} alt="" />
                    <button type="button" onClick={() => quitarImagenNueva(i)}>✕</button>
                  </div>
                  <div className="ap__preview-colores">
                    <button
                      type="button"
                      className={`ap__preview-swatch ap__preview-swatch--none ${!img.color ? "is-selected" : ""}`}
                      title="Sin color"
                      onClick={() => setColorImagenNueva(i, "")}
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
                        onClick={() => setColorImagenNueva(i, c)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`ap__preview-portada ${portada?.tipo === "nueva" && portada.ref === i ? "is-on" : ""}`}
                    onClick={() => marcarPortadaImagenNueva(i)}
                  >
                    ★ Portada
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ap__card">
            <h2>Categorías y subcategorías</h2>
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

export default EditarProducto;