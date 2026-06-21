import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext.jsx";
import { getFavorito, agregarFavorito, quitarFavorito } from "../../../viewPerfil/services/perfil";
import "./BotonFavorito.css";

function BotonFavorito({ idProducto }) {
    const navigate = useNavigate();
    const { idUsuario, estaLogueado } = useAuth();
    const { mostrarToast } = useToast();
    const [favorito, setFavorito] = useState(false);
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        if (!idUsuario || !idProducto) return;
        let activo = true;
        getFavorito(idUsuario, idProducto).then(({ data }) => {
        if (activo) setFavorito(Boolean(data));
        });
        return () => { activo = false; };
    }, [idUsuario, idProducto]);

    const handleClick = async (e) => {
        e.preventDefault();  // por si está dentro de un Link (no navegar al togglear)
        e.stopPropagation(); // por si la card del producto es clickeable
        if (!estaLogueado) { navigate("/login"); return; }
        setProcesando(true);
        if (favorito) {
        const { error } = await quitarFavorito(idUsuario, idProducto);
        if (!error) { setFavorito(false); mostrarToast("Quitado de favoritos", "info"); }
        else mostrarToast("No se pudo quitar", "error");
        } else {
        const { error } = await agregarFavorito(idUsuario, idProducto);
        if (!error) { setFavorito(true); mostrarToast("Agregado a favoritos", "exito"); }
        else mostrarToast("No se pudo agregar", "error");
        }
        setProcesando(false);
    };

    return (
        <button
            className={`boton-favorito ${favorito ? "boton-favorito--activo" : ""}`}
            onClick={handleClick}
            disabled={procesando}
            aria-label="Favorito"
        >
            <svg width="26" height="26" viewBox="0 0 24 24"
            fill={favorito ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}

export default BotonFavorito;