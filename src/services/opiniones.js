import { supabase } from "../utils/supabase";

// Opiniones de un producto (más nuevas primero) con datos del usuario
export function getOpinionesProducto(idProducto) {
  return supabase
    .from("Opinion")
    .select(
      "id_opinion, texto, recomienda, fecha, id_usuario, Usuario(nombre, foto_perfil)"
    )
    .eq("id_producto", idProducto)
    .order("fecha", { ascending: false });
}

// Opiniones recientes de toda la app (para el showcase de la landing)
export function getOpinionesRecientes(limite = 4) {
  return supabase
    .from("Opinion")
    .select(
      "id_opinion, texto, recomienda, fecha, Usuario(nombre, foto_perfil), Producto(nombre, Marca(nombre))"
    )
    .order("fecha", { ascending: false })
    .limit(limite);
}

// Crea una opinión y devuelve la fila ya con el usuario embebido
export function crearOpinion({ id_producto, id_usuario, texto, recomienda }) {
  return supabase
    .from("Opinion")
    .insert({ id_producto, id_usuario, texto, recomienda })
    .select(
      "id_opinion, texto, recomienda, fecha, id_usuario, Usuario(nombre, foto_perfil)"
    )
    .single();
}

export function eliminarOpinion(idOpinion) {
  return supabase.from("Opinion").delete().eq("id_opinion", idOpinion);
}
