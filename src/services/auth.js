import { supabase } from "../utils/supabase"; // 👈 misma ruta que usan tus services actuales

export async function loginUsuario(email, password) {
    const { data, error } = await supabase
        .from("Usuario")
        .select("id_usuario, nombre, email")
        .eq("email", email)
        .eq("contraseña", password)
        .maybeSingle();

    if (error) return { usuario: null, error: error.message };
    if (!data) return { usuario: null, error: "Email o contraseña incorrectos" };
    return { usuario: data, error: null };
}