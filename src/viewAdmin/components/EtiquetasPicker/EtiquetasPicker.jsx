import { crearEtiqueta } from "../../services/catalogo";
import BuscablePicker from "../BuscablePicker/BuscablePicker";

// selector de etiquetas (ocasión/estilo: noche, boliche, elegante...) con buscador
// que muestra máximo 5 a la vez, y opción de crear etiquetas nuevas al vuelo.
function EtiquetasPicker({ etiquetas, seleccionadas, onToggle, onEtiquetaCreada, onError }) {
  const handleCrear = async (nombre) => {
    const { data, error } = await crearEtiqueta(nombre);
    if (error) return { data: null, error };
    onEtiquetaCreada(data);
    return { data, error: null };
  };

  return (
    <BuscablePicker
      items={etiquetas}
      idKey="id_etiqueta"
      seleccionados={seleccionadas}
      onToggle={onToggle}
      placeholder="Buscar etiqueta..."
      vacioTexto="Todavía no hay etiquetas cargadas."
      onCrear={handleCrear}
      crearPlaceholder="Nueva etiqueta"
      onError={onError}
    />
  );
}

export default EtiquetasPicker;
