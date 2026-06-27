import { supabase } from "../../utils/supabase";

// Todas las categorías (para la ruleta/coverflow)
export function getCategorias() {
  return supabase
    .from("Categoria")
    .select("id_categoria, nombre")
    .order("nombre", { ascending: true });
}

// Productos de TODAS las categorías, con su marca (logo) e imagen.
// Se agrupan por categoría en el hook. Solo productos activos.
export function getCategoriaProductos() {
  return supabase
    .from("Producto_Categoria")
    .select(
      `
      id_categoria,
      Producto (
        id_producto,
        nombre,
        descripcion,
        precio,
        estado,
        guia_talles,
        Imagen ( imagen ),
        Marca ( id_marca, nombre, logo )
      )
    `
    )
    .eq("Producto.estado", 1);
}
