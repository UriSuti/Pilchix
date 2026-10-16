import { apiFetch, tokenStore } from "../../services/api";

function token() {
  return tokenStore.getUsuario();
}

// devuelve las preferencias guardadas o null si es la primera vez
export async function getPreferencias() {
  const { preferencias } = await apiFetch("/stylist/preferencias", { token: token() });
  return preferencias ?? null;
}

export async function guardarPreferencias(preferencias) {
  const { preferencias: guardadas } = await apiFetch("/stylist/preferencias", {
    method: "PUT",
    body: preferencias,
    token: token(),
  });
  return guardadas;
}

// devuelve { mensaje, outfits: [{ tipo, titulo, explicacion, prendas, total, supera_presupuesto }] }
export function generarOutfits({ preferencias, pedido, prendasPropias }) {
  return apiFetch("/stylist/outfits", {
    method: "POST",
    body: { preferencias, pedido, prendasPropias },
    token: token(),
  });
}

// devuelve { reemplazo: prenda | null, motivo, explicacion? }
export function cambiarPrenda({ preferencias, outfit, idProducto, pedido }) {
  return apiFetch("/stylist/outfits/cambiar-prenda", {
    method: "POST",
    body: { preferencias, outfit, idProducto, pedido },
    token: token(),
  });
}
