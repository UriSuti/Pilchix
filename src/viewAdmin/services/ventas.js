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
