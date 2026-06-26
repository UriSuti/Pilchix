import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMarcaAuth } from "../../context/MarcaAuthContext";
import "./LoginMarca.css";

function RegistroMarca() {
    const navigate = useNavigate();
    const { register } = useMarcaAuth();
    const [form, setForm] = useState({ nombre: "", email: "", contraseña: "", confirmar: "" });
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const setCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

    const [exito, setExito] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.contraseña !== form.confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setEnviando(true);
        const { ok, error } = await register({
            nombre: form.nombre.trim(),
            email: form.email.trim(),
            contraseña: form.contraseña,
        });
        setEnviando(false);
        if (!ok) { setError(error); return; }
        setExito(true);    // mostramos la pantalla de "pendiente"
    }

    if (exito) {
    return (
        <div className="login-marca">
        <div className="login-marca__card">
            <h1 className="login-marca__logo">PILCHIX</h1>
            <p className="login-marca__sub">Solicitud enviada</p>
            <p style={{ fontSize: 14, color: "#444", textAlign: "center", lineHeight: 1.5 }}>
                Tu marca quedó pendiente de aprobación. Te vamos a habilitar el acceso
                una vez que revisemos la solicitud.
            </p>
            <Link to="/admin/login" className="login-marca__btn" style={{ textAlign: "center", textDecoration: "none" }}>
            Volver al inicio
            </Link>
        </div>
        </div>
    );
    }

  return (
    <div className="login-marca">
      <form className="login-marca__card" onSubmit={handleSubmit}>
        <h1 className="login-marca__logo">PILCHIX</h1>
        <p className="login-marca__sub">Creá tu portal de marca</p>

        <label className="login-marca__field">
          <span>Nombre de la marca</span>
          <input value={form.nombre} onChange={setCampo("nombre")} required />
        </label>
        <label className="login-marca__field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={setCampo("email")} required />
        </label>
        <label className="login-marca__field">
          <span>Contraseña</span>
          <input type="password" value={form.contraseña} onChange={setCampo("contraseña")} required />
        </label>
        <label className="login-marca__field">
          <span>Confirmar contraseña</span>
          <input type="password" value={form.confirmar} onChange={setCampo("confirmar")} required />
        </label>

        {error && <p className="login-marca__error">{error}</p>}

        <button className="login-marca__btn" type="submit" disabled={enviando}>
          {enviando ? "Creando..." : "Crear marca"}
        </button>

        <p className="login-marca__switch">
          ¿Ya tenés cuenta? <Link to="/admin/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default RegistroMarca;