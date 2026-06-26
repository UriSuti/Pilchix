import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header_footer/Header/Header.jsx";
import Footer from "../header_footer/Footer/Footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext.jsx";
import { slugify } from "../utils/slugify.js";
import { useSuscripciones } from "./hooks/useSuscripciones.js";
import { usePaginaCargando } from "../context/NavLoadingContext.jsx";
import "./Perfil.css";
import EditarDatos from "./components/EditarDatos/EditarDatos.jsx";
import Favoritos from "./components/Favoritos/Favoritos.jsx";
import Suscripciones from "./components/Suscripciones/Suscripciones.jsx";

const TABS = ["Editar datos", "Favoritos", "Suscripciones"];

function Perfil() {
    const navigate = useNavigate();

    const { usuario, estaLogueado, cargando, logout, idUsuario } = useAuth();
    const { mostrarToast } = useToast();
    const [tabActiva, setTabActiva] = useState("Editar datos");
    const { suscripciones, cargando: cargandoSus } = useSuscripciones(idUsuario);
    usePaginaCargando(cargando || cargandoSus);

    useEffect(() => {
        if (!cargando && !estaLogueado) navigate("/login");
    }, [cargando, estaLogueado, navigate]);

    if (cargando || !usuario) return null;

    const username = "@" + (usuario.email?.split("@")[0] ?? "usuario");

    const handleLogout = () => {
        logout();
        mostrarToast("Cerraste sesión", "info");
        navigate("/");
    };

    return (
        <div className="perfil-page">
        <Header />

        <section className="perfil-banner" />

        <div className="perfil-avatar-wrapper">
            {usuario.foto_perfil ? (
            <img src={usuario.foto_perfil} alt={usuario.nombre} className="perfil-avatar" />
            ) : (
            <div className="perfil-avatar perfil-avatar--placeholder">
                {usuario.nombre?.charAt(0).toUpperCase()}
            </div>
            )}
        </div>

        <div className="perfil-info">
            <h1 className="perfil-nombre">
            {usuario.nombre}
            </h1>
            <p className="perfil-username">{username}</p>
        </div>

        <nav className="perfil-tabs">
            {TABS.map((tab) => (
            <button
                key={tab}
                className={`perfil-tab ${tabActiva === tab ? "perfil-tab--activa" : ""}`}
                onClick={() => setTabActiva(tab)}
            >
                {tab}
            </button>
            ))}
        </nav>

        <main className="perfil-contenido">
            {tabActiva === "Editar datos" && <EditarDatos />}
            {tabActiva === "Favoritos" && <Favoritos />}
            {tabActiva === "Suscripciones" && <Suscripciones />}
        </main>

        <button className="perfil-logout" onClick={handleLogout}>
            Cerrar sesión
        </button>

        <Footer />
        </div>
    );
}

export default Perfil;