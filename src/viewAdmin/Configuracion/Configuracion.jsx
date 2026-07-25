import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { getPerfilMarca, actualizarPerfilMarca } from "../../services/marca";
import "../AgregarProducto/AgregarProducto.css";

function Configuracion() {
  const { mostrarToast } = useToast();
  const [form, setForm] = useState({
    descripcion: "", ubicacion: "", sitio_web: "", instagram: "", tiktok: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getPerfilMarca().then(({ data }) => {
      if (data) {
        setForm({
          descripcion: data.descripcion ?? "",
          ubicacion: data.ubicacion ?? "",
          sitio_web: data.sitio_web ?? "",
          instagram: data.instagram ?? "",
          tiktok: data.tiktok ?? "",
        });
      }
      setCargando(false);
    });
  }, []);

  const setCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const { error } = await actualizarPerfilMarca(form);
    setGuardando(false);
    if (error) { mostrarToast(error, "error"); return; }
    mostrarToast("Cambios guardados", "exito");
  };

  if (cargando) return null;

  return (
    <form className="ap" onSubmit={guardar}>
      <header className="ap__head">
        <div>
          <h1>Configuración</h1>
          <p style={{ color: "#5f6368", margin: "4px 0 0" }}>
            Editá los datos de tu local y tus redes. Las redes aparecen en tu página para que te sigan.
          </p>
        </div>
        <div className="ap__head-actions">
          <button type="submit" className="ap__btn-pri" disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </header>

      <div className="ap__grid">
        <section className="ap__col">
          <div className="ap__card">
            <h2>Local</h2>
            <label className="ap__field"><span>Descripción</span>
              <textarea rows={4} value={form.descripcion} onChange={setCampo("descripcion")}
                placeholder="Contá de qué es tu local" />
            </label>
            <label className="ap__field"><span>Ubicación</span>
              <input value={form.ubicacion} onChange={setCampo("ubicacion")}
                placeholder="Ej: Palermo, Buenos Aires" />
            </label>
          </div>
        </section>

        <section className="ap__col">
          <div className="ap__card">
            <h2>Redes y sitio</h2>
            <label className="ap__field"><span>Instagram</span>
              <input value={form.instagram} onChange={setCampo("instagram")}
                placeholder="@tumarca o link completo" />
            </label>
            <label className="ap__field"><span>TikTok</span>
              <input value={form.tiktok} onChange={setCampo("tiktok")}
                placeholder="@tumarca o link completo" />
            </label>
            <label className="ap__field"><span>Sitio web</span>
              <input value={form.sitio_web} onChange={setCampo("sitio_web")}
                placeholder="www.tumarca.com" />
            </label>
          </div>
        </section>
      </div>
    </form>
  );
}

export default Configuracion;
