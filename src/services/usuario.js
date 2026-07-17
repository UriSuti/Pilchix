import { apiFetch, apiFetchForm, tokenStore } from "./api";

function token() {
  return tokenStore.getUsuario();
}

export async function subirFotoPerfil(idUsuario, archivo) {
  try {
    const formData = new FormData();
    formData.append("foto", archivo);
    const usuario = await apiFetchForm("/usuarios/me/foto", { formData, token: token() });
    return { url: usuario.foto_perfil, usuario, error: null };
  } catch {
    return { url: null, usuario: null, error: "No se pudo subir la imagen" };
  }
}

export async function actualizarDatosUsuario(idUsuario, datos) {
  try {
    const usuario = await apiFetch("/usuarios/me", { method: "PUT", body: datos, token: token() });
    return { usuario, error: null };
  } catch {
    return { usuario: null, error: "No se pudieron guardar los cambios" };
  }
}
