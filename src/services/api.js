const API_URL = "http://localhost:3000/api";

const TOKEN_KEY = "pilchix_token";
const TOKEN_MARCA_KEY = "pilchix_token_marca";

export const tokenStore = {
  getUsuario: () => localStorage.getItem(TOKEN_KEY),
  setUsuario: (t) => localStorage.setItem(TOKEN_KEY, t),
  clearUsuario: () => localStorage.removeItem(TOKEN_KEY),
  getMarca: () => localStorage.getItem(TOKEN_MARCA_KEY),
  setMarca: (t) => localStorage.setItem(TOKEN_MARCA_KEY, t),
  clearMarca: () => localStorage.removeItem(TOKEN_MARCA_KEY),
};

/**
 * Hace una request a la API.
 * @param {string} path - ej: "/auth/usuario/login"
 * @param {object} options - { method, body, token }
 */
export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // el backend devuelve { error: "mensaje" }
    const err = new Error(data.error || "Error de conexión");
    err.status = res.status;
    throw err;
  }

  return data;
}

/**
 * Igual que apiFetch pero para enviar archivos (FormData).
 * No fija Content-Type: el browser le agrega el boundary del multipart.
 * @param {string} path - ej: "/catalogo/productos/5/imagenes"
 * @param {object} options - { method, formData, token }
 */
export async function apiFetchForm(path, { method = "POST", formData, token } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method, headers, body: formData });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || "Error de conexión");
    err.status = res.status;
    throw err;
  }

  return data;
}