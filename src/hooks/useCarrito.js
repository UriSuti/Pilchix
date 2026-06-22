import { useState, useEffect, useCallback } from "react";
import { getLandingCarrito } from "../viewLanding/services/landing";

export function useCarrito(idUsuario) {
  const [cantidad, setCantidad] = useState(0);

  const refrescar = useCallback(async () => {
    console.log("CARRITO idUsuario:", idUsuario);
    if (!idUsuario) { setCantidad(0); return; }
    const { data, error } = await getLandingCarrito(idUsuario);
    console.log("CARRITO data:", { data, error });
    if (error || !data) { setCantidad(0); return; }
    const total = data.reduce(
      (acc, carrito) => acc + (carrito.Carrito_Detalle?.length || 0),
      0
    );
    setCantidad(total);
  }, [idUsuario]);

  useEffect(() => { refrescar(); }, [refrescar]);

  return { cantidad, refrescar };
}