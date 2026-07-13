import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/auth";
import { tokenStore } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "pilchix_usuario";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      const token = tokenStore.getUsuario();
      if (guardado && token) setUsuario(JSON.parse(guardado));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      tokenStore.clearUsuario();
    }
    setCargando(false);
  }, []);

  function guardarSesion(usuario, token) {
    setUsuario(usuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    tokenStore.setUsuario(token);
  }

  async function login(email, password) {
    try {
      const { usuario, token } = await authApi.loginUsuario(email, password);
      guardarSesion(usuario, token);
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function register({ nombre, email, contraseña }) {
    try {
      const { usuario, token } = await authApi.registrarUsuario(nombre, email, contraseña);
      guardarSesion(usuario, token);
      return { ok: true, error: null, usuario };
    } catch (err) {
      return { ok: false, error: err.message, usuario: null };
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
    tokenStore.clearUsuario();
  }

  function actualizarUsuarioLocal(usuarioActualizado) {
    setUsuario(usuarioActualizado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioActualizado));
  }

  const value = {
    usuario,
    idUsuario: usuario?.id_usuario ?? null,
    estaLogueado: Boolean(usuario),
    cargando,
    login,
    register,
    logout,
    actualizarUsuarioLocal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}