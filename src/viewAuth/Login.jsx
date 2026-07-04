import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__aside-inner">
          <Link to="/" className="auth__brand">Pilchix</Link>
          <div className="auth__aside-copy">
            <h1>
              Donde las marcas<br />
              se encuentran<br />
              con vos.
            </h1>
            <p>
              La vidriera digital de la moda. Explorá marcas, seguí a tus favoritas y comprá desde
              un solo lugar.
            </p>
          </div>
          <p className="auth__aside-foot">© 2026 Pilchix</p>
        </div>
      </aside>

      <main className="auth__panel">
        <div className="auth__card">
          <Link to="/" className="auth__brand auth__brand--mobile">Pilchix</Link>
          <h2 className="auth__title">Iniciá sesión</h2>
          <p className="auth__sub">Qué bueno verte de nuevo. Ingresá para continuar.</p>

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="auth__field">
              <span>Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </label>

            <label className="auth__field">
              <span>Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {error && <p className="auth__error">{error}</p>}

            <button className="auth__btn" type="submit" disabled={enviando}>
              {enviando ? "Ingresando…" : "Iniciar sesión"}
            </button>
          </form>

          <p className="auth__switch">
            ¿No tenés cuenta? <Link to="/registro">Creá una</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
