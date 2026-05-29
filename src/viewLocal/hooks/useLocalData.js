import { useEffect, useState } from "react";
import { getLocalProductos, getLocalMarca } from "../services/local";

export function useLocalData(idMarca) {
  const [localData, setLocalData] = useState({
    productos: [],
    imagenFachada: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLocal() {
      setLoading(true);
      setError("");

      const [productosResult, marcaResult] = await Promise.allSettled([
        getLocalProductos(idMarca),
        getLocalMarca(idMarca),
      ]);

      if (!active) {
        return;
      }

      const productosData =
        productosResult.status === "fulfilled" ? productosResult.value.data : [];
      const productosError =
        productosResult.status === "fulfilled" ? productosResult.value.error : null;

      const marcaData = marcaResult.status === "fulfilled" ? marcaResult.value.data : [];
      const marcaError =
        marcaResult.status === "fulfilled" ? marcaResult.value.error : null;

      if (productosError) {
        setError(productosError.message);
      }

      if (marcaError) {
        setError(marcaError.message);
      }

      const imagenFachada = marcaData && marcaData.length > 0 ? marcaData[0].imagen_fachada : null;

      setLocalData({
        productos: productosData || [],
        imagenFachada,
      });
      setLoading(false);
    }

    if (idMarca) {
      loadLocal();
    }

    return () => {
      active = false;
    };
  }, [idMarca]);

  return {
    productos: localData.productos,
    imagenFachada: localData.imagenFachada,
    loading,
    error,
  };
}
