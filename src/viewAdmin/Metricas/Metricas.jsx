import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useMarcaAuth } from "../../context/MarcaAuthContext";
import { useMetricas } from "../hooks/useMetricas";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import "./Metricas.css";

const RANGOS = [
  { label: "7 días", valor: 7 },
  { label: "30 días", valor: 30 },
  { label: "90 días", valor: 90 },
  { label: "Todo", valor: 3650 },
];
const METRICAS = [
  { key: "ventas", label: "Ventas" },
  { key: "visualizaciones", label: "Visualizaciones" },
  { key: "clics", label: "Clics" },
];

const formatARS = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(v || 0));
const formatNum = (v) => new Intl.NumberFormat("es-AR").format(Number(v || 0));

function Metricas() {
  const { idMarca } = useMarcaAuth();
  const [dias, setDias] = useState(30);
  const [metrica, setMetrica] = useState("ventas");
  const { serie, categorias, tabla, cargando } = useMetricas(idMarca, dias);

  usePaginaCargando(cargando);
  if (cargando) return null;

  return (
    <div className="met">
      <header className="met__head">
        <div>
          <h1>Métricas</h1>
          <p>Análisis de rendimiento</p>
        </div>
        <div className="met__rangos">
          {RANGOS.map((r) => (
            <button
              key={r.valor}
              className={`met__rango ${dias === r.valor ? "is-on" : ""}`}
              onClick={() => setDias(r.valor)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {/* Tendencia */}
      <div className="met__card">
        <div className="met__card-head">
          <h2>Tendencia</h2>
          <div className="met__toggle">
            {METRICAS.map((m) => (
              <button
                key={m.key}
                className={`met__toggle-btn ${metrica === m.key ? "is-on" : ""}`}
                onClick={() => setMetrica(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {serie.length === 0 ? (
          <p className="met__vacio">No hay datos en este período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={serie} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey={metrica} stroke="#123d59" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="met__fila">
        {/* Categorías */}
        <div className="met__card met__card--media">
          <h2>Categorías más vendidas</h2>
          {categorias.length === 0 ? (
            <p className="met__vacio">Sin datos.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categorias} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#888" }} allowDecimals={false} />
                <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11, fill: "#555" }} width={90} />
                <Tooltip />
                <Bar dataKey="ventas" fill="#123d59" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Demografía (placeholder, sin datos) */}
        <div className="met__card met__card--media met__card--ph">
          <h2>Demografía</h2>
          <div className="met__ph-box">
            <p>Próximamente</p>
            <span>Necesita datos demográficos de compradores</span>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="met__card">
        <h2>Rendimiento por producto</h2>
        {tabla.length === 0 ? (
          <p className="met__vacio">Sin datos.</p>
        ) : (
          <div className="met__tabla-wrap">
            <table className="met__tabla">
              <thead>
                <tr>
                  <th>Producto</th><th>Stock</th><th>Vistas</th>
                  <th>Clics</th><th>Ventas</th><th>Conv.</th><th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {tabla.map((p) => (
                  <tr key={p.id}>
                    <td className="met__td-prod">
                      {p.imagen ? <img src={p.imagen} alt="" /> : <div className="met__td-ph">{p.nombre?.charAt(0)}</div>}
                      <span>{p.nombre}</span>
                    </td>
                    <td>{formatNum(p.stock)}</td>
                    <td>{formatNum(p.visualizaciones)}</td>
                    <td>{formatNum(p.clics)}</td>
                    <td>{formatNum(p.ventas)}</td>
                    <td>{p.conversion.toFixed(1)}%</td>
                    <td className="met__td-ing">{formatARS(p.ingresos)}</td>
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

export default Metricas;