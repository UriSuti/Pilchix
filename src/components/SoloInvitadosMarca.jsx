import { Navigate } from "react-router-dom";
import { useMarcaAuth } from "../context/MarcaAuthContext";

function SoloInvitadosMarca({ children }) {
  const { estaLogueada, cargando } = useMarcaAuth();

  if (cargando) return null;
  if (estaLogueada) return <Navigate to="/admin" replace />;
  return children;
}

export default SoloInvitadosMarca;