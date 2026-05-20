import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function Header({ id_usuario }) {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [suscripciones, setSuscripciones] = useState([]);

  useEffect(() => {
    async function obtenerCantidadProductos() {
      const { data: carritoData, error: errorCarrito } = await supabase
        .from("Carrito")
        .select(`
          id_carrito,
          Carrito_Detalle (
            id_detalle
          )
        `)
        .eq("id_usuario", id_usuario);

      if (errorCarrito) {
        console.error("Error al traer carrito:", errorCarrito);
        return;
      }

      const cantidad = carritoData.reduce((total, carrito) => {
        return total + (carrito.Carrito_Detalle?.length || 0);
      }, 0);

      setCantidadProductos(cantidad);
    }

    async function obtenerSuscripciones() {
      const { data: suscripcionesData, error: errorSuscripciones } =
        await supabase
          .from("Suscripcion")
          .select(`
            id_suscripcion,
            id_marca,
            fecha_inicio,
            Marca (
              nombre
            )
          `)
          .eq("id_usuario", id_usuario);

      if (errorSuscripciones) {
        console.error("Error al traer suscripciones:", errorSuscripciones);
        return;
      }

      const suscripcionesFormateadas = suscripcionesData.map((suscripcion) => ({
        id_suscripcion: suscripcion.id_suscripcion,
        id_marca: suscripcion.id_marca,
        fecha_inicio: suscripcion.fecha_inicio,
        marca: suscripcion.Marca?.nombre,
      }));

      setSuscripciones(suscripcionesFormateadas);
    }

    obtenerCantidadProductos();
    obtenerSuscripciones();
  }, [id_usuario]);

  return (
    
  );
}

export default UsuarioResumen;