import { apiFetch } from "./api";
import { supabase } from "../utils/supabase";   // ← sigue haciendo falta por ahora

export const authApi = {
  registrarUsuario: (nombre, email, password) =>
    apiFetch("/auth/usuario/registro", {
      method: "POST",
      body: { nombre, email, password },
    }),

  loginUsuario: (email, password) =>
    apiFetch("/auth/usuario/login", {
      method: "POST",
      body: { email, password },
    }),

  registrarMarca: (nombre, email, password) =>
    apiFetch("/auth/marca/registro", {
      method: "POST",
      body: { nombre, email, password },
    }),

  loginMarca: (email, password) =>
    apiFetch("/auth/marca/login", {
      method: "POST",
      body: { email, password },
    }),
};

/* ------------------------------------------------------------------
   TODO: migrar al backend en la etapa de "perfil de usuario".
   Por ahora siguen hablando con Supabase directo.
------------------------------------------------------------------- */

export async function actualizarFotoPerfil(idUsuario, url) {
  const { data, error } = await supabase
    .from("Usuario")
    .update({ foto_perfil: url })
    .eq("id_usuario", idUsuario)
    .select()
    .single();

  if (error) return { usuario: null, error: "No se pudo guardar la foto de perfil" };
  return { usuario: data, error: null };
}

export async function actualizarDatosUsuario(idUsuario, datos) {
  const { data, error } = await supabase
    .from("Usuario")
    .update(datos)
    .eq("id_usuario", idUsuario)
    .select()
    .single();

  if (error) return { usuario: null, error: "No se pudieron guardar los cambios" };
  return { usuario: data, error: null };
}