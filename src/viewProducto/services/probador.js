import { apiFetch, apiFetchForm, tokenStore } from "../../services/api";

// devuelve { imagen, idPrueba, fotoProbador? }; lanza si falla
// (incluido el caso "llegaste al límite de hoy", con status 429).
// archivoFoto null = usa la foto guardada en el perfil.
// guardarFoto = la foto subida queda guardada en el perfil para la próxima.
// color = hex del color elegido; el back prueba la foto de ese color (si no, la portada).
export function generarPruebaVirtual(idProducto, archivoFoto, { guardarFoto = false, color } = {}) {
  const formData = new FormData();
  if (archivoFoto) {
    formData.append("foto", archivoFoto);
    formData.append("guardarFoto", String(guardarFoto));
  }
  if (color) formData.append("color", color);
  return apiFetchForm(`/probador/${idProducto}`, {
    method: "POST",
    formData,
    token: tokenStore.getUsuario(),
  });
}

// prueba varias prendas juntas sobre la misma foto (el look completo del estilista).
// Devuelve lo mismo que generarPruebaVirtual; cada prenda gasta un uso del límite diario.
export function generarPruebaLook(idsProductos, archivoFoto, { guardarFoto = false } = {}) {
  const formData = new FormData();
  formData.append("productos", JSON.stringify(idsProductos));
  if (archivoFoto) {
    formData.append("foto", archivoFoto);
    formData.append("guardarFoto", String(guardarFoto));
  }
  return apiFetchForm("/probador/look", {
    method: "POST",
    formData,
    token: tokenStore.getUsuario(),
  });
}

// manda una prueba ya generada a <dni>@est.ort.edu.ar; devuelve { email }; lanza si falla
export function enviarPruebaPorMail(idPrueba, dni) {
  return apiFetch(`/probador/pruebas/${idPrueba}/mail`, {
    method: "POST",
    body: { dni },
    token: tokenStore.getUsuario(),
  });
}

/* ---------- foto guardada en el perfil ---------- */

// devuelve la URL de la foto guardada o null
export async function getFotoProbador() {
  const { foto } = await apiFetch("/probador/foto", { token: tokenStore.getUsuario() });
  return foto ?? null;
}

// sube (o reemplaza) la foto guardada; devuelve la URL nueva
export async function subirFotoProbador(archivoFoto) {
  const formData = new FormData();
  formData.append("foto", archivoFoto);
  const { foto } = await apiFetchForm("/probador/foto", {
    method: "PUT",
    formData,
    token: tokenStore.getUsuario(),
  });
  return foto;
}

export function borrarFotoProbador() {
  return apiFetch("/probador/foto", { method: "DELETE", token: tokenStore.getUsuario() });
}
