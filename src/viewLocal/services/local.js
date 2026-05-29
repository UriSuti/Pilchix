import { supabase } from "../../utils/supabase";

export function getLocalProductos(idMarca) {
  return supabase
    .from("Producto")
    .select("*, Imagen(*)")
    .eq("id_marca", idMarca);
}

export function getLocalMarca(idMarca) {
  return supabase
    .from("Marca")
    .select("imagen_fachada")
    .eq("id_marca", idMarca);
}
