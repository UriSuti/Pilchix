import { Fragment, useState } from "react";
import { useVentas } from "../hooks/useVentas";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import "./Ventas.css";

const formatARS = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(v || 0));
const formatFecha = (f) =>
  new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

const ESTADOS_VENTA = {
  por_cobrar: "Por cobrar",
  cobrado: "Cobrado",
};

const FILTROS = [
  { valor: "todas", label: "Todas" },
  { valor: "por_cobrar", label: "Por cobrar" },
  { valor: "cobrado", label: "Cobradas" },
];

function Ventas() {
  const { ventas, resumen, error, cargando } = useVentas();
  const [filtro, setFiltro] = useState("todas");
  const [abierta, setAbierta] = useState(null);

  usePaginaCargando(cargando);
  if (cargando) return null;

  const visibles = filtro === "todas" ? ventas : ventas.filter((v) => v.estado === filtro);

  return (
    <div className="ven">
      <header className="ven__head">
        <div>
          <h1>Ventas</h1>
          <p>
            {resumen.cantidadVentas} {resumen.cantidadVentas === 1 ? "venta" : "ventas"} ·{" "}
            {formatARS(resumen.porCobrar)} por cobrar
          </p>
        </div>
        <div className="ven__filtros">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              className={`ven__filtro ${filtro === f.valor ? "is-on" : ""}`}
              onClick={() => setFiltro(f.valor)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="ven__card">
        {error ? (
          <p className="ven__vacio">No se pudieron cargar las ventas: {error}</p>
        ) : visibles.length === 0 ? (
          <p className="ven__vacio">
            {ventas.length === 0 ? "Todavía no tenés ventas." : "No hay ventas con este estado."}
          </p>
        ) : (
          <div className="ven__tabla-wrap">
            <table className="ven__tabla">
              <thead>
                <tr>
                  <th>Fecha</th><th>Compra</th><th>Comprador</th><th>Productos</th>
                  <th className="ven__num">Monto</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((v) => {
                  const unidades = v.items.reduce((acc, it) => acc + it.cantidad, 0);
                  const estaAbierta = abierta === v.id_venta;
                  return (
                    <Fragment key={v.id_venta}>
                      <tr
                        className="ven__fila"
                        onClick={() => setAbierta(estaAbierta ? null : v.id_venta)}
                      >
                        <td>{formatFecha(v.fecha)}</td>
                        <td>#{v.id_compra}</td>
                        <td>{v.comprador?.nombre ?? v.comprador?.email ?? "—"}</td>
                        <td>
                          {unidades} {unidades === 1 ? "unidad" : "unidades"}
                          <span className="ven__toggle">{estaAbierta ? "▲" : "▼"}</span>
                        </td>
                        <td className="ven__num ven__monto">{formatARS(v.monto)}</td>
                        <td>
                          <span className={`ven__estado ven__estado--${v.estado}`}>
                            {ESTADOS_VENTA[v.estado] ?? v.estado}
                          </span>
                          {v.estado === "cobrado" && v.fecha_cobro && (
                            <span className="ven__cobro">el {formatFecha(v.fecha_cobro)}</span>
                          )}
                        </td>
                      </tr>
                      {estaAbierta && (
                        <tr className="ven__detalle">
                          <td colSpan={6}>
                            <ul>
                              {v.items.map((it, i) => (
                                <li key={i}>
                                  <span>
                                    {it.cantidad} × {it.nombre}
                                    {it.talle ? ` · talle ${it.talle}` : ""}
                                    {it.color && <i className="ven__color" style={{ background: it.color }} />}
                                  </span>
                                  <span>{formatARS(it.precio_unitario * it.cantidad)}</span>
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
        )}
      </div>
    </div>
  );
}

export default Ventas;
