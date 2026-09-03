import { useState, useEffect, useCallback } from "react";
import { notificacionesApi } from "../services/notificaciones";
import { useAuth } from "../context/AuthContext";

export function useNotificaciones() {
  const { estaLogueado } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);

  const refrescarContador = useCallback(async () => {
    if (!estaLogueado) { setNoLeidas(0); return; }
    try {
      const { noLeidas } = await notificacionesApi.contar();
      setNoLeidas(noLeidas);
    } catch { setNoLeidas(0); }
  }, [estaLogueado]);

  const cargarLista = useCallback(async () => {
    if (!estaLogueado) return;
    try {
      const data = await notificacionesApi.listar();
      setNotificaciones(data ?? []);
    } catch { setNotificaciones([]); }
  }, [estaLogueado]);

  const marcarLeidas = useCallback(async () => {
    try {
      await notificacionesApi.marcarLeidas();
      setNoLeidas(0);
    } catch { /* noop */ }
  }, []);

  useEffect(() => { refrescarContador(); }, [refrescarContador]);

  return { notificaciones, noLeidas, cargarLista, marcarLeidas, refrescarContador };
}