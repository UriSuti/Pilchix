import { apiFetch, apiFetchForm, tokenStore } from "../../services/api";

function token() {
  return tokenStore.getMarca();
}

export async function getCategorias() {
  try {
    const data = await apiFetch("/catalogo/categorias", { token: token() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function getProductosDeMarca() {
  try {
    const data = await apiFetch("/catalogo/productos", { token: token() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function getProductoPorId(idProducto) {
  try {
    const data = await apiFetch(`/catalogo/productos/${idProducto}`, { token: token() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function crearProducto(datos) {
  try {
    const { idProducto } = await apiFetch("/catalogo/productos", {
      method: "POST",
      body: datos,
      token: token(),
    });
    return { idProducto, error: null };
  } catch (err) {
    return { idProducto: null, error: err.message || "No se pudo crear el producto" };
  }
}

export async function actualizarProducto(idProducto, datos) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}`, { method: "PUT", body: datos, token: token() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo guardar el producto" };
  }
}

export async function borrarProducto(idProducto) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}`, { method: "DELETE", token: token() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo borrar el producto" };
  }
}

export async function setCategoriasProducto(idProducto, idsCategorias) {
  if (!idsCategorias.length) return { error: null };
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/categorias`, {
      method: "POST",
      body: { idsCategorias },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudieron guardar las categorías" };
  }
}

export async function actualizarCategoriasProducto(idProducto, idsCategorias) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/categorias`, {
      method: "PUT",
      body: { idsCategorias },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudieron actualizar las categorías" };
  }
}

// imagenes: [{ file, color, esPortada }]
export async function subirImagenesProducto(idProducto, imagenes) {
  if (!imagenes.length) return { data: [], error: null };
  try {
    const formData = new FormData();
    imagenes.forEach(({ file }) => formData.append("imagenes", file));
    formData.append("meta", JSON.stringify(imagenes.map(({ color, esPortada }) => ({ color, esPortada }))));

    const data = await apiFetchForm(`/catalogo/productos/${idProducto}/imagenes`, {
      formData,
      token: token(),
    });
    return { data, error: null };
  } catch (err) {
    return { data: [], error: err.message || "No se pudieron subir las imágenes" };
  }
}

export async function marcarPortada(idProducto, idImagen) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/imagenes/${idImagen}/portada`, {
      method: "PUT",
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo marcar la portada" };
  }
}

export async function actualizarColorImagen(idImagen, color) {
  try {
    await apiFetch(`/catalogo/imagenes/${idImagen}/color`, {
      method: "PUT",
      body: { color },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo actualizar el color de la imagen" };
  }
}

export async function borrarImagen(idImagen) {
  try {
    await apiFetch(`/catalogo/imagenes/${idImagen}`, { method: "DELETE", token: token() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo borrar la imagen" };
  }
}
