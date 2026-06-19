import { useState, useEffect, useCallback } from "react";
import { getFavoritosUsuario } from "../services/perfil";

export function useFavoritos(idUsuario) {
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const refrescar = useCallback(async () => {
        if (!idUsuario) { setFavoritos([]); setCargando(false); return; }
        setCargando(true);
        const { data, error } = await getFavoritosUsuario(idUsuario);
        setFavoritos(error ? [] : data ?? []);
        setCargando(false);
    }, [idUsuario]);

    useEffect(() => { refrescar(); }, [refrescar]);

    return { favoritos, cargando, refrescar };
}