import { useEffect, useState } from "react";
import { getCategorias, getCategoriaProductos } from "../services/categoria";
import { slugify } from "../../utils/slugify";
import { parseTalles, ordenarTalles } from "../helpers/talles";

/**
 * Trae todas las categorías y sus productos (de todas las marcas) desde Supabase
 * y los agrupa por categoría con la forma que necesita la página:
 * { id_categoria, nombre, slug, imagen, productos, marcas, talles, count, locales }
 * Cada producto lleva además `_talles` (array) para el filtro de talle.
 */
export function useCategoriasData() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      const [catsRes, prodsRes] = await Promise.allSettled([
        getCategorias(),
        getCategoriaProductos(),
      ]);

      if (!active) return;

      if (catsRes.status !== "fulfilled" || catsRes.value.error) {
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
        return;
      }

      const cats = catsRes.value.data ?? [];
      const relaciones =
        prodsRes.status === "fulfilled" && !prodsRes.value.error
          ? prodsRes.value.data ?? []
          : [];

      // agrupo productos por id_categoria (cada producto con sus talles ya parseados)
      const porCategoria = new Map();
      relaciones.forEach((rel) => {
        const prod = rel.Producto;
        if (!prod) return; // el filtro estado=1 puede dejar la relación sin producto
        if (!porCategoria.has(rel.id_categoria)) porCategoria.set(rel.id_categoria, []);
        porCategoria.get(rel.id_categoria).push({
          ...prod,
          _talles: parseTalles(prod.guia_talles),
        });
      });

      const shaped = cats.map((cat) => {
        const productos = porCategoria.get(cat.id_categoria) ?? [];

        // imagen de portada: primera imagen disponible entre sus productos
        const imagen =
          productos.find((p) => p.Imagen?.[0]?.imagen)?.Imagen?.[0]?.imagen ?? null;

        // marcas únicas (para el filtro de marca)
        const marcasMap = new Map();
        // talles disponibles en la categoría (unión de todos los productos)
        const tallesSet = new Set();
        productos.forEach((p) => {
          const m = p.Marca;
          if (m?.id_marca && !marcasMap.has(m.id_marca)) marcasMap.set(m.id_marca, m);
          p._talles.forEach((t) => tallesSet.add(t));
        });

        return {
          id_categoria: cat.id_categoria,
          nombre: cat.nombre,
          slug: slugify(cat.nombre),
          imagen,
          productos,
          marcas: Array.from(marcasMap.values()),
          talles: ordenarTalles(Array.from(tallesSet)),
          count: productos.length,
          locales: marcasMap.size,
        };
      });

      setCategorias(shaped);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { categorias, loading, error };
}
