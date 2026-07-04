import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext.jsx";
import { subirFotoPerfil } from "../services/storage";
import { actualizarFotoPerfil } from "../services/auth";
import "./auth.css";

const IconUser = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function Registro() {
  const navigate = useNavigate();
  const { register, actualizarUsuarioLocal } = useAuth();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({ nombre: "", email: "", contraseña: "", confirmar: "" });
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const setCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setFoto(archivo);
    setPreviewFoto(URL.createObjectURL(archivo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.contraseña !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);
    try {
      const { ok, error, usuario } = await register({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        contraseña: form.contraseña,
      });

      if (!ok) {
        setError(error);
        return;
      }

      if (foto) {
        const { url, error: errorFoto } = await subirFotoPerfil(usuario.id_usuario, foto);
        if (errorFoto) {
          mostrarToast("Cuenta creada, pero no se pudo subir la foto", "error");
        } else {
          const { usuario: usuarioConFoto } = await actualizarFotoPerfil(usuario.id_usuario, url);
          if (usuarioConFoto) actualizarUsuarioLocal(usuarioConFoto);
        }
      }

      mostrarToast("Cuenta creada correctamente", "exito");
      navigate("/");
    } catch (err) {
      setError("Ocurrió un error inesperado. Probá de nuevo.");
      mostrarToast("No se pudo completar el registro", "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__aside-inner">
          <Link to="/" className="auth__brand">Pilchix</Link>
          <div className="auth__aside-copy">
            <h1>
              Sumate y hacé<br />
              tuya la<br />
              vidriera.
            </h1>
            <p>
              Guardá favoritos, seguí a tus marcas y descubrí locales nuevos. Crear tu cuenta es
              gratis y toma un minuto.
            </p>
          </div>
          <p className="auth__aside-foot">© 2026 Pilchix</p>
        </div>
      </aside>

      <main className="auth__panel">
        <div className="auth__card">
          <Link to="/" className="auth__brand auth__brand--mobile">Pilchix</Link>
          <h2 className="auth__title">Creá tu cuenta</h2>
          <p className="auth__sub">Es gratis y toma un minuto.</p>

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="auth__field">
              <span>Nombre</span>
              <input value={form.nombre} onChange={setCampo("nombre")} placeholder="Tu nombre" required />
            </label>

            <label className="auth__field">
              <span>Correo electrónico</span>
              <input
                type="email"
                value={form.email}
                onChange={setCampo("email")}
                placeholder="tu@email.com"
                required
              />
            </label>

            <label className="auth__field">
              <span>Contraseña</span>
              <input
                type="password"
                value={form.contraseña}
                onChange={setCampo("contraseña")}
                placeholder="••••••••"
                required
              />
            </label>

            <label className="auth__field">
              <span>Confirmar contraseña</span>
              <input
                type="password"
                value={form.confirmar}
                onChange={setCampo("confirmar")}
                placeholder="••••••••"
                required
              />
            </label>

            <div className="auth__field">
              <span>Foto de perfil (opcional)</span>
              <div className="auth__foto">
                <div className="auth__foto-preview">
                  {previewFoto ? <img src={previewFoto} alt="Vista previa" /> : <IconUser />}
                </div>
                <label className="auth__foto-btn">
                  {foto ? "Cambiar foto" : "Subir foto"}
                  <input type="file" accept="image/*" onChange={handleFoto} hidden />
                </label>
              </div>
            </div>

            {error && <p className="auth__error">{error}</p>}

            <button className="auth__btn" type="submit" disabled={enviando}>
              {enviando ? "Creando…" : "Crear cuenta"}
            </button>
          </form>

          <p className="auth__switch">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Registro;
