// Parseo de `guia_talles` (viene en formatos variados desde la base):
// null | JSON string | ["S","M"] | [{US:[...]}] | {US:[...], EU:[...]}
export function parseTalles(guia) {
  let sizes = null;
  try {
    if (!guia) return [];
    sizes = typeof guia === "string" ? JSON.parse(guia) : guia;
  } catch {
    return [];
  }

  let opciones = [];
  const key = "US";

  if (Array.isArray(sizes)) {
    if (typeof sizes[0] === "string") {
      opciones = sizes;
    } else if (sizes[0] && typeof sizes[0] === "object") {
      opciones = sizes.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const vals = item[key] ?? Object.values(item)[0];
        if (Array.isArray(vals)) return vals;
        return vals ? [vals] : [];
      });
    }
  } else if (sizes && typeof sizes === "object") {
    opciones = Array.isArray(sizes[key])
      ? sizes[key]
      : Object.values(sizes).find((v) => Array.isArray(v)) || [];
  }

  return opciones.map((v) => (v == null ? "" : String(v).trim())).filter(Boolean);
}

// orden lógico de talles de ropa
const ORDEN_LETRAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// ordena una lista de talles: numéricos por valor, letras por su orden, resto alfabético
export function ordenarTalles(lista = []) {
  return [...lista].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    const aNum = !Number.isNaN(na);
    const bNum = !Number.isNaN(nb);
    if (aNum && bNum) return na - nb;
    if (aNum) return 1; // números después de letras
    if (bNum) return -1;
    const ia = ORDEN_LETRAS.indexOf(a.toUpperCase());
    const ib = ORDEN_LETRAS.indexOf(b.toUpperCase());
    if (ia !== -1 && ib !== -1) return ia - ib;
    return a.localeCompare(b);
  });
}
