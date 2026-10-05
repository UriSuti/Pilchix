import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../viewAdmin/Login/LoginMarca.css";
import "./Superadmin.css";

function LoginSuperadmin() {
  const navigate = useNavigate();
  const { login, estaLogueado, cargando } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (cargando) return null;
  if (estaLogueado) return <Navigate to="/superadmin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    const { ok, error } = await login(email.trim(), password);
    setEnviando(false);
    if (!ok) { setError(error); return; }
    navigate("/superadmin");
  };

  return (
    <div className="login-marca login-marca--super">
      <form className="login-marca__card" onSubmit={handleSubmit}>
        <h1 className="login-marca__logo">PILCHIX</h1>
        <p className="login-marca__sub">Administración</p>

        <label className="login-marca__field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="login-marca__field">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <p className="login-marca__error">{error}</p>}

        <button className="login-marca__btn" type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default LoginSuperadmin;
