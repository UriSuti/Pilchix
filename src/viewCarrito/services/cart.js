import { apiFetch, tokenStore } from "../../services/api";

function token() {
  return tokenStore.getUsuario();
}

// Avisa al resto de la app (ej: el badge del header) que el carrito cambió.
// delta = piezas sumadas/restadas (para el bump instantáneo); omitir si no se sabe.
function notificarCambioCarrito(delta) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("carrito:cambio", { detail: { delta } }));
}

export async function agregarAlCarrito({ idProducto, cantidad = 1, precioUnitario, talle, color }) {
  await apiFetch("/carrito/items", {
    method: "POST",
    body: { idProducto, cantidad, precioUnitario, talle, color },
    token: token(),
  });
  notificarCambioCarrito(cantidad);
}

export function obtenerItemsCarrito() {
  return apiFetch("/carrito", { token: token() });
}

export async function contarPiezasCarrito() {
  const { cantidad } = await apiFetch("/carrito/resumen", { token: token() });
  return cantidad;
}

export async function actualizarCantidadItem(idDetalle, cantidad) {
  await apiFetch(`/carrito/items/${idDetalle}`, {
    method: "PUT",
    body: { cantidad },
    token: token(),
  });
  notificarCambioCarrito();
}

export async function eliminarItemCarrito(idDetalle) {
  await apiFetch(`/carrito/items/${idDetalle}`, { method: "DELETE", token: token() });
  notificarCambioCarrito();
}
