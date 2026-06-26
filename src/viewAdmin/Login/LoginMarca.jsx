import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMarcaAuth } from "../../context/MarcaAuthContext";
import "./LoginMarca.css";

function LoginMarca() {
  const navigate = useNavigate();
  const { login } = useMarcaAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    const { ok, error } = await login(email.trim(), password);
    setEnviando(false);
    if (!ok) { setError(error); return; }
    navigate("/admin");
  };

  return (
    <div className="login-marca">
      <form className="login-marca__card" onSubmit={handleSubmit}>
        <h1 className="login-marca__logo">PILCHIX</h1>
        <p className="login-marca__sub">Portal de marcas</p>

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
        <p className="login-marca__switch">
            ¿No tenés cuenta? <Link to="/admin/registro">Registrá tu marca</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginMarca;