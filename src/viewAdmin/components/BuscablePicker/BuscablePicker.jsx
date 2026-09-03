import { useState } from "react";

const MAX_VISIBLES = 5;

// checklist con buscador que muestra máximo 5 opciones a la vez (las ya elegidas
// siempre quedan visibles) y, opcionalmente, un campo para crear una opción nueva.
function BuscablePicker({
  items,
  idKey,
  seleccionados,
  onToggle,
  placeholder = "Buscar...",
  vacioTexto = "No se encontraron resultados.",
  onCrear,
  crearPlaceholder = "Agregar nueva...",
  onError,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [creando, setCreando] = useState(false);

  const filtro = busqueda.trim().toLowerCase();
  const filtrados = items.filter((it) => it.nombre.toLowerCase().includes(filtro)).slice(0, MAX_VISIBLES);

  // los ya seleccionados siempre se ven, aunque no entren en el filtro o el límite
  const seleccionadosFueraDeVista = items.filter(
    (it) => seleccionados.includes(it[idKey]) && !filtrados.some((f) => f[idKey] === it[idKey])
  );
  const aMostrar = [...seleccionadosFueraDeVista, ...filtrados];

  const crear = async () => {
    const nombre = nuevoNombre.trim();
    if (!nombre || !onCrear) return;
    setCreando(true);
    const { data, error } = await onCrear(nombre);
    setCreando(false);
    if (error) { onError?.(error); return; }
    onToggle(data[idKey]);
    setNuevoNombre("");
  };

  return (
    <div className="ap__picker">
      <input
        type="text"
        className="ap__picker-search"
        placeholder={placeholder}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="ap__cats">
        {aMostrar.map((it) => (
          <label key={it[idKey]} className="ap__cat">
            <input
              type="checkbox"
              checked={seleccionados.includes(it[idKey])}
              onChange={() => onToggle(it[idKey])}
            />
            {it.nombre}
          </label>
        ))}
        {!aMostrar.length && <span className="ap__picker-empty">{vacioTexto}</span>}
      </div>
      {!filtro && items.length > MAX_VISIBLES && (
        <p className="ap__picker-hint">
          Mostrando {MAX_VISIBLES} de {items.length}. Usá el buscador para encontrar el resto.
        </p>
      )}

      {onCrear && (
        <div className="ap__picker-add">
          <input
            type="text"
            placeholder={crearPlaceholder}
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); crear(); }
            }}
          />
          <button type="button" onClick={crear} disabled={creando}>
            {creando ? "Creando..." : "+ Crear"}
          </button>
        </div>
      )}
    </div>
  );
}

export default BuscablePicker;
