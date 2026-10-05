import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getLiquidaciones, getUrlComprobante } from "../services/superadmin";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import { useToast } from "../../context/ToastContext";
import { formatARS, formatFecha } from "../helpers/formato";

function Historial() {
  const { sesionVencida } = useOutletContext();
  const { mostrarToast } = useToast();
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    getLiquidaciones().then(({ data, error, status }) => {
      if (!activo) return;
      if (status === 401) { sesionVencida(); return; }
      if (error) setError(error);
      else setLiquidaciones(data ?? []);
      setCargando(false);
    });
    return () => { activo = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  usePaginaCargando(cargando);
  if (cargando) return null;

  const verComprobante = async (id) => {
    // la pestaña se abre antes del await para que el navegador no la bloquee como popup
    const pestaña = window.open("", "_blank");
    const { url, error } = await getUrlComprobante(id);
    if (error || !url) {
      pestaña?.close();
      mostrarToast(error || "No se pudo abrir el comprobante", "error");
      return;
    }
    if (pestaña) pestaña.location.replace(url);
    else window.location.assign(url);
  };

  const totalPagado = liquidaciones.reduce((acc, l) => acc + l.monto, 0);

  return (
    <div className="ven sa">
      <header className="ven__head">
        <div>
          <h1>Historial de pagos</h1>
          <p>
            {liquidaciones.length} {liquidaciones.length === 1 ? "pago" : "pagos"} · {formatARS(totalPagado)} pagado
          </p>
        </div>
      </header>

      <div className="ven__card">
        {error ? (
          <p className="ven__vacio">No se pudo cargar el historial: {error}</p>
        ) : liquidaciones.length === 0 ? (
          <p className="ven__vacio">Todavía no registraste ningún pago.</p>
        ) : (
          <div className="ven__tabla-wrap">
            <table className="ven__tabla">
              <thead>
                <tr>
                  <th>Fecha</th><th>Locales</th><th>Ventas</th><th>Nota</th>
                  <th className="ven__num">Monto</th><th />
                </tr>
              </thead>
              <tbody>
                {liquidaciones.map((l) => (
                  <tr key={l.id_liquidacion}>
                    <td>{formatFecha(l.fecha)}</td>
                    <td className="sa__marcas">
                      {l.marcas.map((m) => (
                        <span key={m.id_marca}>{m.nombre} · {formatARS(m.monto)}</span>
                      ))}
                    </td>
                    <td>{l.cantidadVentas}</td>
                    <td className="sa__nota">{l.nota ?? "—"}</td>
                    <td className="ven__num ven__monto">{formatARS(l.monto)}</td>
                    <td className="ven__num">
                      <button className="sa-btn sa-btn--sec sa-btn--chico" onClick={() => verComprobante(l.id_liquidacion)}>
                        Ver comprobante
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Historial;
