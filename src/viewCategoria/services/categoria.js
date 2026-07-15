import { apiFetch } from "../../services/api";

async function apiFetchAsQuery(path) {
  try {
    const data = await apiFetch(path);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Todas las categorías (para la ruleta/coverflow)
export function getCategorias() {
  return apiFetchAsQuery("/productos/categorias");
}

// Productos de TODAS las categorías, con su marca (logo) e imagen.
// Se agrupan por categoría en el hook. Solo productos activos.
export function getCategoriaProductos() {
  return apiFetchAsQuery("/productos/categorias/completo");
}
