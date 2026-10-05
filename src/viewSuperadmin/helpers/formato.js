export const formatARS = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(v || 0));

export const formatFecha = (f) =>
  new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
