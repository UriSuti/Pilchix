import { useEffect, useState } from "react";
import {supabase} from "../../utils/supabase";
import './CategorySection.css';

function CategorySection() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function obtenerCategorias() {
      const { data: categoriasData, error: errorCategorias } = await supabase
        .from("Categoria")
        .select("id_categoria, nombre")
        .order("nombre", { ascending: true });

      if (errorCategorias) {
        console.error("Error al traer categorías:", errorCategorias);
        return;
      }

      const { data: productosCategoriasData, error: errorProductosCategorias } = await supabase
        .from("Producto_Categoria")
        .select(`
          id_categoria,
          Producto (
            id_producto,
            estado,
            Imagen (
              imagen
            )
          )
        `)
        .eq("Producto.estado", 1);

      if (errorProductosCategorias) {
        console.error("Error al traer productos por categoría:", errorProductosCategorias);
        return;
      }

      const categoriasConImagen = categoriasData.map((categoria) => {
        const relacion = productosCategoriasData.find(
          (item) =>
            item.id_categoria === categoria.id_categoria &&
            item.Producto !== null &&
            item.Producto.Imagen?.length > 0
        );

        return {
          ...categoria,
          imagen_categoria: relacion?.Producto?.Imagen?.[0]?.imagen || null,
        };
      });

      setCategorias(categoriasConImagen);
    }

    obtenerCategorias();
  }, []);

  return (
    <>
    </>
  );
}

export default CategorySection;