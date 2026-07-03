import { useState, useEffect } from "react";
import { getDashboardData } from "../services/dashboard";
import { calcularKPIs, topPorIngresos, ventasPorFecha } from "../helpers/dashboardCalc";

export function useDashboard(idMarca, dias = 30) {
  const [datos, setDatos] = useState({ kpis: null, top: [], serie: [] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!idMarca) { setCargando(false); return; }
    let activo = true;
    async function cargar() {
      setCargando(true);
      const { data, error } = await getDashboardData(idMarca, dias);
      if (!activo) return;
      const productos = error ? [] : data ?? [];
      setDatos({
        kpis: calcularKPIs(productos),
        top: topPorIngresos(productos),
        serie: ventasPorFecha(productos),
      });
      setCargando(false);
    }
    cargar();
    return () => { activo = false; };
  }, [idMarca, dias]);

  return { ...datos, cargando };
}