import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useMetricas } from "../hooks/useMetricas";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import "./Metricas.css";

const RANGOS = [
  { label: "7 días", valor: 7 },
  { label: "30 días", valor: 30 },
  { label: "90 días", valor: 90 },
  { label: "Todo", valor: 3650 },
];
const esPreset = (d) => RANGOS.some((r) => r.valor === d);

const SERIES = [
  { key: "ingresos", label: "Ingresos", moneda: true },
  { key: "ventas", label: "Ventas" },
  { key: "visualizaciones", label: "Vistas" },
  { key: "clics", label: "Clics" },
];

const COLUMNAS = [
  { key: "nombre", label: "Producto" },
  { key: "stock", label: "Stock" },
  { key: "vistas", label: "Vistas" },
  { key: "clics", label: "Clics" },
  { key: "ventas", label: "Ventas" },
  { key: "conversion", label: "Conv." },
  { key: "favoritos", label: "Favs" },
  { key: "recomendacion", label: "Recom." },
  { key: "ingresos", label: "Ingresos" },
];

const fmtARS = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));
const fmtNum = (v) => new Intl.NumberFormat("es-AR").format(Number(v || 0));
const fmtCompacto = (v) =>
  new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(Number(v || 0));
const fmtPct = (v) => (v == null ? "—" : `${v.toFixed(1)}%`);
const fmtFechaCorta = (f) => {
  const [, m, d] = String(f).split("-");
  return `${d}/${m}`;
};

/* ---------- piezas chicas ---------- */

function Variacion({ valor, sufijo = "%", decimales = 0 }) {
  if (valor == null) return <span className="kpi__sub">sin datos previos</span>;
  const sube = valor >= 0;
  return (
    <span className={`kpi__var ${sube ? "kpi__var--up" : "kpi__var--down"}`}>
      {sube ? "↑" : "↓"} {Math.abs(valor).toFixed(decimales)}{sufijo}
    </span>
  );
}

function Kpi({ label, valor, variacion, sub, sufijo, decimales }) {
  return (
    <div className="kpi">
      <span className="kpi__label">{label}</span>
      <strong className="kpi__valor">{valor}</strong>
      {variacion !== undefined ? (
        <Variacion valor={variacion} sufijo={sufijo} decimales={decimales} />
      ) : (
        sub && <span className="kpi__sub">{sub}</span>
      )}
    </div>
  );
}

function TooltipSerie({ active, payload, label, serie }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="met-tt">
      <span>{fmtFechaCorta(label)}</span>
      <strong>{serie.moneda ? fmtARS(v) : `${fmtNum(v)} ${serie.label.toLowerCase()}`}</strong>
    </div>
  );
}

