import { createContext, useContext, useState } from "react";
import { authApi } from "../services/auth";
import { tokenStore } from "../services/api";

// sesión del admin de Pilchix (panel /superadmin), separada de usuario y marca
const AdminAuthContext = createContext(null);
const STORAGE_KEY = "pilchix_admin";

function leerSesionGuardada() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado && tokenStore.getAdmin() ? JSON.parse(guardado) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    tokenStore.clearAdmin();
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  // la sesión se lee sincrónicamente de localStorage, así que nunca hay estado "cargando"
  const [admin, setAdmin] = useState(leerSesionGuardada);
  const cargando = false;

  async function login(email, contraseña) {
    try {
      const { admin, token } = await authApi.loginAdmin(email, contraseña);
      setAdmin(admin);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
      tokenStore.setAdmin(token);
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
    tokenStore.clearAdmin();
  }

  const value = { admin, estaLogueado: Boolean(admin), cargando, login, logout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth debe usarse dentro de <AdminAuthProvider>");
  return ctx;
}
