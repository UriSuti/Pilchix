import { apiFetch } from "./api";

// Opiniones de un producto (más nuevas primero), públicas para cualquiera
export function getOpinionesProducto(idProducto) {
  return apiFetch(`/opiniones/producto/${idProducto}`);
}

// Si el usuario logueado compró el producto y si ya dejó su opinión
export function getEstadoOpinion(idProducto, token) {
  return apiFetch(`/opiniones/producto/${idProducto}/estado`, { token });
}

export function crearOpinion({ id_producto, texto, recomienda, token }) {
  return apiFetch("/opiniones", {
    method: "POST",
    body: { id_producto, texto, recomienda },
    token,
  });
}

export function eliminarOpinion(idOpinion, token) {
  return apiFetch(`/opiniones/${idOpinion}`, { method: "DELETE", token });
}
