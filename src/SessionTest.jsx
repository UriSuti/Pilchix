import { useState } from "react";
import { useAuth } from "./context/AuthContext";

function SesionTest() {
  const { usuario, idUsuario, estaLogueado, cargando, login, logout } = useAuth();
  const [email, setEmail] = useState("juan@gmail.com");
  const [password, setPassword] = useState("juan123");
  const [error, setError] = useState("");

  async function handleLogin() {
        setError("");
        const { ok, error } = await login(email.trim(), password);
        if (!ok) setError(error);
  }

  if (cargando) return <p>Cargando sesión…</p>;

  return (
    <div style={{ padding: 16, margin: 16, border: "2px dashed #123d59", borderRadius: 8, maxWidth: 360 }}>
      <strong>Test de sesión</strong>
      {estaLogueado ? (
        <div style={{ marginTop: 10 }}>
          <p>✅ Logueado como <b>{usuario.nombre}</b></p>
          <p>id_usuario: <b>{idUsuario}</b></p>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      ) : (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          {error && <span style={{ color: "crimson" }}>{error}</span>}
          <button onClick={handleLogin}>Ingresar</button>
        </div>
      )}
    </div>
  );
}

export default SesionTest;