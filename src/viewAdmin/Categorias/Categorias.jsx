import { useState, useEffect, useCallback } from "react";
import { categoriasApi } from "../services/categorias";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import { useToast } from "../../context/ToastContext";
import "./Categorias.css";

function Categorias() {
    const { mostrarToast } = useToast();
    const [globales, setGlobales] = useState([]);
    const [activas, setActivas] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [nuevaSub, setNuevaSub] = useState({});   // { idCategoria: "texto" }
    const [editando, setEditando] = useState(null); // { id, nombre }

    const refrescar = useCallback(async () => {
        try {
            const data = await categoriasApi.getModulo();
            setGlobales(data.globales ?? []);
            setActivas(data.activas ?? []);
            setSubcategorias(data.subcategorias ?? []);
        } catch (e) {
            mostrarToast(e.message, "error");
        }
        setCargando(false);
    }, [mostrarToast]);

    useEffect(() => { refrescar(); }, [refrescar]);
    usePaginaCargando(cargando);
    if (cargando) return null;

    const estaActiva = (id) => activas.includes(id);
    const subsDe = (idCategoria) => subcategorias.filter((s) => s.id_categoria === idCategoria);

    const toggleCategoria = async (cat) => {
        try {
            if (estaActiva(cat.id_categoria)) {
                await categoriasApi.desactivar(cat.id_categoria);
                mostrarToast(`Dejaste de usar ${cat.nombre}`, "info");
            } else {
                await categoriasApi.activar(cat.id_categoria);
                mostrarToast(`Activaste ${cat.nombre}`, "exito");
            }
            refrescar();
        } catch (e) {
            mostrarToast(e.message, "error");   // acá cae el 409 de "tenés productos"
        }
    };

    const agregarSub = async (idCategoria) => {
        const nombre = (nuevaSub[idCategoria] ?? "").trim();
        if (!nombre) return;
        try {
            await categoriasApi.crearSub(idCategoria, nombre);
            setNuevaSub((p) => ({ ...p, [idCategoria]: "" }));
            mostrarToast("Subcategoría creada", "exito");
            refrescar();
        } catch (e) { mostrarToast(e.message, "error"); }
    };

    const guardarEdicion = async () => {
        try {
            await categoriasApi.actualizarSub(editando.id, editando.nombre);
            setEditando(null);
            mostrarToast("Subcategoría actualizada", "exito");
            refrescar();
        } catch (e) { mostrarToast(e.message, "error"); }
    };

    const borrarSub = async (sub) => {
        if (!confirm(`¿Borrar la subcategoría "${sub.nombre}"?`)) return;
        try {
            await categoriasApi.borrarSub(sub.id_subcategoria);
            mostrarToast("Subcategoría eliminada", "info");
            refrescar();
        } catch (e) { mostrarToast(e.message, "error"); }
    };

    return (
        <div className="cats">
        <header className="cats__head">
            <h1>Categorías</h1>
            <p>Elegí qué categorías usa tu marca y creá tus subcategorías</p>
        </header>

        <div className="cats__lista">
            {globales.map((cat) => {
            const activa = estaActiva(cat.id_categoria);
            const subs = subsDe(cat.id_categoria);

            return (
                <div key={cat.id_categoria} className={`cat-card ${activa ? "cat-card--activa" : ""}`}>
                <div className="cat-card__head">
                    <label className="cat-card__toggle">
                    <input
                        type="checkbox"
                        checked={activa}
                        onChange={() => toggleCategoria(cat)}
                    />
                    <span className="cat-card__nombre">{cat.nombre}</span>
                    </label>
                    {activa && (
                    <span className="cat-card__contador">
                        {subs.length} {subs.length === 1 ? "subcategoría" : "subcategorías"}
                    </span>
                    )}
                </div>

                {activa && (
                    <div className="cat-card__body">
                    {subs.length > 0 && (
                        <ul className="subs">
                        {subs.map((sub) => (
                            <li key={sub.id_subcategoria} className="sub">
                            {editando?.id === sub.id_subcategoria ? (
                                <>
                                <input
                                    className="sub__input"
                                    value={editando.nombre}
                                    onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && guardarEdicion()}
                                    autoFocus
                                />
                                <button className="sub__btn" onClick={guardarEdicion}>Guardar</button>
                                <button className="sub__btn sub__btn--gris" onClick={() => setEditando(null)}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                <span className="sub__nombre">{sub.nombre}</span>
                                <button
                                    className="sub__btn"
                                    onClick={() => setEditando({ id: sub.id_subcategoria, nombre: sub.nombre })}
                                >
                                    Editar
                                </button>
                                <button className="sub__btn sub__btn--rojo" onClick={() => borrarSub(sub)}>
                                    Borrar
                                </button>
                                </>
                            )}
                            </li>
                        ))}
                        </ul>
                    )}

                    <div className="cat-card__agregar">
                        <input
                            placeholder="Nueva subcategoría"
                            value={nuevaSub[cat.id_categoria] ?? ""}
                            onChange={(e) => setNuevaSub((p) => ({ ...p, [cat.id_categoria]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && agregarSub(cat.id_categoria)}
                        />
                        <button onClick={() => agregarSub(cat.id_categoria)}>Agregar</button>
                    </div>
                    </div>
                )}
                </div>
            );
            })}
        </div>
        </div>
    );
}

export default Categorias;