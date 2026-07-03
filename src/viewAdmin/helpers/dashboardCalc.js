// suma las métricas de un producto (puede tener varias filas por fecha)
function sumaMetricas(producto) {
  return (producto.Metrica_Producto ?? []).reduce(
    (acc, m) => ({
      visualizaciones: acc.visualizaciones + (m.visualizaciones || 0),
      clics: acc.clics + (m.clics || 0),
      ventas: acc.ventas + (m.ventas || 0),
    }),
    { visualizaciones: 0, clics: 0, ventas: 0 }
  );
}

// KPIs globales de la marca
export function calcularKPIs(productos) {
  let ingresos = 0, ventas = 0, visualizaciones = 0, activos = 0;

  for (const p of productos) {
    const m = sumaMetricas(p);
    ingresos += m.ventas * (Number(p.precio) || 0);
    ventas += m.ventas;
    visualizaciones += m.visualizaciones;
    if (p.estado) activos += 1;
  }
  return { ingresos, ventas, visualizaciones, activos };
}

// top productos por ingresos
export function topPorIngresos(productos, limite = 5) {
  return productos
    .map((p) => {
      const m = sumaMetricas(p);
      return {
        id: p.id_producto,
        nombre: p.nombre,
        imagen: p.Imagen?.[0]?.imagen ?? null,
        ventas: m.ventas,
        ingresos: m.ventas * (Number(p.precio) || 0),
      };
    })
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, limite);
}

// serie de ventas por fecha (para el gráfico)
export function ventasPorFecha(productos) {
  const mapa = {}; // fecha -> ventas
  for (const p of productos) {
    for (const m of p.Metrica_Producto ?? []) {
      if (!m.fecha) continue;
      mapa[m.fecha] = (mapa[m.fecha] || 0) + (m.ventas || 0);
    }
  }
  return Object.entries(mapa)
    .map(([fecha, ventas]) => ({ fecha, ventas }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// serie temporal con las 3 métricas por fecha (para el gráfico con selector)
export function serieTemporal(productos) {
  const mapa = {};
  for (const p of productos) {
    for (const m of p.Metrica_Producto ?? []) {
      if (!m.fecha) continue;
      if (!mapa[m.fecha]) mapa[m.fecha] = { fecha: m.fecha, ventas: 0, visualizaciones: 0, clics: 0 };
      mapa[m.fecha].ventas += m.ventas || 0;
      mapa[m.fecha].visualizaciones += m.visualizaciones || 0;
      mapa[m.fecha].clics += m.clics || 0;
    }
  }
  return Object.values(mapa).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// ventas agrupadas por categoría
export function ventasPorCategoria(productos) {
  const mapa = {};
  for (const p of productos) {
    const m = sumaMetricas(p);
    const cats = (p.Producto_Categoria ?? []).map((pc) => pc.Categoria?.nombre).filter(Boolean);
    for (const nombre of cats) {
      mapa[nombre] = (mapa[nombre] || 0) + m.ventas;
    }
  }
  return Object.entries(mapa)
    .map(([categoria, ventas]) => ({ categoria, ventas }))
    .sort((a, b) => b.ventas - a.ventas);
}

// filas para la tabla detallada
export function tablaProductos(productos) {
  return productos
    .map((p) => {
      const m = sumaMetricas(p);
      const conversion = m.visualizaciones > 0 ? (m.ventas / m.visualizaciones) * 100 : 0;
      return {
        id: p.id_producto,
        nombre: p.nombre,
        imagen: p.Imagen?.[0]?.imagen ?? null,
        stock: p.stock ?? 0,
        visualizaciones: m.visualizaciones,
        clics: m.clics,
        ventas: m.ventas,
        conversion,
        ingresos: m.ventas * (Number(p.precio) || 0),
      };
    })
    .sort((a, b) => b.ingresos - a.ingresos);
}