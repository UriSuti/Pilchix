import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header_footer/Header/Header.jsx";
import Footer from "../header_footer/Footer/Footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext.jsx";
import { useSuscripciones } from "./hooks/useSuscripciones.js";
import { useFavoritos } from "./hooks/useFavoritos.js";
import { usePaginaCargando } from "../context/NavLoadingContext.jsx";
import "./Perfil.css";
import EditarDatos from "./components/EditarDatos/EditarDatos.jsx";
import Favoritos from "./components/Favoritos/Favoritos.jsx";
import Suscripciones from "./components/Suscripciones/Suscripciones.jsx";

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const IconStore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const TABS = [
  { id: "editar", label: "Editar datos", Icon: IconUser },
  { id: "favoritos", label: "Favoritos", Icon: IconHeart },
  { id: "suscripciones", label: "Suscripciones", Icon: IconStore },
];

function Perfil() {
    const navigate = useNavigate();

    const { usuario, estaLogueado, cargando, logout, idUsuario } = useAuth();
    const { mostrarToast } = useToast();
    const [tabActiva, setTabActiva] = useState("editar");
    const { suscripciones, cargando: cargandoSus } = useSuscripciones(idUsuario);
    const { favoritos, cargando: cargandoFav } = useFavoritos(idUsuario);
    usePaginaCargando(cargando || cargandoSus || cargandoFav);

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

        <section className="perfil-hero">
            <div className="perfil-hero__id">
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
                    <h1 className="perfil-nombre">{usuario.nombre}</h1>
                    <p className="perfil-username">{username}</p>
                </div>
            </div>

            <div className="perfil-stats">
                <div className="perfil-stat">
                    <span className="perfil-stat__num">{favoritos.length}</span>
                    <span className="perfil-stat__label">Favoritos</span>
                </div>
                <div className="perfil-stat">
                    <span className="perfil-stat__num">{suscripciones.length}</span>
                    <span className="perfil-stat__label">Locales seguidos</span>
                </div>
            </div>
        </section>

        <div className="perfil-dash">
            <nav className="perfil-sidebar">
                {TABS.map(({ id, label, Icon }) => (
                <button
                    key={id}
                    className={`perfil-tab ${tabActiva === id ? "perfil-tab--activa" : ""}`}
                    onClick={() => setTabActiva(id)}
                >
                    <Icon />
                    {label}
                </button>
                ))}

                <button className="perfil-logout" onClick={handleLogout}>
                    <IconLogout />
                    Cerrar sesión
                </button>
            </nav>

            <main className="perfil-panel">
                {tabActiva === "editar" && <EditarDatos />}
                {tabActiva === "favoritos" && <Favoritos />}
                {tabActiva === "suscripciones" && <Suscripciones />}
            </main>
        </div>

        <Footer />
        </div>
    );
}

export default Perfil;
