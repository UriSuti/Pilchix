import { supabase } from "../../utils/supabase";

// fecha de hace N días en formato YYYY-MM-DD
function fechaDesde(dias) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().split("T")[0];
}

// trae productos de la marca + sus métricas dentro del rango
export function getDashboardData(idMarca, dias = 30) {
  const desde = fechaDesde(dias);
  return supabase
    .from("Producto")
    .select(`
      id_producto,
      nombre,
      precio,
      estado,
      Imagen ( imagen ),
      Metrica_Producto ( visualizaciones, clics, ventas, fecha )
    `)
    .eq("id_marca", idMarca)
    .gte("Metrica_Producto.fecha", desde);
}