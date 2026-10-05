import { useState } from "react";
import { liquidarVentas } from "../services/superadmin";
import { formatARS } from "../helpers/formato";

// confirma un pago: muestra el desglose por local, pide el comprobante y una nota opcional
function ModalPago({ ventas, onCerrar, onPagado }) {
  const [comprobante, setComprobante] = useState(null);
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const total = ventas.reduce((acc, v) => acc + v.monto, 0);
  const porLocal = new Map();
  for (const v of ventas) {
    const l = porLocal.get(v.local.id_marca) ?? { nombre: v.local.nombre, monto: 0, cantidad: 0 };
    l.monto += v.monto;
    l.cantidad += 1;
    porLocal.set(v.local.id_marca, l);
  }

  const confirmar = async (e) => {
    e.preventDefault();
    if (!comprobante) { setError("Subí el comprobante de la transferencia"); return; }
    setError("");
    setEnviando(true);
    const { error } = await liquidarVentas({
      ids: ventas.map((v) => v.id_venta),
      comprobante,
      nota: nota.trim(),
    });
    setEnviando(false);
    if (error) { setError(error); return; }
    onPagado(total);
  };

  return (
    <div className="sa-modal" onClick={() => !enviando && onCerrar()}>
      <form className="sa-modal__card" onClick={(e) => e.stopPropagation()} onSubmit={confirmar}>
        <h2>Registrar pago</h2>
        <p className="sa-modal__total">{formatARS(total)}</p>
        <p className="sa-modal__sub">
          {ventas.length} {ventas.length === 1 ? "venta" : "ventas"} · {porLocal.size}{" "}
          {porLocal.size === 1 ? "local" : "locales"}
        </p>

        <ul className="sa-modal__desglose">
          {[...porLocal.values()].map((l) => (
            <li key={l.nombre}>
              <span>{l.nombre} <em>({l.cantidad})</em></span>
              <strong>{formatARS(l.monto)}</strong>
            </li>
          ))}
        </ul>

        <label className="sa-modal__archivo">
          <span>Comprobante (imagen o PDF)</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setComprobante(e.target.files?.[0] ?? null)}
          />
        </label>

        <label className="sa-modal__nota">
          <span>Nota (opcional)</span>
          <textarea
            rows={2}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: transferencia Banco Galicia, op. 123456"
          />
        </label>

        {error && <p className="sa-modal__error">{error}</p>}

        <div className="sa-modal__acciones">
          <button type="button" className="sa-btn sa-btn--sec" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </button>
          <button type="submit" className="sa-btn" disabled={enviando}>
            {enviando ? "Registrando..." : "Confirmar pago"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalPago;
