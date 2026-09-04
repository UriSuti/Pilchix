import { apiFetch, tokenStore } from "../../services/api";

const auth = () => ({ token: tokenStore.getMarca() });

export const categoriasApi = {
    getModulo: () => apiFetch("/categorias-marca", auth()),
    activar: (idCategoria) =>
        apiFetch(`/categorias-marca/${idCategoria}/activar`, { method: "POST", ...auth() }),
    desactivar: (idCategoria) =>
        apiFetch(`/categorias-marca/${idCategoria}/activar`, { method: "DELETE", ...auth() }),
    crearSub: (idCategoria, nombre) =>
        apiFetch("/categorias-marca/subcategorias", { method: "POST", body: { idCategoria, nombre }, ...auth() }),
    actualizarSub: (id, nombre) =>
        apiFetch(`/categorias-marca/subcategorias/${id}`, { method: "PUT", body: { nombre }, ...auth() }),
    borrarSub: (id) =>
        apiFetch(`/categorias-marca/subcategorias/${id}`, { method: "DELETE", ...auth() }),
};