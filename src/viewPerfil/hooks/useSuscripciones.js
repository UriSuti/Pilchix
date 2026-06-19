import { useState, useEffect, useCallback } from "react";
import { getSuscripcionesUsuario } from "../services/perfil";

export function useSuscripciones(idUsuario) {
    const [suscripciones, setSuscripciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const refrescar = useCallback(async () => {
        if (!idUsuario) { setSuscripciones([]); setCargando(false); return; }
        setCargando(true);
        const { data, error } = await getSuscripcionesUsuario(idUsuario);
        setSuscripciones(error ? [] : data ?? []);
        setCargando(false);
    }, [idUsuario]);

    useEffect(() => { refrescar(); }, [refrescar]);

    return { suscripciones, cargando, refrescar };
    }