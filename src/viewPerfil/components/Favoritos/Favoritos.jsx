import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext.jsx";
import { useFavoritos } from "../../hooks/useFavoritos";
import { quitarFavorito } from "../../services/perfil";
import { slugify } from "../../../utils/slugify.js";

function Favoritos() {
    const navigate = useNavigate();
    const { idUsuario } = useAuth();
    const { mostrarToast } = useToast();
    const { favoritos, cargando, refrescar } = useFavoritos(idUsuario);

    const handleQuitar = async (e, idProducto, nombre) => {
        e.stopPropagation();
        const { error } = await quitarFavorito(idUsuario, idProducto);
        if (error) { mostrarToast("No se pudo quitar el favorito", "error"); return; }
        mostrarToast(`Quitaste ${nombre} de favoritos`, "info");
        refrescar();
    };

    if (cargando) return <p className="perfil-vacio">Cargando...</p>;

    if (favoritos.length === 0) {
        return (
        <div className="perfil-vacio">
            <button className="perfil-agregar" onClick={() => navigate("/")}>
            <span className="perfil-agregar__icono">+</span>
            Explorar productos
            </button>
        </div>
        );
    }

    return (
        <div className="perfil-grid">
        {favoritos.map((f) => (
            <div
            key={f.id_favorito}
            className="card-perfil"
            onClick={() => navigate(`/producto/${slugify(f.Producto.nombre)}`)}
            >
            <button
                className="card-perfil__quitar"
                title="Quitar de favoritos"
                onClick={(e) => handleQuitar(e, f.id_producto, f.Producto.nombre)}
            >
                ✕
            </button>
            {f.Producto.Imagen?.[0]?.imagen ? (
                <img
                    src={f.Producto.Imagen[0].imagen}
                    alt={f.Producto.nombre}
                    className="card-perfil__img"
                />
                ) : (
                <div className="card-perfil__placeholder">{f.Producto.nombre.charAt(0)}</div>
            )}
            <span className="card-perfil__nombre">{f.Producto.nombre}</span>
            <span className="card-perfil__precio">${f.Producto.precio}</span>
            </div>
        ))}
        </div>
    );
}

export default Favoritos;