function Embudo({ etapas }) {
  const max = etapas[0]?.valor || 1;
  return (
    <div className="embudo">
      {etapas.map((e, i) => {
        const anterior = etapas[i - 1];
        const tasa = anterior?.valor ? (e.valor / anterior.valor) * 100 : null;
        return (
          <div key={e.etapa}>
            <div className="embudo__head">
              <span>{e.etapa}</span>
              <strong>{fmtNum(e.valor)}</strong>
            </div>
            <div className="embudo__track">
              <div
                className="embudo__bar"
                style={{ width: `${e.valor ? Math.max((e.valor / max) * 100, 2) : 0}%` }}
              />
            </div>
            {i > 0 && (
              <span className="embudo__tasa">
                {tasa == null ? "—" : `${tasa.toFixed(1)}% de ${anterior.etapa.toLowerCase()}`}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ListaBarras({ items, label, valor, formato = fmtNum, swatch, limite = 6 }) {
  if (!items.length) return <p className="met__vacio">Sin datos en este período.</p>;
  const max = Math.max(...items.map(valor), 1);
  return (
    <div className="lb-lista">
      {items.slice(0, limite).map((it) => (
        <div className={`lb ${swatch ? "lb--swatch" : ""}`} key={label(it)}>
          {swatch && <span className="lb__swatch" style={{ background: swatch(it) }} />}
          <span className="lb__nombre" title={label(it)}>{label(it)}</span>
          <div className="lb__track">
            <div className="lb__bar" style={{ width: `${(valor(it) / max) * 100}%` }} />
          </div>
          <span className="lb__num">{formato(valor(it))}</span>
        </div>
      ))}
    </div>
  );
}

function Alertas({ alertas }) {
  const grupos = [
    { key: "sinStock", titulo: "Sin stock", tono: "rojo", detalle: () => "0 unidades" },
    { key: "stockEnRiesgo", titulo: "Stock en riesgo", tono: "ambar", detalle: (p) => `~${p.diasStock} días` },
    { key: "sinVentas", titulo: "Vistas sin ventas", tono: "gris", detalle: (p) => `${fmtNum(p.vistas)} vistas` },
  ].filter((g) => alertas[g.key]?.length);

  if (!grupos.length) return <p className="met__vacio">Todo en orden.</p>;

  return grupos.map((g) => (
    <div key={g.key} className="alerta-grupo">
      <span className={`alerta-grupo__titulo alerta--${g.tono}`}>
        {g.titulo} · {alertas[g.key].length}
      </span>
      {alertas[g.key].slice(0, 4).map((p) => (
        <div key={p.id} className="alerta-item">
          <span>{p.nombre}</span>
          <small>{g.detalle(p)}</small>
        </div>
      ))}
    </div>
  ));
}

/* ---------- pantalla ---------- */

function Metricas() {
  const [dias, setDias] = useState(30);
  const [diasInput, setDiasInput] = useState("");
  const [serieKey, setSerieKey] = useState("ingresos");
  const [orden, setOrden] = useState({ col: "ingresos", dir: "desc" });
  const { data, cargando, error } = useMetricas(dias);

  // overlay solo en la primera carga; al cambiar de rango se atenúa la vista
  usePaginaCargando(cargando && !data);

  const tabla = useMemo(() => {
    if (!data) return [];
    const f = orden.dir === "asc" ? 1 : -1;
    return [...data.tabla].sort((a, b) => {
      const va = a[orden.col] ?? -1;
      const vb = b[orden.col] ?? -1;
      return typeof va === "string" ? va.localeCompare(vb) * f : (va - vb) * f;
    });
  }, [data, orden]);

  if (!data) {
    return error ? <p className="met__vacio">No se pudieron cargar las métricas: {error}</p> : null;
  }

  const k = data.kpis;
  const conVar = data.dias < 3650; // en "Todo" no hay período anterior con qué comparar
  const v = (x) => (conVar ? x : undefined);
  const serie = SERIES.find((s) => s.key === serieKey);
  const hayActividad = data.serie.some((d) => d[serieKey] > 0);
  const diffConversion = k.conversion.anterior ? k.conversion.actual - k.conversion.anterior : null;

  const elegirPreset = (valor) => { setDias(valor); setDiasInput(""); };
  const aplicarDias = () => {
    const n = Math.round(Number(diasInput));
    if (n >= 1 && n <= 3650) setDias(n);
  };
  const ordenarPor = (col) =>
    setOrden((o) => (o.col === col ? { col, dir: o.dir === "asc" ? "desc" : "asc" } : { col, dir: "desc" }));

  return (
    <div className={`met ${cargando ? "is-actualizando" : ""}`}>
      <header className="met__head">
        <div>
          <h1>Métricas</h1>
          <p>
            {dias >= 3650 ? "Desde el inicio" : `Últimos ${dias} días`}
            {conVar && " · comparado con el período anterior"}
          </p>
        </div>
        <div className="met__rangos">
          {RANGOS.map((r) => (
            <button
              key={r.valor}
              className={`met__rango ${dias === r.valor ? "is-on" : ""}`}
              onClick={() => elegirPreset(r.valor)}
            >
              {r.label}
            </button>
          ))}
          <input
            type="number"
            min="1"
            max="3650"
            placeholder="N días"
            className={`met__rango-input ${!esPreset(dias) ? "is-on" : ""}`}
            value={diasInput}
            onChange={(e) => setDiasInput(e.target.value)}
            onBlur={aplicarDias}
            onKeyDown={(e) => e.key === "Enter" && aplicarDias()}
          />
        </div>
      </header>

      <div className="met__kpis">
        <Kpi label="Ingresos" valor={fmtARS(k.ingresos.actual)} variacion={v(k.ingresos.variacion)} />
        <Kpi label="Unidades vendidas" valor={fmtNum(k.ventas.actual)} variacion={v(k.ventas.variacion)} />
        <Kpi label="Pedidos" valor={fmtNum(k.pedidos.actual)} variacion={v(k.pedidos.variacion)} />
        <Kpi label="Ticket promedio" valor={fmtARS(k.ticketPromedio.actual)} variacion={v(k.ticketPromedio.variacion)} />
        <Kpi label="Vistas" valor={fmtNum(k.visualizaciones.actual)} variacion={v(k.visualizaciones.variacion)} />
        <Kpi
          label="Conversión"
          valor={fmtPct(k.conversion.actual)}
          variacion={v(diffConversion)}
          sufijo=" pp"
          decimales={1}
        />
        <Kpi
          label="Seguidores"
          valor={fmtNum(k.seguidores)}
          sub={`+${fmtNum(k.nuevosSeguidores.actual)} en el período`}
        />
        <Kpi label="Recomendación" valor={fmtPct(k.recomendacion)} sub="según las opiniones" />
      </div>

      <div className="met__card">
        <div className="met__card-head">
          <h2>Evolución</h2>
          <div className="met__toggle">
            {SERIES.map((s) => (
              <button
                key={s.key}
                className={`met__toggle-btn ${serieKey === s.key ? "is-on" : ""}`}
                onClick={() => setSerieKey(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {!hayActividad ? (
          <p className="met__vacio">Sin {serie.label.toLowerCase()} en este período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.serie} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradMetricas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#123d59" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#123d59" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef0f2" />
              <XAxis
                dataKey="fecha"
                tickFormatter={fmtFechaCorta}
                tick={{ fontSize: 11, fill: "#8a9099" }}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8a9099" }}
                axisLine={false}
                tickLine={false}
                width={serie.moneda ? 64 : 40}
                allowDecimals={false}
                tickFormatter={(x) => (serie.moneda ? `$${fmtCompacto(x)}` : fmtNum(x))}
              />
              <Tooltip content={<TooltipSerie serie={serie} />} />
              <Area
                type="monotone"
                dataKey={serieKey}
                stroke="#123d59"
                strokeWidth={2}
                fill="url(#gradMetricas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="met__grid2">
        <div className="met__card">
          <h2>Embudo de conversión</h2>
          <Embudo etapas={data.embudo} />
        </div>
        <div className="met__card">
          <h2>Categorías por ingresos</h2>
          <ListaBarras
            items={data.categorias}
            label={(c) => c.categoria}
            valor={(c) => c.ingresos}
            formato={(x) => `$${fmtCompacto(x)}`}
          />
        </div>
      </div>

      <div className="met__grid3">
        <div className="met__card">
          <h2>Talles más vendidos</h2>
          <ListaBarras items={data.talles} label={(t) => t.talle} valor={(t) => t.unidades} />
        </div>
        <div className="met__card">
          <h2>Colores más vendidos</h2>
          <ListaBarras
            items={data.colores}
            label={(c) => c.color}
            valor={(c) => c.unidades}
            swatch={(c) => c.color}
          />
        </div>
        <div className="met__card">
          <h2>Alertas</h2>
          <Alertas alertas={data.alertas} />
        </div>
      </div>

      <div className="met__card">
        <h2>Rendimiento por producto</h2>
        {!tabla.length ? (
          <p className="met__vacio">Todavía no hay productos.</p>
        ) : (
          <div className="met__tabla-wrap">
            <table className="met__tabla">
              <thead>
                <tr>
                  {COLUMNAS.map((c) => (
                    <th
                      key={c.key}
                      className={orden.col === c.key ? "is-sorted" : ""}
                      onClick={() => ordenarPor(c.key)}
                    >
                      {c.label}
                      {orden.col === c.key ? (orden.dir === "asc" ? " ↑" : " ↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tabla.map((p) => (
                  <tr key={p.id} className={p.estado ? "" : "met__tr-inactivo"}>
                    <td>
                      <div className="met__td-prod">
                        {p.imagen ? (
                          <img src={p.imagen} alt="" />
                        ) : (
                          <div className="met__td-ph">{p.nombre?.charAt(0)}</div>
                        )}
                        <span>{p.nombre}</span>
                      </div>
                    </td>
                    <td className={`met__td-stock ${p.diasStock !== null && p.diasStock < 14 ? "is-riesgo" : ""}`}>
                      {fmtNum(p.stock)}
                      {p.diasStock !== null && <small>~{p.diasStock} días</small>}
                    </td>
                    <td>{fmtNum(p.vistas)}</td>
                    <td>{fmtNum(p.clics)}</td>
                    <td>{fmtNum(p.ventas)}</td>
                    <td>{fmtPct(p.conversion)}</td>
                    <td>{fmtNum(p.favoritos)}</td>
                    <td>{fmtPct(p.recomendacion)}</td>
                    <td className="met__td-ing">{fmtARS(p.ingresos)}</td>
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