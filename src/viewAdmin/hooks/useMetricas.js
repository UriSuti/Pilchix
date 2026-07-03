import { useState, useEffect } from "react";
import { getMetricasData } from "../services/dashboard";
import { serieTemporal, ventasPorCategoria, tablaProductos } from "../helpers/dashboardCalc";

export function useMetricas(idMarca, dias) {
  const [datos, setDatos] = useState({ serie: [], categorias: [], tabla: [] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!idMarca) { setCargando(false); return; }
    let activo = true;
    async function cargar() {
      setCargando(true);
      const { data, error } = await getMetricasData(idMarca, dias);
      if (!activo) return;
      const productos = error ? [] : data ?? [];
      setDatos({
        serie: serieTemporal(productos),
        categorias: ventasPorCategoria(productos),
        tabla: tablaProductos(productos),
      });
      setCargando(false);
    }
    cargar();
    return () => { activo = false; };
  }, [idMarca, dias]);

  return { ...datos, cargando };
}