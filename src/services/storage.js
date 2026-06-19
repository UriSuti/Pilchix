import { supabase } from "../utils/supabase";

export async function subirFotoPerfil(idUsuario, archivo) {
    const extension = archivo.name.split(".").pop();
    const nombreArchivo = `${idUsuario}-${Date.now()}.${extension}`;

    const { error: errorUpload } = await supabase.storage
        .from("fotos-perfil")
        .upload(nombreArchivo, archivo, { upsert: true });

    if (errorUpload) {
        return { url: null, error: "No se pudo subir la imagen" };
    }

    const { data } = supabase.storage
        .from("fotos-perfil")
        .getPublicUrl(nombreArchivo);

    return { url: data.publicUrl, error: null };
}