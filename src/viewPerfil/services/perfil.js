import { apiFetch, tokenStore } from "../../services/api";

function token() {
  return tokenStore.getUsuario();
}

async function comoQuery(promesa) {
  try {
    return { data: await promesa, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/* ---------- SUSCRIPCIONES ---------- */
export function getSuscripcionesUsuario() {
  return comoQuery(apiFetch("/suscripciones", { token: token() }));
}

export async function getSuscripcion(idUsuario, idMarca) {
  const { data, error } = await comoQuery(apiFetch(`/suscripciones/${idMarca}`, { token: token() }));
  return { data: data?.suscripto ? { id_suscripcion: true } : null, error };
}

export function agregarSuscripcion(idUsuario, idMarca) {
  return comoQuery(apiFetch(`/suscripciones/${idMarca}`, { method: "POST", token: token() }));
}

export function quitarSuscripcion(idUsuario, idMarca) {
  return comoQuery(apiFetch(`/suscripciones/${idMarca}`, { method: "DELETE", token: token() }));
}

/* ---------- FAVORITOS ---------- */
export function getFavoritosUsuario() {
  return comoQuery(apiFetch("/favoritos", { token: token() }));
}

export async function getFavorito(idUsuario, idProducto) {
  const { data, error } = await comoQuery(apiFetch(`/favoritos/${idProducto}`, { token: token() }));
  return { data: data?.favorito ? { id_favorito: true } : null, error };
}

export function agregarFavorito(idUsuario, idProducto) {
  return comoQuery(apiFetch(`/favoritos/${idProducto}`, { method: "POST", token: token() }));
}

export function quitarFavorito(idUsuario, idProducto) {
  return comoQuery(apiFetch(`/favoritos/${idProducto}`, { method: "DELETE", token: token() }));
}
