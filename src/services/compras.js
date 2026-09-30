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

// TEMPORAL: registra la compra con el carrito actual al hacer click en pagar,
// antes del redirect a Mercado Pago (el backend no verifica el pago).
export function registrarCompraAlPagar({ token }) {
  return apiFetch("/compras/registrar-al-pagar", { method: "POST", token });
}
