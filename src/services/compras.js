import { apiFetch } from "./api";

// Registra la compra a partir del carrito actual del usuario y lo vacía.
// Se llama cuando Mercado Pago redirige de vuelta con pago=aprobado.
export function confirmarCompra({ idPagoMp, token }) {
  return apiFetch("/compras/confirmar", {
    method: "POST",
    body: { idPagoMp },
    token,
  });
}
