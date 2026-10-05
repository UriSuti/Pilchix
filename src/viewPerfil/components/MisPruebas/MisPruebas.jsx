import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPruebasVirtuales, borrarPruebaVirtual } from "../../services/perfil";
import { getFotoProbador, subirFotoProbador, borrarFotoProbador } from "../../../viewProducto/services/probador";
import { useToast } from "../../../context/ToastContext.jsx";
import { slugify } from "../../../utils/slugify.js";
import { descargarImagen, compartirImagen, puedeCompartir } from "../../../utils/exportarImagen.js";
import "./MisPruebas.css";

const formatFecha = (f) => {
  if (!f) return "";
  return new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
};
const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(v || 0));

const portadaDe = (producto) =>
  (producto?.Imagen ?? []).find((img) => img.es_portada)?.imagen ?? producto?.Imagen?.[0]?.imagen ?? null;

const nombreArchivo = (prueba) => 
  `pilchix-${slugify(prueba.Producto?.nombre ?? "look")}-${String(prueba.fecha ?? "").slice(0, 10)}.png`;

// foto que el probador usa por defecto (así no hay que subirla cada vez)
function FotoProbador() {
  const { mostrarToast } = useToast();
  const [foto, setFoto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;
    getFotoProbador()
      .then((url) => { if (activo) setFoto(url); })
      .catch(() => {})
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const handleSubir = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    setGuardando(true);
    try {
      setFoto(await subirFotoProbador(archivo));
      mostrarToast("Foto guardada", "exito");
    } catch (err) {
      mostrarToast(err.message || "No se pudo guardar la foto", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleBorrar = async () => {
    setGuardando(true);
    try {
      await borrarFotoProbador();
      setFoto(null);
      mostrarToast("Foto eliminada", "info");
    } catch (err) {
      mostrarToast(err.message || "No se pudo borrar la foto", "error");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return null;

  return (
    <section className="mp-foto">
      {foto ? (
        <img src={foto} alt="Tu foto para el probador" className="mp-foto__img" />
      ) : (
        <div className="mp-foto__img mp-foto__img--vacia">📷</div>
      )}
      <div className="mp-foto__info">
        <h3>Tu foto para el probador</h3>
        <p>
          {foto
            ? "Se usa automáticamente cada vez que abrís el probador virtual."
            : "Subí una foto tuya de cuerpo entero y el probador la va a usar directamente."}
        </p>
        <div className="mp-foto__acciones">
          <label className={`perfil-agregar mp-foto__btn ${guardando ? "is-disabled" : ""}`}>
            {guardando ? "Guardando..." : foto ? "Cambiar foto" : "Subir foto"}
            <input type="file" accept="image/*" hidden disabled={guardando} onChange={handleSubir} />
          </label>
          {foto && (
            <button className="mp-foto__borrar" disabled={guardando} onClick={handleBorrar}>
              Borrar foto
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// visor: la prueba grande y, abajo, la prenda que se probó
function VisorPrueba({ prueba, onClose, onBorrar }) {
  const navigate = useNavigate();
  const producto = prueba.Producto;
  const portada = portadaDe(producto);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [exportando, setExportando] = useState(false);

  const handleDescargar = async () => {
    setExportando(true);
    try { await descargarImagen(prueba.imagen, nombreArchivo(prueba)); }
    finally { setExportando(false); }
  };

  const handleCompartir = async () => {
    setExportando(true);
    try {
      const ok = await compartirImagen(prueba.imagen, nombreArchivo(prueba));
      if (!ok) await descargarImagen(prueba.imagen, nombreArchivo(prueba));
    } catch (err) {
      if (err.name !== "AbortError") await descargarImagen(prueba.imagen, nombreArchivo(prueba));
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="mp-visor" onClick={onClose}>
      <div className="mp-visor__panel" onClick={(e) => e.stopPropagation()}>
        <button className="mp-visor__cerrar" onClick={onClose} aria-label="Cerrar">✕</button>
        <img src={prueba.imagen} alt={producto?.nombre ?? "Prueba virtual"} className="mp-visor__img" />
        <span className="mp-visor__fecha">Probado el {formatFecha(prueba.fecha)}</span>

        <div className="mp-visor__exportar">
          <button className="perfil-agregar" onClick={handleDescargar} disabled={exportando}>
            {exportando ? "Preparando..." : "Descargar"}
          </button>
          {puedeCompartir() && (
            <button className="mp-visor__compartir" onClick={handleCompartir} disabled={exportando}>
              Compartir
            </button>
          )}
        </div>

        {producto && (
          <div className="mp-visor__prenda">
            {portada ? (
              <img src={portada} alt={producto.nombre} />
            ) : (
              <div className="mp-visor__prenda-ph">{producto.nombre?.charAt(0)}</div>
            )}
            <div className="mp-visor__prenda-info">
              <span>La prenda</span>
              <strong>{producto.nombre}</strong>
              {producto.precio != null && <em>{formatPrecio(producto.precio)}</em>}
            </div>
            <button
              className="perfil-agregar mp-visor__ver"
              onClick={() => navigate(`/producto/${slugify(producto.nombre)}`)}
            >
              Ver producto
            </button>
          </div>
        )}

        <button className="mp-visor__borrar" onClick={() => onBorrar(prueba)}>
          Borrar esta prueba
        </button>
      </div>
    </div>
  );
}

function MisPruebas() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const [pruebas, setPruebas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [abierta, setAbierta] = useState(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      const { data } = await getPruebasVirtuales();
      if (!activo) return;
      setPruebas(data ?? []);
      setCargando(false);
    })();
    return () => { activo = false; };
  }, []);

  // se saca al toque; si falla, vuelve a su lugar
  const handleBorrar = async (prueba) => {
    const anteriores = pruebas;
    setPruebas((prev) => prev.filter((p) => p.id_prueba !== prueba.id_prueba));
    setAbierta(null);
    const { error } = await borrarPruebaVirtual(prueba.id_prueba);
    if (error) {
      setPruebas(anteriores);
      mostrarToast(error.message || "No se pudo borrar la prueba", "error");
      return;
    }
    mostrarToast("Prueba eliminada", "info");
  };

  if (cargando) return <p className="perfil-vacio">Cargando...</p>;

  return (
    <>
      <FotoProbador />

      {pruebas.length === 0 ? (
        <div className="perfil-vacio">
          <h3 className="perfil-vacio__titulo">Todavía no probaste ninguna prenda</h3>
          <p className="perfil-vacio__texto">
            Entrá a un producto y usá el probador virtual para ver cómo te queda.
          </p>
          <button className="perfil-agregar" onClick={() => navigate("/")}>
            Explorar productos
          </button>
        </div>
      ) : (
        <div className="perfil-grid">
          {pruebas.map((p) => (
            <div key={p.id_prueba} className="card-perfil" onClick={() => setAbierta(p)}>
              <img src={p.imagen} alt={p.Producto?.nombre ?? "Prueba virtual"} className="card-perfil__img" />
              <button
                className="mp-card__borrar"
                aria-label="Borrar prueba"
                title="Borrar prueba"
                onClick={(e) => { e.stopPropagation(); handleBorrar(p); }}
              >
                ✕
              </button>
              <button
                className="mp-card__descargar"
                aria-label="Descargar prueba"
                title="Descargar"
                onClick={(e) => { e.stopPropagation(); descargarImagen(p.imagen, nombreArchivo(p)); }}
              >
                ⬇
              </button>
              <span className="card-perfil__nombre">{p.Producto?.nombre ?? "Producto"}</span>
              <span className="card-perfil__fecha">{formatFecha(p.fecha)}</span>
            </div>
          ))}
        </div>
      )}

      {abierta && (
        <VisorPrueba prueba={abierta} onClose={() => setAbierta(null)} onBorrar={handleBorrar} />
      )}
    </>
  );
}

export default MisPruebas;
