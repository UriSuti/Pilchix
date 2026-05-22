import { supabase } from "../utils/supabase";

export async function getLocalById(idLocal) {
  const { data, error } = await supabase
    .from("Marca")
    .select("id_marca, nombre, descripcion, imagen_fachada, ubicacion")
    .eq("id_marca", idLocal)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
