/* ---------- TALLES SUGERIDOS POR CATEGORÍA ---------- */
export const PRESETS_TALLES = {
  calzado:  ["35","36","37","38","39","40","41","42","43","44","45"],
  numerico: ["38","40","42","44","46","48","50"],
  letras:   ["XS","S","M","L","XL","XXL"],
};

const MAPA_CATEGORIA = {
  calzado: "calzado",
  jeans: "numerico",
  pantalones: "numerico",
  shorts: "letras",
  remeras: "letras",
  buzos: "letras",
  camperas: "letras",
  hoodies: "letras",
  camisas: "letras",
};

export function tallesSugeridos(nombresCategorias = []) {
  for (const nombre of nombresCategorias) {
    const clave = MAPA_CATEGORIA[nombre.trim().toLowerCase()];
    if (clave) return PRESETS_TALLES[clave];
  }
  return null;
}

/* ---------- COLORES: distancia y color más cercano ---------- */
function hexARgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

export function distanciaColor(a, b) {
  const [r1,g1,b1] = hexARgb(a);
  const [r2,g2,b2] = hexARgb(b);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

// devuelve el color de la paleta más parecido, o null si ninguno se acerca lo suficiente
export function colorMasCercano(hex, paleta, umbral = 60) {
  let mejor = null, mejorDist = Infinity;
  for (const c of paleta) {
    const d = distanciaColor(hex, c);
    if (d < mejorDist) { mejorDist = d; mejor = c; }
  }
  return mejorDist <= umbral ? mejor : null;
}

/* ---------- DESCRIPCIÓN AUTOGENERADA ---------- */
function listar(arr) {
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1];
}

export function generarDescripcion({ nombre, categorias = [], etiquetas = [], talles = [], colores = [] }) {
  const partes = [];
  const cat = categorias[0];
  partes.push(cat ? `${nombre}: ${cat.toLowerCase()} de nuestra colección.` : `${nombre}, de nuestra colección.`);
  if (etiquetas.length) partes.push(`Ideal para ${listar(etiquetas.map((e) => e.toLowerCase()))}.`);
  if (talles.length) {
    partes.push(talles.length > 1
      ? `Disponible en talles ${talles.join(", ")}.`
      : `Disponible en talle ${talles[0]}.`);
  }
  if (colores.length > 1) partes.push(`Se consigue en ${colores.length} colores.`);
  return partes.join(" ");
}