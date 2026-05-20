import './OffersSection.css';
import { useEffect, useState } from "react";
import {supabase} from "../../utils/supabase";
function OffersSection() {
  const [descuentos, setDescuentos] = useState([]);

  useEffect(() => {
    async function obtenerDescuentosActivos() {
      const fechaActual = new Date().toISOString();

      const { data, error } = await supabase
        .from("Descuento")
        .select(`
          id_descuento,
          porcentaje,
          precio_anterior,
          precio_final,
          fecha_inicio,
          fecha_fin,
          Producto (
            id_producto,
            nombre,
            descripcion,
            precio,
            estado,
            Marca (
              nombre
            ),
            Imagen (
              imagen
            )
          )
        `)
        .lte("fecha_inicio", fechaActual)
        .gte("fecha_fin", fechaActual)
        .eq("Producto.estado", 1);

      if (error) {
        console.error("Error al traer descuentos activos:", error);
        return;
      }

      const descuentosFormateados = data.map((descuento) => ({
        id_descuento: descuento.id_descuento,
        porcentaje: descuento.porcentaje,
        precio_anterior: descuento.precio_anterior,
        precio_final: descuento.precio_final,
        fecha_inicio: descuento.fecha_inicio,
        fecha_fin: descuento.fecha_fin,
        id_producto: descuento.Producto?.id_producto,
        producto: descuento.Producto?.nombre,
        descripcion: descuento.Producto?.descripcion,
        precio: descuento.Producto?.precio,
        imagen: descuento.Producto?.Imagen?.[0]?.imagen || null,
        marca: descuento.Producto?.Marca?.nombre,
      }));

      setDescuentos(descuentosFormateados);
    }

    obtenerDescuentosActivos();
  }, []);

  return (
    <>
    </>
  );
}

export default OffersSection;