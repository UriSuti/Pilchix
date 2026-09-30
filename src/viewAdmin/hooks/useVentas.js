import { useState, useEffect } from "react";
import { getVentas } from "../services/ventas";

const RESUMEN_VACIO = { cobrado: 0, porCobrar: 0, cantidadVentas: 0 };

export function useVentas() {
  const [datos, setDatos] = useState({ resumen: RESUMEN_VACIO, ventas: [] });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    getVentas().then(({ data, error }) => {
      if (!activo) return;
      if (error) setError(error);
      else setDatos({ resumen: data.resumen ?? RESUMEN_VACIO, ventas: data.ventas ?? [] });
      setCargando(false);
    });
    return () => { activo = false; };
  }, []);

  return { ...datos, error, cargando };
}
