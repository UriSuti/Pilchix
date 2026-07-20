import { apiFetch, apiFetchForm, tokenStore } from "./api";

function tk() {
  return tokenStore.getMarca();
}

// ---- público (landing) ----
export async function getLooks() {
  try {
    const data = await apiFetch("/looks");
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ---- back-office (marca) ----
export async function getMisLooks() {
  try {
    const data = await apiFetch("/looks/mis", { token: tk() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function crearLook({ imagen, imagenHover, titulo, productos }) {
  try {
    const formData = new FormData();
    formData.append("imagen", imagen);
    if (imagenHover) formData.append("imagen_hover", imagenHover);
    if (titulo) formData.append("titulo", titulo);
    formData.append("productos", JSON.stringify(productos ?? []));
    const data = await apiFetchForm("/looks", { method: "POST", formData, token: tk() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "No se pudo crear el look" };
  }
}

export async function actualizarLook(idLook, { imagen, imagenHover, titulo, productos }) {
  try {
    const formData = new FormData();
    if (imagen) formData.append("imagen", imagen); // solo si se reemplaza
    if (imagenHover) formData.append("imagen_hover", imagenHover);
    formData.append("titulo", titulo ?? "");
    formData.append("productos", JSON.stringify(productos ?? []));
    await apiFetchForm(`/looks/${idLook}`, { method: "PUT", formData, token: tk() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo actualizar el look" };
  }
}

export async function setProductosLook(idLook, productos) {
  try {
    await apiFetch(`/looks/${idLook}/productos`, {
      method: "PUT",
      body: { productos },
      token: tk(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function borrarLook(idLook) {
  try {
    await apiFetch(`/looks/${idLook}`, { method: "DELETE", token: tk() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo borrar el look" };
  }
}
