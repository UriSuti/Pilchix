import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Envuelve páginas que NO deberían verse si ya hay sesión de usuario (login/registro)
function SoloInvitados({ children }) {
  const { estaLogueado, cargando } = useAuth();

  if (cargando) return null;                 // espera a saber si hay sesión
  if (estaLogueado) return <Navigate to="/" replace />;  // ya logueado → a la home
  return children;                            // invitado → muestra login/registro
}

export default SoloInvitados;