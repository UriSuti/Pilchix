import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext.jsx";
import { getSuscripcion, agregarSuscripcion, quitarSuscripcion } from "../../../viewPerfil/services/perfil";
import "./BotonSuscribirse.css";

function BotonSuscribirse({ idMarca, nombreMarca }) {
    const navigate = useNavigate();
    const { idUsuario, estaLogueado } = useAuth();
    const { mostrarToast } = useToast();
    const [suscripto, setSuscripto] = useState(false);
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        if (!idUsuario || !idMarca) return;
        let activo = true;
        getSuscripcion(idUsuario, idMarca).then(({ data }) => {
        if (activo) setSuscripto(Boolean(data));
        });
        return () => { activo = false; };
    }, [idUsuario, idMarca]);

    const handleClick = async () => {
        if (!estaLogueado) { navigate("/login"); return; }
        setProcesando(true);
        if (suscripto) {
        const { error } = await quitarSuscripcion(idUsuario, idMarca);
        if (!error) { setSuscripto(false); mostrarToast("Te desuscribiste", "info"); }
        else mostrarToast("No se pudo desuscribir", "error");
        } else {
        const { error } = await agregarSuscripcion(idUsuario, idMarca);
        if (!error) { setSuscripto(true); mostrarToast(`Te suscribiste a ${nombreMarca}`, "exito"); }
        else mostrarToast("No se pudo suscribir", "error");
        }
        setProcesando(false);
    };

    return (
        <button
            className={`boton-suscribirse ${suscripto ? "boton-suscribirse--activo" : ""}`}
            onClick={handleClick}
            disabled={procesando}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {suscripto ? "Suscripto" : "Suscribirme"}
        </button>
    );
}

export default BotonSuscribirse;