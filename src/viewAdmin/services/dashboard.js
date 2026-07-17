import { apiFetch, tokenStore } from "../../services/api";

function token() {
  return tokenStore.getMarca();
}

async function comoQuery(promesa) {
  try {
    return { data: await promesa, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// trae productos de la marca + sus métricas dentro del rango
export function getDashboardData(idMarca, dias = 30) {
  return comoQuery(apiFetch(`/catalogo/dashboard?dias=${dias}`, { token: token() }));
}

// productos de la marca con métricas del rango + sus categorías
export function getMetricasData(idMarca, dias = 30) {
  return comoQuery(apiFetch(`/catalogo/metricas?dias=${dias}`, { token: token() }));
}
