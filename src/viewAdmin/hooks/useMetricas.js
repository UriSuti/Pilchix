import { useEffect, useState } from "react";
import { getMetricas } from "../services/dashboard";

export function useMetricas(dias) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    getMetricas(dias)
      .then((d) => { if (activo) { setData(d); setError(null); } })
      .catch((e) => { if (activo) setError(e.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [dias]);

  return { data, cargando, error };
}