import { createContext, useContext, useEffect, useState } from "react";
import { loginUsuario } from "../services/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "pilchix_usuario";

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // recupera la sesión guardada al cargar la app
    useEffect(() => {
        try {
            const guardado = localStorage.getItem(STORAGE_KEY);
            if (guardado) setUsuario(JSON.parse(guardado));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
        setCargando(false);
    }, []);

    async function login(email, password) {
        const { usuario: u, error } = await loginUsuario(email, password);
        if (error) return { ok: false, error };
        setUsuario(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        return { ok: true, error: null };
    }

    function logout() {
        setUsuario(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    const value = {
        usuario,
        idUsuario: usuario?.id_usuario ?? null,
        estaLogueado: Boolean(usuario),
        cargando,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}