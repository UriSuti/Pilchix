import { supabase } from "../../utils/supabase";

// trae todos los productos de una marca, con su primera imagen
export function getProductosDeMarca(idMarca) {
  return supabase
    .from("Producto")
    .select(`
      id_producto,
      nombre,
      descripcion,
      precio,
      stock,
      estado,
      fecha_alta,
      Imagen ( imagen, es_portada )
    `)
    .eq("id_marca", idMarca)
    .order("fecha_alta", { ascending: false });
}

// categorías para el selector
export function getCategorias() {
  return supabase.from("Categoria").select("id_categoria, nombre").order("nombre");
}

// crear producto (fecha_alta la pone el default de la base)
export async function crearProducto(datos) {
  const { data, error } = await supabase
    .from("Producto")
    .insert([datos])
    .select("id_producto")
    .single();
    console.log("CREAR PRODUCTO error:", error);
  if (error) return { idProducto: null, error: "No se pudo crear el producto" };
  return { idProducto: data.id_producto, error: null };
}

// asociar categorías (tabla intermedia)
export async function setCategoriasProducto(idProducto, idsCategorias) {
  if (!idsCategorias.length) return { error: null };
  const filas = idsCategorias.map((id_categoria) => ({ id_producto: idProducto, id_categoria }));
  const { error } = await supabase.from("Producto_Categoria").insert(filas);
  return { error: error ? "No se pudieron guardar las categorías" : null };
}

// guardar imágenes ya subidas: [{ imagen, color, es_portada }]
export async function setImagenesProducto(idProducto, imagenes) {
  if (!imagenes.length) return { data: [], error: null };
  const filas = imagenes.map(({ imagen, color, es_portada }) => ({
    id_producto: idProducto,
    imagen,
    color: color || null,
    es_portada: !!es_portada,
  }));
  const { data, error } = await supabase.from("Imagen").insert(filas).select();
  return { data: data ?? [], error };
}

// marca una imagen como portada del producto (desmarca las demás)
export async function marcarPortada(idProducto, idImagen) {
  await supabase.from("Imagen").update({ es_portada: false }).eq("id_producto", idProducto);
  const { error } = await supabase.from("Imagen").update({ es_portada: true }).eq("id_imagen", idImagen);
  return { error: error ? "No se pudo marcar la portada" : null };
}

// reasigna el color de una imagen ya subida
export async function actualizarColorImagen(idImagen, color) {
  const { error } = await supabase.from("Imagen").update({ color: color || null }).eq("id_imagen", idImagen);
  return { error: error ? "No se pudo actualizar el color de la imagen" : null };
}

// traer un producto completo para editar
export function getProductoPorId(idProducto) {
  return supabase
    .from("Producto")
    .select(`
      id_producto, id_marca, nombre, descripcion, precio, stock, estado,
      guia_talles, colores,
      Imagen ( id_imagen, imagen, color, es_portada ),
      Producto_Categoria ( id_categoria )
    `)
    .eq("id_producto", idProducto)
    .single();
}

// actualizar los datos del producto
export async function actualizarProducto(idProducto, datos) {
  const { error } = await supabase
    .from("Producto")
    .update(datos)
    .eq("id_producto", idProducto);
  return { error: error ? "No se pudo guardar el producto" : null };
}

// borrar el producto entero (y sus relaciones)
export async function borrarProducto(idProducto) {
  // primero las dependientes, después el producto
  await supabase.from("Imagen").delete().eq("id_producto", idProducto);
  await supabase.from("Producto_Categoria").delete().eq("id_producto", idProducto);
  const { error } = await supabase.from("Producto").delete().eq("id_producto", idProducto);
  return { error: error ? "No se pudo borrar el producto" : null };
}

// borrar UNA imagen (de la tabla y del bucket)
export async function borrarImagen(idImagen, urlImagen) {
  const { error } = await supabase.from("Imagen").delete().eq("id_imagen", idImagen);
  if (!error && urlImagen) {
    const nombre = urlImagen.split("/").pop(); // último segmento = nombre del archivo
    await supabase.storage.from("productos").remove([nombre]);
  }
  return { error: error ? "No se pudo borrar la imagen" : null };
}

// reemplazar categorías: borra las viejas y pone las nuevas
export async function actualizarCategoriasProducto(idProducto, idsCategorias) {
  const { error: errorDelete } = await supabase.from("Producto_Categoria").delete().eq("id_producto", idProducto);
  if (errorDelete) return { error: "No se pudieron actualizar las categorías" };
  if (idsCategorias.length) {
    const filas = idsCategorias.map((id_categoria) => ({ id_producto: idProducto, id_categoria }));
    const { error } = await supabase.from("Producto_Categoria").insert(filas);
    if (error) return { error: "No se pudieron actualizar las categorías" };
  }
  return { error: null };
}