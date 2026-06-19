import { supabase } from "../utils/supabase";

export async function loginUsuario(email, password) {
    const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("email", email)
        .eq("contraseña", password)
        .maybeSingle();

    if (error) return { usuario: null, error: error.message };
    if (!data) return { usuario: null, error: "Email o contraseña incorrectos" };
    return { usuario: data, error: null };
}

export async function registrarUsuario({ nombre, email, contraseña, foto_perfil }) {
    const { data, error } = await supabase
        .from("Usuario")
        .insert([{ nombre, email, contraseña, foto_perfil: foto_perfil ?? null }])
        .select()
        .single();

    if (error) {
        return {
        usuario: null,
        error: "No se pudo crear la cuenta. Puede que el email ya esté registrado.",
        };
    }
    return { usuario: data, error: null };
}

export async function actualizarFotoPerfil(idUsuario, url) {
    const { data, error } = await supabase
        .from("Usuario")
        .update({ foto_perfil: url })
        .eq("id_usuario", idUsuario)
        .select()
        .single();

    if (error) {
        return { usuario: null, error: "No se pudo guardar la foto de perfil" };
    }
    return { usuario: data, error: null };
}

export async function actualizarDatosUsuario(idUsuario, datos) {
    const { data, error } = await supabase
        .from("Usuario")
        .update(datos)
        .eq("id_usuario", idUsuario)
        .select()
        .single();

    if (error) {
        return { usuario: null, error: "No se pudieron guardar los cambios" };
    }
    return { usuario: data, error: null };
}