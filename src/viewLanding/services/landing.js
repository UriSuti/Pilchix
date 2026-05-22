import { supabase } from "../../utils/supabase";

export function getLandingCategorias() {
  return supabase
    .from("Categoria")
    .select("id_categoria, nombre")
    .order("nombre", { ascending: true });
}

export function getLandingCategoriasConProductos() {
  return supabase
    .from("Producto_Categoria")
    .select(
      `
      id_categoria,
      Producto (
        id_producto,
        estado,
        Imagen (
          imagen
        )
      )
    `
    )
    .eq("Producto.estado", 1);
}

export function getLandingMarcas() {
  return supabase
    .from("Marca")
    .select("id_marca, nombre, descripcion, logo, sitio_web, ubicacion")
    .eq("estado", 1);
}

export function getLandingMarcasPopulares() {
  return supabase
    .from("Marca")
    .select(
      `
      id_marca,
      nombre,
      descripcion,
      logo,
      sitio_web,
      ubicacion,
      Producto (
        id_producto,
        Metrica_Producto (
          visualizaciones
        )
      )
    `
    )
    .eq("estado", 1);
}

export function getLandingProductosPopulares() {
  return supabase
    .from("Producto")
    .select(
      `
      id_producto,
      nombre,
      descripcion,
      precio,
      estado,
      Marca (
        nombre
      ),
      Imagen (
        imagen
      ),
      Metrica_Producto (
        visualizaciones
      )
    `
    )
    .eq("estado", 1);
}

export function getLandingDescuentos(fechaActual) {
  return supabase
    .from("Descuento")
    .select(
      `
      id_descuento,
      porcentaje,
      precio_anterior,
      precio_final,
      fecha_inicio,
      fecha_fin,
      Producto (
        id_producto,
        nombre,
        descripcion,
        precio,
        estado,
        Marca (
          nombre
        ),
        Imagen (
          imagen
        )
      )
    `
    )
    .lte("fecha_inicio", fechaActual)
    .gte("fecha_fin", fechaActual)
    .eq("Producto.estado", 1);
}

export function getLandingCarrito(idUsuario) {
  return supabase
    .from("Carrito")
    .select(
      `
      id_carrito,
      Carrito_Detalle (
        id_detalle
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
  return supabase
    .from("Producto")
    .select(
      `
      id_producto,
      nombre,
      descripcion,
      precio,
      stock,
      estado,
      Imagen (
        imagen
      ),
      Marca (
        nombre
      )
    `
    )
    .eq("estado", 1)
    .or(`nombre.ilike.%${textoBusqueda}%,descripcion.ilike.%${textoBusqueda}%`);
}

export function searchLandingCategorias(textoBusqueda) {
  return supabase
    .from("Producto_Categoria")
    .select(
      `
      Producto (
        id_producto,
        nombre,
        descripcion,
        precio,
        stock,
        estado,
        Imagen (
          imagen
        ),
        Marca (
          nombre
        )
      ),
      Categoria (
        nombre
      )
    `
    )
    .eq("Producto.estado", 1)
    .ilike("Categoria.nombre", `%${textoBusqueda}%`);
}
