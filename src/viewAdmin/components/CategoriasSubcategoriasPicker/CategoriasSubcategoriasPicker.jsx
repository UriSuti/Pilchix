import { categoriasApi } from "../../services/categorias";
import { getModuloCategorias } from "../../services/catalogo";
import BuscablePicker from "../BuscablePicker/BuscablePicker";

// selector de categorías (con buscador, muestra máximo 5 a la vez) + subcategorías
// por cada categoría elegida. Las categorías son globales (comunes a todas las marcas);
// las subcategorías son propias de la marca y se pueden crear al vuelo.
// `modulo` es { globales, activas, subcategorias } (ver getModuloCategorias).
function CategoriasSubcategoriasPicker({
  modulo,
  onModuloChange,
  catSeleccionadas,
  onToggleCategoria,
  subSeleccionadas,
  onToggleSubcategoria,
  onError,
}) {
  const { globales, activas, subcategorias } = modulo;
  const subsDe = (idCategoria) => subcategorias.filter((s) => s.id_categoria === idCategoria); // JEJE ME ENCONTRASTE XD

  const handleToggleCategoria = async (idCategoria) => {
    const estabaSeleccionada = catSeleccionadas.includes(idCategoria);
    if (estabaSeleccionada) {
      // si se saca la categoría, se sacan también las subcategorías que dependían de ella
      subsDe(idCategoria).forEach(({ id_subcategoria }) => {
        if (subSeleccionadas.includes(id_subcategoria)) onToggleSubcategoria(id_subcategoria);
      });
    } else if (!activas.includes(idCategoria)) {
      // usar una categoría global en un producto la activa para la marca
      try {
        await categoriasApi.activar(idCategoria);
        onModuloChange({ ...modulo, activas: [...activas, idCategoria] });
      } catch (err) {
        onError?.(err.message);
        return;
      }
    }
    onToggleCategoria(idCategoria);
  };

  const handleCrearSubcategoria = (idCategoria) => async (nombre) => {
    try {
      await categoriasApi.crearSub(idCategoria, nombre);
    } catch (err) {
      return { data: null, error: err.message || "No se pudo crear la subcategoría" };
    }
    // recargamos el módulo para tener la subcategoría con su id
    const { data, error } = await getModuloCategorias();
    if (error) return { data: null, error };
    onModuloChange(data);
    const creada = data.subcategorias.find(
      (s) => s.id_categoria === idCategoria && s.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
    );
    return creada ? { data: creada, error: null } : { data: null, error: "No se encontró la subcategoría creada" };
  };

  return (
    <div className="ap__cats-block">
      <BuscablePicker
        items={globales}
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
            const categoria = globales.find((c) => c.id_categoria === idCategoria);
            return (
              <div key={idCategoria} className="ap__subcat-group">
                <h3>Subcategorías de {categoria?.nombre ?? "..."}</h3>
                <BuscablePicker
                  items={subsDe(idCategoria)}
                  idKey="id_subcategoria"
                  seleccionados={subSeleccionadas}
                  onToggle={onToggleSubcategoria}
                  placeholder="Buscar subcategoría..."
                  vacioTexto="Tu marca todavía no tiene subcategorías para esta categoría."
                  onCrear={handleCrearSubcategoria(idCategoria)}
                  crearPlaceholder="Nueva subcategoría de tu marca"
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
