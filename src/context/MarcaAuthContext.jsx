import { createContext, useContext, useEffect, useState } from "react";
import { loginMarca, registrarMarca } from "../viewAdmin/services/authMarca";

const MarcaAuthContext = createContext(null);
const STORAGE_KEY = "pilchix_marca";

export function MarcaAuthProvider({ children }) {
    const [marca, setMarca] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        try {
            const guardado = localStorage.getItem(STORAGE_KEY);
            if (guardado) setMarca(JSON.parse(guardado));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
        setCargando(false);
    }, []);

    async function login(email, contraseña) {
        const { marca: m, error } = await loginMarca(email, contraseña);
        if (error) return { ok: false, error };
        setMarca(m);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
        return { ok: true, error: null };
    }

    async function register(datos) {
        const { error } = await registrarMarca(datos);
        if (error) return { ok: false, error };
        return { ok: true, error: null }
    }

    function logout() {
        setMarca(null);
        localStorage.removeItem(STORAGE_KEY);
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