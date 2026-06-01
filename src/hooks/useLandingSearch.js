import { useMemo, useState } from "react";
import {
  formatSearchCategoryProducts,
  formatSearchProducts,
  isValidUserId,
  mergeResultadosBusqueda,
} from "../viewLanding/helpers/formatters";
import {
  saveBusquedaUsuario,
  searchLandingCategorias,
  searchLandingProductos,
} from "../viewLanding/services/landing";

export function useLandingSearch(idUsuario) {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [error, setError] = useState("");

  const hasSearch = useMemo(() => textoBusqueda.trim().length > 0, [textoBusqueda]);

  async function buscarProductos(event) {
    event.preventDefault();

    const texto = textoBusqueda.trim();

    if (!texto) {
      setResultadosBusqueda([]);
      return;
    }

    setError("");

    if (isValidUserId(idUsuario)) {
      const { error: errorBusqueda } = await saveBusquedaUsuario(idUsuario, texto);

      if (errorBusqueda) {
        setError(errorBusqueda.message);
      }
    }

    const [productosResult, categoriasResult] = await Promise.all([
      searchLandingProductos(texto),
      searchLandingCategorias(texto),
    ]);

    const errores = [productosResult.error?.message, categoriasResult.error?.message].filter(
      Boolean
    );

    if (errores.length > 0) {
      setError(errores[0]);
      return;
    }

    const productosTexto = formatSearchProducts(productosResult.data ?? []);
    const productosCategoria = formatSearchCategoryProducts(categoriasResult.data ?? []);

    setResultadosBusqueda(mergeResultadosBusqueda(productosTexto, productosCategoria));
  }

  return {
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    buscarProductos,
    error,
    hasSearch,
  };
}
