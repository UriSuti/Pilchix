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

export async function getSubcategorias(idCategoria) {
  try {
    const query = idCategoria ? `?id_categoria=${idCategoria}` : "";
    const data = await apiFetch(`/catalogo/subcategorias${query}`, { token: token() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function crearSubcategoria(nombre, idCategoria) {
  try {
    const data = await apiFetch("/catalogo/subcategorias", {
      method: "POST",
      body: { nombre, id_categoria: idCategoria },
      token: token(),
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "No se pudo crear la subcategoría" };
  }
}

export async function getEtiquetas() {
  try {
    const data = await apiFetch("/catalogo/etiquetas", { token: token() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function crearEtiqueta(nombre) {
  try {
    const data = await apiFetch("/catalogo/etiquetas", {
      method: "POST",
      body: { nombre },
      token: token(),
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "No se pudo crear la etiqueta" };
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

export async function getDescuentoProducto(idProducto) {
  try {
    const data = await apiFetch(`/catalogo/productos/${idProducto}/descuento`, { token: token() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function setDescuentoProducto(idProducto, { porcentaje, dias }) {
  try {
    const data = await apiFetch(`/catalogo/productos/${idProducto}/descuento`, {
      method: "PUT",
      body: { porcentaje, dias },
      token: token(),
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "No se pudo activar la oferta" };
  }
}

export async function quitarDescuentoProducto(idProducto) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/descuento`, { method: "DELETE", token: token() });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudo quitar la oferta" };
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

export async function setSubcategoriasProducto(idProducto, idsSubcategorias) {
  if (!idsSubcategorias.length) return { error: null };
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/subcategorias`, {
      method: "POST",
      body: { idsSubcategorias },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudieron guardar las subcategorías" };
  }
}

export async function actualizarSubcategoriasProducto(idProducto, idsSubcategorias) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/subcategorias`, {
      method: "PUT",
      body: { idsSubcategorias },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudieron actualizar las subcategorías" };
  }
}

export async function setEtiquetasProducto(idProducto, idsEtiquetas) {
  if (!idsEtiquetas.length) return { error: null };
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/etiquetas`, {
      method: "POST",
      body: { idsEtiquetas },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudieron guardar las etiquetas" };
  }
}

export async function actualizarEtiquetasProducto(idProducto, idsEtiquetas) {
  try {
    await apiFetch(`/catalogo/productos/${idProducto}/etiquetas`, {
      method: "PUT",
      body: { idsEtiquetas },
      token: token(),
    });
    return { error: null };
  } catch (err) {
    return { error: err.message || "No se pudieron actualizar las etiquetas" };
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

export async function getCategoriasActivas() {
  try {
    const data = await apiFetch("/categorias-marca", { token: token() });
    // filtramos las globales dejando solo las activas de la marca
    const activas = new Set(data.activas ?? []);
    return { data: (data.globales ?? []).filter((c) => activas.has(c.id_categoria)), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}