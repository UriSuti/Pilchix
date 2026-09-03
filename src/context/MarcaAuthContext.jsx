import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/auth";
import { tokenStore } from "../services/api";

const MarcaAuthContext = createContext(null);
const STORAGE_KEY = "pilchix_marca";

export function MarcaAuthProvider({ children }) {
  const [marca, setMarca] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      const token = tokenStore.getMarca();
      if (guardado && token) setMarca(JSON.parse(guardado));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      tokenStore.clearMarca();
    }
    setCargando(false);
  }, []);

  async function login(email, contraseña) {
    try {
      const { marca, token } = await authApi.loginMarca(email, contraseña);
      setMarca(marca);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(marca));
      tokenStore.setMarca(token);
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function register({ nombre, email, contraseña, descripcion, ubicacion }) {
    try {
      const { marca, token } = await authApi.registrarMarca(nombre, email, contraseña, {
        descripcion,
        ubicacion,
      });
      // el local queda activo → logueamos directo
      setMarca(marca);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(marca));
      tokenStore.setMarca(token);
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    setMarca(null);
    localStorage.removeItem(STORAGE_KEY);
    tokenStore.clearMarca();
  }

  function actualizarMarcaLocal(marcaActualizada) {
    setMarca(marcaActualizada);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marcaActualizada));
  }

  const value = {
    marca,
    idMarca: marca?.id_marca ?? null,
    estaLogueada: Boolean(marca),
    cargando,
    login,
    register,
    logout,
    actualizarMarcaLocal,
  };

  return <MarcaAuthContext.Provider value={value}>{children}</MarcaAuthContext.Provider>;
}

export function useMarcaAuth() {
  const ctx = useContext(MarcaAuthContext);
  if (!ctx) throw new Error("useMarcaAuth debe usarse dentro de <MarcaAuthProvider>");
  return ctx;
}