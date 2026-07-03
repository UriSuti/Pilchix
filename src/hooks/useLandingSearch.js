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
  searchLandingMarcas,
  searchLandingCategoriasPorNombre,
} from "../viewLanding/services/landing";

export function useLandingSearch(idUsuario) {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [marcasBusqueda, setMarcasBusqueda] = useState([]);
  const [categoriasBusqueda, setCategoriasBusqueda] = useState([]);

  const hasSearch = useMemo(() => textoBusqueda.trim().length > 0, [textoBusqueda]);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const DEBOUNCE_MS = 300;

  async function doSearch(texto) {
    const q = texto.trim();
    if (!q) {
      setResultadosBusqueda([]);
      setMarcasBusqueda([]); // ← limpiar marcas
      setCargando(false);
      return;
    }
    const requestId = ++requestIdRef.current;
    setError("");
    setCargando(true);
    try {
      if (isValidUserId(idUsuario)) {
        const { error: errorBusqueda } = await saveBusquedaUsuario(idUsuario, q);
        if (errorBusqueda) setError(errorBusqueda.message);
      }

      const [productosResult, categoriasResult, marcasResult, categoriasNombreResult] = await Promise.all([
        searchLandingProductos(q),
        searchLandingCategorias(q),
        searchLandingMarcas(q),
        searchLandingCategoriasPorNombre(q),
      ]);

      if (requestId !== requestIdRef.current) return;

      const errores = [
        productosResult.error?.message,
        categoriasResult.error?.message,
        marcasResult.error?.message,
        categoriasNombreResult.error?.message,
      ].filter(Boolean);
      if (errores.length > 0) {
        setError(errores[0]);
        return;
      }

      // --- productos (tu lógica de siempre) ---
      const productosTexto = formatSearchProducts(productosResult.data ?? []);
      const productosCategoria = formatSearchCategoryProducts(categoriasResult.data ?? []);
      const unidos = mergeResultadosBusqueda(productosTexto, productosCategoria);

      const qLower = q.toLowerCase();
      const filtrados = unidos.filter((producto) => {
        const nombre = (producto.nombre || "").toLowerCase();
        const marca = (producto.marca || "").toLowerCase();
        const categoria = (producto.categoria || "").toLowerCase();
        return (
          nombre.includes(qLower) ||
          marca.includes(qLower) ||
          (categoria && categoria.includes(qLower))
        );
      });
      setResultadosBusqueda(filtrados);

      // --- marcas (ya vienen filtradas por nombre desde el ilike) ---
      setMarcasBusqueda(marcasResult.data ?? []);
      setCategoriasBusqueda(categoriasNombreResult.data ?? [])
    } finally {
      if (requestId === requestIdRef.current) setCargando(false);
    }
  }
  async function buscarProductos(event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    await doSearch(textoBusqueda);
  }

  useEffect(() => {
    clearTimeout(debounceRef.current);
    const texto = textoBusqueda.trim();

    if (!texto) {
      setResultadosBusqueda([]);
      setMarcasBusqueda([]);
      setCategoriasBusqueda([]);
      setCargando(false);
      return;
    }

    setCargando(true); // 👈 muestra "Buscando…" ni bien escribís, sin esperar el debounce

    debounceRef.current = setTimeout(() => {
      doSearch(texto);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [textoBusqueda]);

  return {
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    marcasBusqueda,
    categoriasBusqueda,
    cargando,
    buscarProductos,
    error,
    hasSearch,
  };
}