import { useEffect, useState } from "react";
import { getSubcategorias, crearSubcategoria } from "../../services/catalogo";
import BuscablePicker from "../BuscablePicker/BuscablePicker";

// selector de categorías (con buscador, muestra máximo 5 a la vez) + subcategorías
// por cada categoría elegida, con opción de crear subcategorías nuevas al vuelo.
function CategoriasSubcategoriasPicker({
  categorias,
  catSeleccionadas,
  onToggleCategoria,
  subSeleccionadas,
  onToggleSubcategoria,
  onError,
}) {
  const [subcategoriasPorCategoria, setSubcategoriasPorCategoria] = useState({});

  // trae las subcategorías de cada categoría seleccionada que todavía no se pidieron
  useEffect(() => {
    catSeleccionadas.forEach((idCategoria) => {
      if (subcategoriasPorCategoria[idCategoria] !== undefined) return;
      getSubcategorias(idCategoria).then(({ data, error }) => {
        if (error) { onError?.(error); return; }
        setSubcategoriasPorCategoria((prev) => ({ ...prev, [idCategoria]: data ?? [] }));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catSeleccionadas]);

  const handleToggleCategoria = (idCategoria) => {
    const estabaSeleccionada = catSeleccionadas.includes(idCategoria);
    if (estabaSeleccionada) {
      // si se saca la categoría, se sacan también las subcategorías que dependían de ella
      const subsDeEstaCategoria = (subcategoriasPorCategoria[idCategoria] ?? []).map((s) => s.id_subcategoria);
      subsDeEstaCategoria.forEach((idSub) => {
        if (subSeleccionadas.includes(idSub)) onToggleSubcategoria(idSub);
      });
    }
    onToggleCategoria(idCategoria);
  };

  const handleCrearSubcategoria = (idCategoria) => async (nombre) => {
    const { data, error } = await crearSubcategoria(nombre, idCategoria);
    if (error) return { data: null, error };
    setSubcategoriasPorCategoria((prev) => ({
      ...prev,
      [idCategoria]: [...(prev[idCategoria] ?? []), data],
    }));
    return { data, error: null };
  };

  return (
    <div className="ap__cats-block">
      <BuscablePicker
        items={categorias}
        idKey="id_categoria"
        seleccionados={catSeleccionadas}
        onToggle={handleToggleCategoria}
        placeholder="Buscar categoría..."
        vacioTexto="No se encontraron categorías."
        onError={onError}
      />

      {catSeleccionadas.length > 0 && (
        <div className="ap__subcats">
          {catSeleccionadas.map((idCategoria) => {
            const categoria = categorias.find((c) => c.id_categoria === idCategoria);
            const subs = subcategoriasPorCategoria[idCategoria] ?? [];
            return (
              <div key={idCategoria} className="ap__subcat-group">
                <h3>Subcategorías de {categoria?.nombre ?? "..."}</h3>
                <BuscablePicker
                  items={subs}
                  idKey="id_subcategoria"
                  seleccionados={subSeleccionadas}
                  onToggle={onToggleSubcategoria}
                  placeholder="Buscar subcategoría..."
                  vacioTexto="Todavía no hay subcategorías para esta categoría."
                  onCrear={handleCrearSubcategoria(idCategoria)}
                  crearPlaceholder="Nueva subcategoría"
                  onError={onError}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoriasSubcategoriasPicker;
