import { apiFetch, tokenStore } from "./api";

const tk = () => tokenStore.getMarca();

export async function getPerfilMarca() {
  try {
    const data = await apiFetch("/marca/perfil", { token: tk() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function actualizarPerfilMarca(campos) {
  try {
    await apiFetch("/marca/perfil", { method: "PUT", body: campos, token: tk() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo guardar" };
  }
}
