import { supabase } from "../../utils/supabase";

/* ---------- SUSCRIPCIONES ---------- */
export function getSuscripcionesUsuario(idUsuario) {
  return supabase
    .from("Suscripcion")
    .select(`id_suscripcion, id_marca, fecha_inicio, Marca ( nombre, logo )`)
    .eq("id_usuario", idUsuario);
}

export function getSuscripcion(idUsuario, idMarca) {
  return supabase
    .from("Suscripcion")
    .select("id_suscripcion")
    .eq("id_usuario", idUsuario)
    .eq("id_marca", idMarca)
    .maybeSingle();
}

export function agregarSuscripcion(idUsuario, idMarca) {
  return supabase.from("Suscripcion").insert([
    { id_usuario: idUsuario, id_marca: idMarca, fecha_inicio: new Date().toISOString().split("T")[0] },
  ]);
}

export function quitarSuscripcion(idUsuario, idMarca) {
  return supabase
    .from("Suscripcion")
    .delete()
    .eq("id_usuario", idUsuario)
    .eq("id_marca", idMarca);
}

/* ---------- FAVORITOS ---------- */
export function getFavoritosUsuario(idUsuario) {
  return supabase
    .from("Favorito")
    .select(`
      id_favorito,
      id_producto,
      Producto (
        nombre,
        precio,
        id_marca,
        Marca ( nombre ),
        Imagen ( imagen, es_portada )
      )
    `)
    .eq("id_usuario", idUsuario);
}

export function getFavorito(idUsuario, idProducto) {
  return supabase
    .from("Favorito")
    .select("id_favorito")
    .eq("id_usuario", idUsuario)
    .eq("id_producto", idProducto)
    .maybeSingle();
}

export function agregarFavorito(idUsuario, idProducto) {
  return supabase.from("Favorito").insert([{ id_usuario: idUsuario, id_producto: idProducto }]);
}

export function quitarFavorito(idUsuario, idProducto) {
  return supabase
    .from("Favorito")
    .delete()
    .eq("id_usuario", idUsuario)
    .eq("id_producto", idProducto);
}