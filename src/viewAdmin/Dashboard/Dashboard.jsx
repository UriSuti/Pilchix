import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMarcaAuth } from "../../context/MarcaAuthContext";
import { useDashboard } from "../hooks/useDashboard";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import "./Dashboard.css";

const formatARS = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));
const formatNum = (v) => new Intl.NumberFormat("es-AR").format(Number(v || 0));

function Dashboard() {
  const { marca, idMarca } = useMarcaAuth();
  const [dias] = useState(30);
  const { kpis, top, serie, cargando } = useDashboard(idMarca, dias);

  usePaginaCargando(cargando);
  if (cargando || !kpis) return null;

  return (
    <div className="dash">
      <header className="dash__head">
        <div>
          <h1>Hola, {marca?.nombre}</h1>
          <p>Resumen de los últimos {dias} días</p>
        </div>
      </header>

      {/* KPIs */}
      <div className="dash__kpis">
        <div className="kpi">
          <span className="kpi__label">Ingresos</span>
          <strong className="kpi__valor">{formatARS(kpis.ingresos)}</strong>
        </div>
        <div className="kpi">
          <span className="kpi__label">Ventas</span>
          <strong className="kpi__valor">{formatNum(kpis.ventas)}</strong>
        </div>
        <div className="kpi">
          <span className="kpi__label">Visualizaciones</span>
          <strong className="kpi__valor">{formatNum(kpis.visualizaciones)}</strong>
        </div>
        <div className="kpi">
          <span className="kpi__label">Productos activos</span>
          <strong className="kpi__valor">{formatNum(kpis.activos)}</strong>
        </div>
      </div>

      {/* Gráfico */}
      <div className="dash__card">
        <h2>Ventas por día</h2>
        {serie.length === 0 ? (
          <p className="dash__vacio">Todavía no hay datos de ventas en este período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={serie} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="ventas" stroke="#123d59" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top productos */}
      <div className="dash__card">
        <h2>Productos con mejor rendimiento</h2>
        {top.length === 0 ? (
          <p className="dash__vacio">Sin datos suficientes.</p>
        ) : (
          <div className="dash__top">
            {top.map((p, i) => (
              <div key={p.id} className="top-item">
                <span className="top-item__rank">{i + 1}</span>
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="top-item__img" />
                ) : (
                  <div className="top-item__img top-item__img--ph">{p.nombre?.charAt(0)}</div>
                )}
                <div className="top-item__info">
                  <h3>{p.nombre}</h3>
                  <span>{formatNum(p.ventas)} ventas</span>
                </div>
                <strong className="top-item__ingresos">{formatARS(p.ingresos)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;