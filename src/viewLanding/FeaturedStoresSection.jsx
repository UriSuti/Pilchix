import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function FeaturedStoresSection() {
  const [marcas, setMarcas] = useState([]);
  const [marcasPopulares, setMarcasPopulares] = useState([]);

  useEffect(() => {
    async function obtenerMarcas() {
      const { data: marcasData, error: errorMarcas } = await supabase
        .from("Marca")
        .select("id_marca, nombre, descripcion, logo, sitio_web, ubicacion")
        .eq("estado", 1);

      if (errorMarcas) {
        console.error("Error al traer marcas:", errorMarcas);
        return;
      }

      setMarcas(marcasData);
    }

    async function obtenerMarcasConVisualizaciones() {
      const { data: marcasMetricasData, error: errorMetricas } = await supabase
        .from("Marca")
        .select(`
          id_marca,
          nombre,
          descripcion,
          logo,
          sitio_web,
          ubicacion,
          Producto (
            id_producto,
            Metrica_Producto (
              visualizaciones
            )
          )
        `)
        .eq("estado", 1);

      if (errorMetricas) {
        console.error("Error al traer métricas de marcas:", errorMetricas);
        return;
      }

      const marcasConVisualizaciones = marcasMetricasData.map((marca) => {
        const totalVisualizaciones = marca.Producto?.reduce((total, producto) => {
          const visualizacionesProducto = producto.Metrica_Producto?.reduce(
            (subtotal, metrica) =>
              subtotal + Number(metrica.visualizaciones || 0),
            0
          );

          return total + visualizacionesProducto;
        }, 0);

        return {
          id_marca: marca.id_marca,
          nombre: marca.nombre,
          descripcion: marca.descripcion,
          logo: marca.logo,
          sitio_web: marca.sitio_web,
          ubicacion: marca.ubicacion,
          total_visualizaciones: totalVisualizaciones,
        };
      });

      marcasConVisualizaciones.sort(
        (a, b) => b.total_visualizaciones - a.total_visualizaciones
      );

      setMarcasPopulares(marcasConVisualizaciones);
    }

    obtenerMarcas();
    obtenerMarcasConVisualizaciones();
  }, []);

  return (

  );
}

export default Marcas;