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
      Imagen ( imagen )
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
  return { error };
}

// guardar URLs de imágenes ya subidas
export async function setImagenesProducto(idProducto, urls) {
  if (!urls.length) return { error: null };
  const filas = urls.map((imagen) => ({ id_producto: idProducto, imagen }));
  const { error } = await supabase.from("Imagen").insert(filas);
  return { error };
}

// traer un producto completo para editar
export function getProductoPorId(idProducto, idMarca) {
  return supabase
    .from("Producto")
    .select(`
      id_producto, id_marca, nombre, descripcion, precio, stock, estado,
      guia_talles, colores,
      Imagen ( id_imagen, imagen ),
      Producto_Categoria ( id_categoria )
    `)
    .eq("id_producto", idProducto)
    .eq("id_marca", idMarca)   // ← solo si el producto es de esta marca
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
  await supabase.from("Producto_Categoria").delete().eq("id_producto", idProducto);
  if (idsCategorias.length) {
    const filas = idsCategorias.map((id_categoria) => ({ id_producto: idProducto, id_categoria }));
    await supabase.from("Producto_Categoria").insert(filas);
  }
}