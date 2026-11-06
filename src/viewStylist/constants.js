// tienen que coincidir con los valores que acepta el backend (stylist.service.js)
export const OCASIONES = [
  { valor: "Uso diario" },
  { valor: "Trabajo" },
  { valor: "Salida / Noche" },
  { valor: "Evento especial" },
];
export const ESTILOS = ["Urbano", "Minimalista", "Deportivo", "Formal", "Casual", "Vintage"];
export const CALCES = ["Holgada", "Regular", "Ajustada"];
// sin género elegido (null) = todas las prendas; el backend clasifica cada una por su foto
export const GENEROS = [
  { valor: "Femenino", label: "Femenina", icono: "mujer" },
  { valor: "Masculino", label: "Masculina", icono: "hombre" },
];

// paleta base de "Colores preferidos"; con el "+" se pueden sumar otros
export const PALETA = [
  { hex: "#000000", nombre: "Negro" },
  { hex: "#ffffff", nombre: "Blanco" },
  { hex: "#9a9a9a", nombre: "Gris" },
  { hex: "#d6c4ad", nombre: "Beige" },
  { hex: "#556b2f", nombre: "Verde oliva" },
  { hex: "#0b4cbf", nombre: "Azul" },
  { hex: "#f2763f", nombre: "Naranja" },
  { hex: "#bf5fd0", nombre: "Violeta" },
];

export const PREFERENCIAS_INICIALES = {
  ocasion: "Uso diario",
  estilos: ["Urbano", "Minimalista"],
  presupuesto: 100000,
  colores: [], // siempre arrancan sin elegir
  calce: "Holgada",
  genero: null,
};

export const PASOS = ["Preferencias", "Resultados", "Tu look"];

export const TIPOS_OUTFIT = {
  economico: { label: "Económico" },
  tu_estilo: { label: "Tu estilo" },
  original: { label: "Original" },
};

export const CAMBIOS_RAPIDOS = ["Algo más barato", "Otro color", "Más abrigado", "Más formal"];

export const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));
