import { supabase } from "../../utils/supabase";
import { apiFetch } from "../../services/api";

// catálogo público (locales, productos, categorías) ahora vive en el backend, sin auth
async function apiFetchAsQuery(path) {
  try {
    const data = await apiFetch(path);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export function getLandingCategorias() {
  return apiFetchAsQuery("/productos/categorias");
}

export function getLandingCategoriasConProductos() {
  return apiFetchAsQuery("/productos/categorias/resumen");
}

export function getImagenMarca(id_marca) {
  return apiFetchAsQuery(`/locales/${id_marca}/fachada`);
}

export function getLandingMarcas() {
  return apiFetchAsQuery("/locales/marcas");
}

export function getLandingMarcasPopulares() {
  return apiFetchAsQuery("/locales/marcas/populares");
}

// Todos los locales para la página /locales: fachada + productos (para contar) + métricas (para ordenar)
export function getLocales() {
  return apiFetchAsQuery("/locales");
}

export function getLandingProductosPopulares() {
  return apiFetchAsQuery("/productos/populares");
}

export function getLandingDescuentos(fechaActual) {
  return apiFetchAsQuery(`/productos/descuentos?fecha=${encodeURIComponent(fechaActual)}`);
}

export function getLandingCarrito(idUsuario) {
  return supabase
    .from("Carrito")
    .select(
      `
      id_carrito,
      Carrito_Detalle (
        id_detalle,
        cantidad
      )
    `
    )
    .eq("id_usuario", idUsuario);
}

export function getLandingSuscripciones(idUsuario) {
  return supabase
    .from("Suscripcion")
    .select(
      `
      id_suscripcion,
      id_marca,
      fecha_inicio,
      Marca (
        nombre
      )
    `
    )
    .eq("id_usuario", idUsuario);
}

export function saveBusquedaUsuario(idUsuario, textoBusqueda) {
  return supabase.from("Busqueda").insert([
    {
      id_usuario: idUsuario,
      texto_busqueda: textoBusqueda,
      fecha: new Date().toISOString(),
    },
  ]);
}

export function searchLandingProductos(textoBusqueda) {
  return apiFetchAsQuery(`/productos/buscar?q=${encodeURIComponent(textoBusqueda)}`);
}

export function searchLandingCategorias(textoBusqueda) {
  return apiFetchAsQuery(`/productos/buscar/categorias?q=${encodeURIComponent(textoBusqueda)}`);
}

export function searchLandingMarcas(textoBusqueda) {
  return apiFetchAsQuery(`/locales/marcas/buscar?q=${encodeURIComponent(textoBusqueda)}`);
}

export function searchLandingCategoriasPorNombre(textoBusqueda) {
  return apiFetchAsQuery(`/productos/categorias/buscar?q=${encodeURIComponent(textoBusqueda)}`);
}
