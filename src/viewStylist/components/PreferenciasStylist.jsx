import { useEffect, useRef } from "react";
import { OCASIONES, ESTILOS, CALCES, PALETA } from "../constants";
import { IconSol, IconValija, IconLuna, IconEstrella, IconPesos, IconMas, IconFlecha, IconCandado } from "./Iconos.jsx";

const ICONOS_OCASION = { sol: IconSol, valija: IconValija, luna: IconLuna, estrella: IconEstrella };

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
      <fieldset className="sty-campo">
        <legend className="sty-pregunta">¿Qué ocasión estás buscando?</legend>
        <div className="sty-ocasiones">
          {OCASIONES.map(({ valor, icono }) => {
            const Icono = ICONOS_OCASION[icono];
            const activa = pref.ocasion === valor;
            return (
              <button
                key={valor}
                type="button"
                className={`sty-ocasion ${activa ? "is-activa" : ""}`}
                aria-pressed={activa}
                onClick={() => set("ocasion", valor)}
              >
                <Icono />
                {valor}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="sty-campo">
        <span className="sty-label">Contanos qué outfit querés <span>(opcional)</span></span>
        <textarea
          className="sty-input sty-input--area sty-input--pedido"
          rows={2}
          maxLength={600}
          value={pedido}
          onChange={(e) => onPedidoChange(e.target.value)}
          placeholder="Ej.: algo negro y cómodo para salir el sábado, que combine con zapatillas blancas"
        />
      </label>

      <fieldset className="sty-campo">
        <legend className="sty-label">Estilo <span>(podés elegir varios)</span></legend>
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

      <label className="sty-campo">
        <span className="sty-label">Presupuesto máximo (ARS)</span>
        <span className="sty-presupuesto">
          <IconPesos />
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

      <fieldset className="sty-campo">
        <legend className="sty-label">Colores preferidos</legend>
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
        <legend className="sty-label">¿Cómo te gusta que te quede la ropa?</legend>
        <div className="sty-form__final">
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
          <button type="submit" className="sty-btn-generar" disabled={generando}>
            {generando ? "Generando tus looks…" : "Generar mis looks"}
            {!generando && <IconFlecha />}
          </button>
        </div>
      </fieldset>

      <p className="sty-seguro">
        <IconCandado />
        Tus datos están seguros. No compartimos tu información.
      </p>
    </form>
  );
}

export default PreferenciasStylist;
