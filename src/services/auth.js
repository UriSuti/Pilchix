import { apiFetch } from "./api";

export const authApi = {
  registrarUsuario: (nombre, email, password) =>
    apiFetch("/auth/usuario/registro", {
      method: "POST",
      body: { nombre, email, password },
    }),

  loginUsuario: (email, password) =>
    apiFetch("/auth/usuario/login", {
      method: "POST",
      body: { email, password },
    }),

  registrarMarca: (nombre, email, password, extra = {}) =>
    apiFetch("/auth/marca/registro", {
      method: "POST",
      body: { nombre, email, password, ...extra },
    }),

  loginMarca: (email, password) =>
    apiFetch("/auth/marca/login", {
      method: "POST",
      body: { email, password },
    }),
};