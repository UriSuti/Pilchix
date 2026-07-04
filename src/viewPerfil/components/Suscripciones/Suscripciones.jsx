import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext.jsx";
import { useSuscripciones } from "../../hooks/useSuscripciones";
import { quitarSuscripcion } from "../../services/perfil";
import { slugify } from "../../../utils/slugify.js";

function Suscripciones() {
    const navigate = useNavigate();
    const { idUsuario } = useAuth();
    const { mostrarToast } = useToast();
    const { suscripciones, cargando, refrescar } = useSuscripciones(idUsuario);

    const handleQuitar = async (e, idMarca, nombre) => {
        e.stopPropagation();
        const { error } = await quitarSuscripcion(idUsuario, idMarca);
        if (error) { mostrarToast("No se pudo quitar la suscripción", "error"); return; }
        mostrarToast(`Te desuscribiste de ${nombre}`, "info");
        refrescar();
    };

    if (cargando) return <p className="perfil-vacio">Cargando...</p>;

    if (suscripciones.length === 0) {
        return (
        <div className="perfil-vacio">
            <h3 className="perfil-vacio__titulo">Todavía no seguís locales</h3>
            <p className="perfil-vacio__texto">
                Descubrí los locales destacados y seguí a tus marcas favoritas.
            </p>
            <a className="perfil-agregar" href="/#locales">
                Ver locales destacados →
            </a>
        </div>
        );
    }

    return (
        <div className="perfil-grid">
        {suscripciones.map((s) => (
            <div
            key={s.id_suscripcion}
            className="card-perfil"
            onClick={() => navigate(`/${slugify(s.Marca.nombre)}`)}
            >
            <button
                className="card-perfil__quitar"
                title="Quitar suscripción"
                onClick={(e) => handleQuitar(e, s.id_marca, s.Marca.nombre)}
            >
                ✕
            </button>
            {s.Marca.logo ? (
                <img src={s.Marca.logo} alt={s.Marca.nombre} className="card-perfil__img" />
            ) : (
                <div className="card-perfil__placeholder">{s.Marca.nombre.charAt(0)}</div>
            )}
            <span className="card-perfil__nombre">{s.Marca.nombre}</span>
            </div>
        ))}
        </div>
    );
}

export default Suscripciones;