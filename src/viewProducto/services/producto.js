import { apiFetch } from "../../services/api";

export async function getProductos() {
  try {
    const data = await apiFetch("/productos");
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function incrementarVisualizacion(idProducto) {
  try {
    await apiFetch(`/productos/${idProducto}/visualizacion`, { method: "POST" });
    return { error: null };
  } catch (err) {
    return { error: err };
  }
}

export async function incrementarClic(idProducto) {
  try {
    await apiFetch(`/productos/${idProducto}/clic`, { method: "POST" });
    return { error: null };
  } catch (err) {
    return { error: err };
  }
}
