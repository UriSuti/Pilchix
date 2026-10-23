import { apiFetch, tokenStore } from "../../services/api";

const auth = () => ({ token: tokenStore.getMarca() });

export const importacionApi = {
  listar: (url) =>
    apiFetch("/importacion/tiendanube/listar", { method: "POST", body: { url }, ...auth() }),

  // sin idCategoria el backend la adivina (o devuelve estado "revisar").
  // categorias = las de la tienda donde aparece el producto (las devolvió listar), como pista.
  importar: (url, idCategoria, categorias = []) =>
    apiFetch("/importacion/tiendanube/producto", {
      method: "POST",
      body: { url, categorias, ...(idCategoria ? { idCategoria } : {}) },
      ...auth(),
    }),
};
