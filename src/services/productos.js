import { supabase } from "../utils/supabase";

export async function getProductosByMarca(idMarca) {
  const { data, error } = await supabase
    .from("Producto")
    .select("*, Imagen(*)")
    .eq("id_marca", idMarca);

  if (error) {
    throw error;
  }

  return data ?? [];
}
