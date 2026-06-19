import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../header_footer/Header/Header.jsx";
import Footer from "../header_footer/Footer/Footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext.jsx";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { mostrarToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    const { ok, error } = await login(email.trim(), password);
    setEnviando(false);
    if (!ok) { setError(error); return; }
    mostrarToast("Sesión iniciada correctamente", "exito");
    navigate("/");
  };

  return (
    <div className="auth-page">
      <Header />
      <main className="auth-main">
        <h1 className="auth-hero">DONDE LAS MARCAS<br />SE ENCUENTRAN CON VOS</h1>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 className="auth-card__title">INICIAR SESIÓN</h2>

          <label className="auth-field">
            <span>Correo electrónico</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="auth-field">
            <span>Contraseña</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit" disabled={enviando}>
            {enviando ? "Ingresando..." : "INICIAR SESIÓN"}
          </button>

          <p className="auth-switch">¿No tenés cuenta? <Link to="/registro">Creá una</Link></p>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Login;