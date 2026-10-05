import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPendientes } from "../services/superadmin";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import { useToast } from "../../context/ToastContext";
import { formatARS, formatFecha } from "../helpers/formato";
import ModalPago from "./ModalPago";

const RESUMEN_VACIO = { total: 0, cantidadVentas: 0, cantidadLocales: 0 };

const MODOS = [
  { valor: "local", label: "Por local" },
  { valor: "venta", label: "Por venta" },
];

function Pendientes() {
  const { sesionVencida } = useOutletContext();
  const { mostrarToast } = useToast();
  const [datos, setDatos] = useState({ resumen: RESUMEN_VACIO, locales: [] });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modo, setModo] = useState("local");
  const [abierto, setAbierto] = useState(null);           // local desplegado en modo "por local"
  const [filtroLocal, setFiltroLocal] = useState("todos"); // en modo "por venta"
  const [seleccion, setSeleccion] = useState(() => new Set());
  const [aPagar, setAPagar] = useState(null);             // ventas que van al modal

  const cargar = useCallback(
    () =>
      getPendientes().then(({ data, error, status }) => {
        if (status === 401) { sesionVencida(); return; }
        if (error) setError(error);
        else {
          setError(null);
          setDatos({ resumen: data.resumen ?? RESUMEN_VACIO, locales: data.locales ?? [] });
        }
        setCargando(false);
      }),
    [sesionVencida]
  );

  useEffect(() => { cargar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // todas las ventas en una lista, cada una con su local, más viejas primero
  const ventas = useMemo(
    () =>
      datos.locales
        .flatMap((l) => l.ventas.map((v) => ({ ...v, local: l })))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
    [datos.locales]
  );

  usePaginaCargando(cargando);
  if (cargando) return null;

  const visibles = filtroLocal === "todos" ? ventas : ventas.filter((v) => v.local.id_marca === Number(filtroLocal));
  const seleccionadas = ventas.filter((v) => seleccion.has(v.id_venta));
  const totalSeleccion = seleccionadas.reduce((acc, v) => acc + v.monto, 0);
  const todasVisiblesMarcadas = visibles.length > 0 && visibles.every((v) => seleccion.has(v.id_venta));

  const alternar = (id) =>
    setSeleccion((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const alternarVisibles = () =>
    setSeleccion((prev) => {
      const s = new Set(prev);
      visibles.forEach((v) => (todasVisiblesMarcadas ? s.delete(v.id_venta) : s.add(v.id_venta)));
      return s;
    });

  const pagarLocal = (local) => setAPagar(local.ventas.map((v) => ({ ...v, local })));

  const alPagar = (total) => {
    setAPagar(null);
    setSeleccion(new Set());
    mostrarToast(`Pago de ${formatARS(total)} registrado`, "exito");
    cargar();
  };

  return (
    <div className="ven sa">
      <header className="ven__head">
        <div>
          <h1>Pagos pendientes</h1>
          <p>
            {formatARS(datos.resumen.total)} por pagar · {datos.resumen.cantidadVentas}{" "}
            {datos.resumen.cantidadVentas === 1 ? "venta" : "ventas"} · {datos.resumen.cantidadLocales}{" "}
            {datos.resumen.cantidadLocales === 1 ? "local" : "locales"}
          </p>
        </div>
        <div className="ven__filtros">
          {MODOS.map((m) => (
            <button
              key={m.valor}
              className={`ven__filtro ${modo === m.valor ? "is-on" : ""}`}
              onClick={() => setModo(m.valor)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      <div className="ven__card">
        {error ? (
          <p className="ven__vacio">No se pudieron cargar los pagos pendientes: {error}</p>
        ) : ventas.length === 0 ? (
          <p className="ven__vacio">No hay ventas por pagar. Está todo al día.</p>
        ) : modo === "local" ? (
          <div className="ven__tabla-wrap">
            <table className="ven__tabla">
              <thead>
                <tr>
                  <th>Local</th><th>Ventas</th><th>Más antigua</th>
                  <th className="ven__num">Total</th><th />
                </tr>
              </thead>
              <tbody>
                {datos.locales.map((l) => {
                  const estaAbierto = abierto === l.id_marca;
                  return (
                    <Fragment key={l.id_marca}>
                      <tr className="ven__fila" onClick={() => setAbierto(estaAbierto ? null : l.id_marca)}>
                        <td>
                          <div className="sa__local">
                            {l.logo ? <img src={l.logo} alt="" /> : <span className="sa__local-ph">{l.nombre[0]}</span>}
                            <div>
                              <strong>{l.nombre}</strong>
                              {l.email && <small>{l.email}</small>}
                            </div>
                          </div>
                        </td>
                        <td>
                          {l.ventas.length}
                          <span className="ven__toggle">{estaAbierto ? "▲" : "▼"}</span>
                        </td>
                        <td>{formatFecha(l.ventas[0].fecha)}</td>
                        <td className="ven__num ven__monto">{formatARS(l.total)}</td>
                        <td className="ven__num">
                          <button
                            className="sa-btn sa-btn--chico"
                            onClick={(e) => { e.stopPropagation(); pagarLocal(l); }}
                          >
                            Pagar local
                          </button>
                        </td>
                      </tr>
                      {estaAbierto && (
                        <tr className="ven__detalle">
                          <td colSpan={5}>
                            <ul>
                              {l.ventas.map((v) => (
                                <li key={v.id_venta}>
                                  <span>
                                    {formatFecha(v.fecha)} · Compra #{v.id_compra} ·{" "}
                                    {v.comprador?.nombre ?? v.comprador?.email ?? "—"}
                                  </span>
                                  <span>{formatARS(v.monto)}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div className="sa__barra">
              <select value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)}>
                <option value="todos">Todos los locales</option>
                {datos.locales.map((l) => (
                  <option key={l.id_marca} value={l.id_marca}>{l.nombre}</option>
                ))}
              </select>
            </div>
            <div className="ven__tabla-wrap">
              <table className="ven__tabla">
                <thead>
                  <tr>
                    <th className="sa__check">
                      <input type="checkbox" checked={todasVisiblesMarcadas} onChange={alternarVisibles} />
                    </th>
                    <th>Fecha</th><th>Local</th><th>Compra</th><th>Comprador</th>
                    <th className="ven__num">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((v) => (
                    <tr key={v.id_venta} className="ven__fila" onClick={() => alternar(v.id_venta)}>
                      <td className="sa__check">
                        <input type="checkbox" checked={seleccion.has(v.id_venta)} readOnly />
                      </td>
                      <td>{formatFecha(v.fecha)}</td>
                      <td>{v.local.nombre}</td>
                      <td>#{v.id_compra}</td>
                      <td>{v.comprador?.nombre ?? v.comprador?.email ?? "—"}</td>
                      <td className="ven__num ven__monto">{formatARS(v.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {modo === "venta" && seleccionadas.length > 0 && (
        <div className="sa__pie">
          <span>
            {seleccionadas.length} {seleccionadas.length === 1 ? "venta seleccionada" : "ventas seleccionadas"} ·{" "}
            <strong>{formatARS(totalSeleccion)}</strong>
          </span>
          <div>
            <button className="sa-btn sa-btn--sec" onClick={() => setSeleccion(new Set())}>Limpiar</button>
            <button className="sa-btn" onClick={() => setAPagar(seleccionadas)}>Pagar seleccionadas</button>
          </div>
        </div>
      )}

      {aPagar && <ModalPago ventas={aPagar} onCerrar={() => setAPagar(null)} onPagado={alPagar} />}
    </div>
  );
}

export default Pendientes;
