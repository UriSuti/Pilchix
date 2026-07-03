import { supabase } from "../../utils/supabase";

export async function loginMarca(email, contraseña) {
    const { data, error } = await supabase
        .from("Marca")
        .select("id_marca, nombre, email, logo, descripcion, sitio_web, ubicacion, estado")
        .eq("email", email)
        .eq("contraseña", contraseña)
        .maybeSingle();   // ← clave: maybeSingle en vez de single

    // 1) primero: sin fila o error → credenciales incorrectas (corta acá)
    if (error || !data) {
        return { marca: null, error: "Email o contraseña incorrectos" };
    }

    // 2) recién ahora es seguro leer data.estado
    if (data.estado !== true) {
        return { marca: null, error: "Tu marca todavía está pendiente de aprobación." };
    }

    return { marca: data, error: null };
}

export async function registrarMarca({ nombre, email, contraseña }) {
    const { error } = await supabase
        .from("Marca")
        .insert([{ nombre, email, contraseña, estado: false }])
    console.log("REGISTRO MARCA error:", error);

    if (error) {
        return {
            error: "No se pudo crear la marca. Puede que el email ya esté registrado.",
        };
    }
    return { error: null };
}