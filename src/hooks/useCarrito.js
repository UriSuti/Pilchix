import { useState, useEffect, useCallback } from "react";
import { contarPiezasCarrito } from "../viewCarrito/services/cart";

export function useCarrito(idUsuario) {
  const [cantidad, setCantidad] = useState(0);

  const refrescar = useCallback(async () => {
    if (!idUsuario) { setCantidad(0); return; }
    try {
      setCantidad(await contarPiezasCarrito());
    } catch {
      setCantidad(0);
    }
  }, [idUsuario]);

  useEffect(() => { refrescar(); }, [refrescar]);

  // se actualiza al instante cuando se agrega / edita / quita algo del carrito
  useEffect(() => {
    const onCambio = (e) => {
      const delta = e?.detail?.delta;
      // bump optimista para que el número cambie ya mismo…
      if (typeof delta === "number") setCantidad((c) => Math.max(0, c + delta));
      // …y luego reconciliamos con el valor real de la base
      refrescar();
    };
    window.addEventListener("carrito:cambio", onCambio);
    return () => window.removeEventListener("carrito:cambio", onCambio);
  }, [refrescar]);

  return { cantidad, refrescar };
}
