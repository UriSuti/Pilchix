import { useMemo, useState, useEffect, useRef } from "react";
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
  const debounceRef = useRef(null);
  const DEBOUNCE_MS = 300;

  async function doSearch(texto) {
    const q = texto.trim();

    if (!q) {
      setResultadosBusqueda([]);
      return;
    }

    setError("");

    if (isValidUserId(idUsuario)) {
      const { error: errorBusqueda } = await saveBusquedaUsuario(idUsuario, q);

      if (errorBusqueda) {
        setError(errorBusqueda.message);
      }
    }

    const [productosResult, categoriasResult] = await Promise.all([
      searchLandingProductos(q),
      searchLandingCategorias(q),
    ]);

    const errores = [productosResult.error?.message, categoriasResult.error?.message].filter(Boolean);

    if (errores.length > 0) {
      setError(errores[0]);
      return;
    }

    const productosTexto = formatSearchProducts(productosResult.data ?? []);
    const productosCategoria = formatSearchCategoryProducts(categoriasResult.data ?? []);

    const unidos = mergeResultadosBusqueda(productosTexto, productosCategoria);

    const qLower = q.toLowerCase();
    const filtrados = unidos.filter((producto) => {
      const nombre = (producto.nombre || "").toLowerCase();
      const marca = (producto.marca || "").toLowerCase();
      const categoria = (producto.categoria || "").toLowerCase();

      // coincidencia exacta como substring (insensible a mayúsculas)
      return (
        nombre.includes(qLower) ||
        marca.includes(qLower) ||
        (categoria && categoria.includes(qLower))
      );
    });

    setResultadosBusqueda(filtrados);
  }

  async function buscarProductos(event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    await doSearch(textoBusqueda);
  }

  useEffect(() => {
    // debounce auto-search while typing
    clearTimeout(debounceRef.current);
    const texto = textoBusqueda.trim();

    if (!texto) {
      setResultadosBusqueda([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      doSearch(texto);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [textoBusqueda]);

  return {
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    buscarProductos,
    error,
    hasSearch,
  };
}
