import { useEffect, useRef } from "react";
import { OCASIONES, ESTILOS, CALCES, GENEROS, PALETA } from "../constants";
import { IconMas, IconFlecha, IconMujer, IconHombre } from "./Iconos.jsx";

const ICONOS_GENERO = { mujer: IconMujer, hombre: IconHombre };

// Paso 1: conocer el estilo del usuario. Es controlado: el estado vive en ViewStylist.
function PreferenciasStylist({ pref, onChange, pedido, onPedidoChange, onSubmit, generando }) {
  const colorRef = useRef(null);
  const set = (campo, valor) => onChange({ ...pref, [campo]: valor });

  const toggle = (campo, valor) =>
    set(campo, pref[campo].includes(valor) ? pref[campo].filter((v) => v !== valor) : [...pref[campo], valor]);

  // el "change" nativo del color picker se dispara una sola vez al cerrarlo
  // (el onChange de React se dispara en cada movimiento)
  useEffect(() => {
    const input = colorRef.current;
    if (!input) return;
    const agregar = () => {
      const hex = input.value.toLowerCase();
      if (!pref.colores.includes(hex)) onChange({ ...pref, colores: [...pref.colores, hex] });
    };
    input.addEventListener("change", agregar);
    return () => input.removeEventListener("change", agregar);
  }, [pref, onChange]);

  const extras = pref.colores.filter((c) => !PALETA.some((p) => p.hex === c));
  const swatches = [...PALETA, ...extras.map((hex) => ({ hex, nombre: hex }))];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="sty-form" onSubmit={handleSubmit}>
      <div className="sty-form__cols">
        <div className="sty-form__col">
          <fieldset className="sty-campo">
            <legend className="sty-label">¿Qué ropa querés ver?</legend>
            <div className="sty-generos" role="radiogroup">
              {GENEROS.map(({ valor, label, icono }) => {
                const Icono = ICONOS_GENERO[icono];
                const activa = pref.genero === valor;
                return (
                  <button
                    key={valor}
                    type="button"
                    role="radio"
                    aria-checked={activa}
                    aria-label={`Ropa ${label.toLowerCase()}`}
                    title={`Ropa ${label.toLowerCase()}`}
                    className={`sty-genero sty-genero--${icono} ${activa ? "is-activa" : ""}`}
                    // tocar el ya elegido lo desmarca: sin género = todas las prendas
                    onClick={() => set("genero", activa ? null : valor)}
                  >
                    <Icono size={34} />
                  </button>
                );
              })}
            </div>
            <p className="sty-ayuda">Si no elegís ninguno, te mostramos todo.</p>
          </fieldset>

          <fieldset className="sty-campo">
            <legend className="sty-label">Ocasión</legend>
            <div className="sty-chips">
              {OCASIONES.map(({ valor }) => {
                const activa = pref.ocasion === valor;
                return (
                  <button
                    key={valor}
                    type="button"
                    className={`sty-chip ${activa ? "is-activa" : ""}`}
                    aria-pressed={activa}
                    onClick={() => set("ocasion", valor)}
                  >
                    {valor}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="sty-campo">
            <legend className="sty-label">Estilo <span>· podés elegir varios</span></legend>
            <div className="sty-chips">
              {ESTILOS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`sty-chip ${pref.estilos.includes(e) ? "is-activa" : ""}`}
                  aria-pressed={pref.estilos.includes(e)}
                  onClick={() => toggle("estilos", e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="sty-form__col">
          <fieldset className="sty-campo">
            <legend className="sty-label">Colores que te gustan</legend>
            <div className="sty-colores">
              {swatches.map(({ hex, nombre }) => {
                const activa = pref.colores.includes(hex);
                return (
                  <button
                    key={hex}
                    type="button"
                    className={`sty-swatch ${activa ? "is-activa" : ""}`}
                    style={{ "--sw": hex }}
                    aria-pressed={activa}
                    aria-label={nombre}
                    title={nombre}
                    onClick={() => toggle("colores", hex)}
                  />
                );
              })}
              <label className="sty-swatch sty-swatch--mas" title="Agregar otro color">
                <IconMas />
                <input ref={colorRef} type="color" aria-label="Agregar otro color" />
              </label>
            </div>
          </fieldset>

          <fieldset className="sty-campo">
            <legend className="sty-label">¿Cómo te gusta que te quede?</legend>
            <div className="sty-chips">
              {CALCES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`sty-chip ${pref.calce === c ? "is-activa" : ""}`}
                  aria-pressed={pref.calce === c}
                  onClick={() => set("calce", c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="sty-campo">
            <span className="sty-label">Presupuesto máximo</span>
            <span className="sty-presupuesto">
              <span aria-hidden="true">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                inputMode="numeric"
                value={pref.presupuesto ?? ""}
                onChange={(e) => set("presupuesto", e.target.value)}
                placeholder="Sin límite"
              />
            </span>
          </label>
        </div>
      </div>

      {/* el texto libre va al final, junto al botón */}
      <label className="sty-campo">
        <span className="sty-label">Contanos qué outfit querés <span>· opcional</span></span>
        <textarea
          className="sty-input sty-input--area"
          rows={2}
          maxLength={600}
          value={pedido}
          onChange={(e) => onPedidoChange(e.target.value)}
          placeholder="Ej.: algo negro y cómodo para salir el sábado, que combine con zapatillas blancas"
        />
      </label>

      <div className="sty-form__final">
        <button type="submit" className="sty-btn" disabled={generando}>
          {generando ? "Generando tus looks…" : "Generar mis looks"}
          {!generando && <IconFlecha />}
        </button>
      </div>
    </form>
  );
}

export default PreferenciasStylist;
