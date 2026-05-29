import { supabase } from "../utils/supabase";

export async function getImagenesProducto(id_producto) {
    const { data, error } = await supabase
        .from('Imagen')
        .select('imagen')
        .eq('id_producto', id_producto)
        .single();

    if (error) {
        console.error('Error al traer las imágenes:', error.message);
        return [];
    }

    return data.map((fila) => fila.imagen);
}

export async function getImagenMarca(id_marca) {
    const { data, error } = await supabase
        .from('Marca')
        .select('imagen_fachada')
        .eq('id_marca', id_marca);
    
    if (error) {
        console.error('Error al traer la imagen:', error.message);
        return null;
    }

    return data?.imagen_fachada ?? null;
}