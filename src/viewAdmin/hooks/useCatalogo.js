import { useState, useEffect, useCallback } from "react";
import { getProductosDeMarca } from "../services/catalogo";

export function useCatalogo(idMarca) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    if (!idMarca) { setProductos([]); setCargando(false); return; }
    setCargando(true);
    const { data, error } = await getProductosDeMarca(idMarca);
    setProductos(error ? [] : data ?? []);
    setCargando(false);
  }, [idMarca]);

  useEffect(() => { refrescar(); }, [refrescar]);

  return { productos, cargando, refrescar };
}