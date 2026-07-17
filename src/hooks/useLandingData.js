import { useEffect, useState } from "react";
import {
  formatCategorias,
  formatDescuentos,
  formatMarcasPopulares,
  formatProductosPopulares,
  formatSuscripciones,
  isValidUserId,
} from "../viewLanding/helpers/formatters";
import {
  getLandingCategorias,
  getLandingCategoriasConProductos,
  getLandingDescuentos,
  getLandingMarcas,
  getLandingMarcasPopulares,
  getLandingProductosPopulares,
} from "../viewLanding/services/landing";
import { contarPiezasCarrito } from "../viewCarrito/services/cart";
import { getSuscripcionesUsuario } from "../viewPerfil/services/perfil";

export function useLandingData(idUsuario) {
  const [landingData, setLandingData] = useState({
    cantidadProductos: 0,
    suscripciones: [],
    categorias: [],
    marcas: [],
    marcasPopulares: [],
    productosPopulares: [],
    descuentos: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLanding() {
      setLoading(true);
      setError("");

      const fechaActual = new Date().toISOString();
      const requests = [
        getLandingCategorias(),
        getLandingCategoriasConProductos(),
        getLandingMarcas(),
        getLandingMarcasPopulares(),
        getLandingProductosPopulares(),
        getLandingDescuentos(fechaActual),
      ];

      if (isValidUserId(idUsuario)) {
        requests.push(contarPiezasCarrito(), getSuscripcionesUsuario());
      }

      const results = await Promise.allSettled(requests);

      if (!active) {
        return;
      }

      const [
        categoriasResult,
        productosCategoriasResult,
        marcasResult,
        marcasMetricasResult,
        productosResult,
        descuentosResult,
        carritoResult,
        suscripcionesResult,
      ] = results;

      const errores = results
        .map((result) => {
          if (result.status !== "fulfilled") {
            return "No se pudo completar una consulta de la landing.";
          }

          return result.value?.error?.message ?? null;
        })
        .filter(Boolean);

      setLandingData({
        cantidadProductos:
          isValidUserId(idUsuario) && carritoResult?.status === "fulfilled"
            ? (carritoResult.value ?? 0)
            : 0,
        suscripciones:
          isValidUserId(idUsuario) &&
          suscripcionesResult?.status === "fulfilled" &&
          !suscripcionesResult.value.error
            ? formatSuscripciones(suscripcionesResult.value.data)
            : [],
        categorias:
          categoriasResult?.status === "fulfilled" &&
          productosCategoriasResult?.status === "fulfilled" &&
          !categoriasResult.value.error &&
          !productosCategoriasResult.value.error
            ? formatCategorias(categoriasResult.value.data, productosCategoriasResult.value.data)
            : [],
        marcas:
          marcasResult?.status === "fulfilled" && !marcasResult.value.error
            ? marcasResult.value.data ?? []
            : [],
        marcasPopulares:
          marcasMetricasResult?.status === "fulfilled" &&
          !marcasMetricasResult.value.error
            ? formatMarcasPopulares(marcasMetricasResult.value.data)
            : [],
        productosPopulares:
          productosResult?.status === "fulfilled" && !productosResult.value.error
            ? formatProductosPopulares(productosResult.value.data)
            : [],
        descuentos:
          descuentosResult?.status === "fulfilled" && !descuentosResult.value.error
            ? formatDescuentos(descuentosResult.value.data)
            : [],
      });

      if (errores.length > 0) {
        setError(errores[0]);
      }

      setLoading(false);
    }

    loadLanding();

    return () => {
      active = false;
    };
  }, [idUsuario]);

  return { landingData, loading, error };
}
