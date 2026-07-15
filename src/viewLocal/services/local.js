import { apiFetch } from "../../services/api";

async function apiFetchAsQuery(path) {
  try {
    const data = await apiFetch(path);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export function getLocalProductos(idMarca) {
  return apiFetchAsQuery(`/locales/${idMarca}/productos`);
}

export function getLocalMarca(idMarca) {
  return apiFetchAsQuery(`/locales/${idMarca}/fachada`);
}
