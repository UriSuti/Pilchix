import { useState } from "react";

// presets por tipo de talle. calzado va con medios números (38, 38.5, …)
const PRESETS = {
  ropa: ["XS", "S", "M", "L", "XL", "XXL"],
  calzado: [
    "35", "35.5", "36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5",
    "40", "40.5", "41", "41.5", "42", "42.5", "43", "43.5", "44", "45", "46",
  ],
};

const ORDEN_LETRAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// deja los talles prolijos: números en orden ascendente, letras por su orden natural
function ordenarTalles(arr) {
  return [...arr].sort((a, b) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const aNum = !Number.isNaN(na) && /^\d/.test(a);
    const bNum = !Number.isNaN(nb) && /^\d/.test(b);
    if (aNum && bNum) return na - nb;
    if (aNum) return 1; // números después de las letras
    if (bNum) return -1;
    const ia = ORDEN_LETRAS.indexOf(a.toUpperCase());
    const ib = ORDEN_LETRAS.indexOf(b.toUpperCase());
    if (ia !== -1 && ib !== -1) return ia - ib;
    return a.localeCompare(b);
  });
}

// para editar: adivina si el producto usa talles de calzado o de ropa
export function inferirTipoTalle(talles = []) {
  if (talles.length === 0) return "ropa";
  const numericos = talles.filter((t) => /^\d/.test(String(t)));
  return numericos.length >= talles.length / 2 ? "calzado" : "ropa";
}

function TallesPicker({ talles = [], onChange }) {
  const [tipo, setTipo] = useState(() => inferirTipoTalle(talles));
  const [temp, setTemp] = useState("");

  const toggle = (t) =>
    onChange(
      ordenarTalles(talles.includes(t) ? talles.filter((x) => x !== t) : [...talles, t])
    );

  const agregar = () => {
    const v = temp.trim();
    if (!v) return;
    if (!talles.includes(v)) onChange(ordenarTalles([...talles, v]));
    setTemp("");
  };

  const preset = PRESETS[tipo] ?? [];
  // talles elegidos que no están en el preset actual (personalizados)
  const custom = talles.filter((t) => !preset.includes(t));

  return (
    <div className="ap__talles-wrap">
      <label className="ap__field">
        <span>Tipo de talle</span>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="ropa">Ropa (S, M, L…)</option>
          <option value="calzado">Calzado (38, 39…)</option>
          <option value="otro">Otro</option>
        </select>
      </label>

      <div className="ap__talles">
        {preset.map((t) => (
          <button
            type="button"
            key={t}
            className={`ap__talle ${talles.includes(t) ? "is-on" : ""}`}
            onClick={() => toggle(t)}
          >
            {t}
          </button>
        ))}
        {/* personalizados: se ven siempre activos, clic para quitarlos */}
        {custom.map((t) => (
          <button
            type="button"
            key={t}
            className="ap__talle is-on"
            onClick={() => toggle(t)}
            title="Quitar"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="ap__talle-add">
        <input
          type="text"
          value={temp}
          placeholder="Agregar otro talle"
          onChange={(e) => setTemp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              agregar();
            }
          }}
        />
        <button type="button" onClick={agregar}>
          Agregar
        </button>
      </div>
    </div>
  );
}

export default TallesPicker;
