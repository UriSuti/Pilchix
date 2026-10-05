import { apiFetch, apiFetchForm, tokenStore } from "../../services/api";

const tk = () => tokenStore.getAdmin();

// ventas por cobrar agrupadas por local + resumen { total, cantidadVentas, cantidadLocales }
export async function getPendientes() {
  try {
    const data = await apiFetch("/superadmin/pendientes", { token: tk() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message, status: err.status };
  }
}

export async function getLiquidaciones() {
  try {
    const data = await apiFetch("/superadmin/liquidaciones", { token: tk() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message, status: err.status };
  }
}

// marca las ventas como cobradas y guarda el comprobante
export async function liquidarVentas({ ids, comprobante, nota }) {
  try {
    const formData = new FormData();
    formData.append("comprobante", comprobante);
    formData.append("ids", JSON.stringify(ids));
    if (nota) formData.append("nota", nota);
    const data = await apiFetchForm("/superadmin/liquidaciones", { formData, token: tk() });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "No se pudo registrar el pago" };
  }
}

// URL firmada (vence a los 10 min) para ver el comprobante
export async function getUrlComprobante(idLiquidacion) {
  try {
    const { url } = await apiFetch(`/superadmin/liquidaciones/${idLiquidacion}/comprobante`, { token: tk() });
    return { url, error: null };
  } catch (err) {
    return { url: null, error: err.message };
  }
}
