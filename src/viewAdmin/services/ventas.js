import { apiFetch, tokenStore } from "../../services/api";

// ventas de la marca + resumen de cashflow { cobrado, porCobrar, cantidadVentas }
export async function getVentas() {
  try {
    const data = await apiFetch("/ventas", { token: tokenStore.getMarca() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// URL firmada (vence a los 10 min) del comprobante del pago que recibió la marca
export async function getUrlComprobante(idLiquidacion) {
  try {
    const { url } = await apiFetch(`/ventas/liquidaciones/${idLiquidacion}/comprobante`, {
      token: tokenStore.getMarca(),
    });
    return { url, error: null };
  } catch (err) {
    return { url: null, error: err.message };
  }
}
