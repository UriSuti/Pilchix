import { apiFetch, tokenStore } from "./api";
const token = () => tokenStore.getUsuario();

export const notificacionesApi = {
  listar: () => apiFetch("/notificaciones", { token: token() }),
  contar: () => apiFetch("/notificaciones/contador", { token: token() }),
  marcarLeidas: () => apiFetch("/notificaciones/leidas", { method: "PUT", token: token() }),
};