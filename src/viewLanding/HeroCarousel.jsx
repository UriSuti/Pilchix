import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function HeroCarousel() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function obtenerProductosPopulares() {
      const { data, error } = await supabase
        .from("Producto")
        .select(`
          id_producto,
          nombre,
          descripcion,
          precio,
          estado,
          Imagen (
            imagen
          ),
          Metrica_Producto (
            visualizaciones
          )
        `)
        .eq("estado", 1);

      if (error) {
        console.error("Error al traer productos populares:", error);
        return;
      }

      const productosPopulares = data
        .map((producto) => ({
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: producto.Imagen?.[0]?.imagen,
          visualizaciones: producto.Metrica_Producto?.[0]?.visualizaciones || 0,
        }))
        .sort((a, b) => b.visualizaciones - a.visualizaciones)
        .slice(0, 5);

      setProductos(productosPopulares);
    }

    obtenerProductosPopulares();
  }, []);

  return (
    
  );
}

export default HeroCarousel;