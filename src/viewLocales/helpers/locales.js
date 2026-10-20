import { getImagenPortada } from "../../utils/producto";

export const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    Number(v || 0)
  );

export const inicial = (nombre = "") => nombre.trim().slice(0, 1).toUpperCase();

const sumar = (filas = [], campo) => filas.reduce((s, f) => s + Number(f[campo] || 0), 0);

// "YYYY-MM-DD" del día local (las fechas de Descuento vienen como date)
function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function descuentoVigente(descuentos = [], hoy) {
  return descuentos.find(
    (d) => (!d.fecha_inicio || d.fecha_inicio.slice(0, 10) <= hoy) && (!d.fecha_fin || d.fecha_fin.slice(0, 10) >= hoy)
  );
}

// categorías ordenadas por cuántas prendas del local las usan
function categoriasDelLocal(marca, productos) {
  const conteo = new Map();
  const sumarCat = (nombre, peso) => nombre && conteo.set(nombre, (conteo.get(nombre) || 0) + peso);
  productos.forEach((p) => p.categorias.forEach((c) => sumarCat(c, 1)));
  (marca.Marca_Categoria || []).forEach((mc) => sumarCat(mc.Categoria?.nombre, 0));
  return [...conteo.entries()].sort((a, b) => b[1] - a[1]).map(([nombre]) => nombre);
}

// Deja cada local de GET /locales listo para la vista. Los campos de
// presentación (frase, anio_fundacion, horarios, envio, solo_online, estilos)
// pueden no venir: quedan en null y la UI no los muestra.
export function normalizarLocal(marca) {
  const hoy = hoyISO();
  const productos = (marca.Producto || [])
    .filter((p) => p.estado === true || p.estado === 1)
    .map((p) => {
      const desc = descuentoVigente(p.Descuento, hoy);
      return {
        id: p.id_producto,
        nombre: p.nombre,
        precio: desc?.precio_final ?? p.precio,
        precioAnterior: desc ? p.precio : null,
        imagen: getImagenPortada(p.Imagen)?.imagen ?? null,
        fechaAlta: p.fecha_alta,
        vistas: sumar(p.Metrica_Producto, "visualizaciones"),
        ventas: sumar(p.Metrica_Producto, "ventas"),
        opiniones: p.Opinion || [],
        categorias: (p.Producto_Categoria || []).map((pc) => pc.Categoria?.nombre).filter(Boolean),
      };
    });

  // lo más vendido primero; a igualdad de ventas, lo más visto
  const destacados = [...productos].sort((a, b) => b.ventas - a.ventas || b.vistas - a.vistas);
  const opiniones = productos.flatMap((p) => p.opiniones);
  const recomiendan = opiniones.filter((o) => o.recomienda).length;
  const categorias = categoriasDelLocal(marca, productos);
  const estilos = Array.isArray(marca.estilos) && marca.estilos.length ? marca.estilos : [];
  const ubic = marca.ubicacion?.trim() || "";
  // "Sin especificar" es el valor por defecto del registro; "Online" lo cargan
  // las marcas sin local a la calle (no es un barrio)
  const ubicacionOnline = ubic.toLowerCase() === "online";
  const ubicacion = ubic && !ubicacionOnline && ubic.toLowerCase() !== "sin especificar" ? ubic : null;

  return {
    id: marca.id_marca,
    nombre: marca.nombre,
    descripcion: marca.descripcion || null,
    logo: marca.logo || null,
    fachada: marca.imagen_fachada || null,
    ubicacion,
    instagram: marca.instagram || null,
    frase: marca.frase || null,
    anioFundacion: marca.anio_fundacion || null,
    horarios: marca.horarios || null,
    envio: marca.envio || null,
    soloOnline: marca.solo_online === true || ubicacionOnline,
    estilos,
    categorias,
    // lo que se muestra como "etiquetas de estilo": las que eligió la marca o, si no, sus categorías
    etiquetas: estilos.length ? estilos : categorias.slice(0, 3),
    productos: destacados.filter((p) => p.imagen),
    cantidadProductos: productos.length,
    vistas: productos.reduce((s, p) => s + p.vistas, 0),
    opiniones: opiniones.length,
    recomendacion: opiniones.length ? Math.round((recomiendan / opiniones.length) * 100) : null,
  };
}

export function estadisticas(locales) {
  const barrios = new Set(locales.map((l) => l.ubicacion?.toLowerCase()).filter(Boolean));
  return {
    locales: locales.length,
    prendas: locales.reduce((s, l) => s + l.cantidadProductos, 0),
    barrios: barrios.size,
  };
}

const normalizarTexto = (t = "") =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// busca por nombre, barrio o estilo (estilos elegidos + categorías de prendas)
export function coincide(local, q) {
  const t = normalizarTexto(q.trim());
  if (!t) return true;
  return [local.nombre, local.ubicacion, local.frase, ...local.estilos, ...local.categorias]
    .filter(Boolean)
    .some((campo) => normalizarTexto(campo).includes(t));
}

// más vistos primero; a igualdad, los que tienen más prendas
export const ordenarDestacados = (locales) =>
  [...locales].sort((a, b) => b.vistas - a.vistas || b.cantidadProductos - a.cantidadProductos);

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// "abierto" | "cerrado" | "online" | null (sin horarios cargados no se afirma nada)
export function estadoApertura(local, ahora = new Date()) {
  if (local.soloOnline) return "online";
  const hoy = local.horarios?.[ahora.getDay()];
  if (!local.horarios) return null;
  if (!hoy) return "cerrado";
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const abre = aMinutos(hoy.abre);
  const cierra = aMinutos(hoy.cierra);
  // horario que pasa la medianoche (ej. 18:00 a 02:00)
  const abierto = cierra > abre ? min >= abre && min < cierra : min >= abre || min < cierra;
  return abierto ? "abierto" : "cerrado";
}

export const ETIQUETA_APERTURA = {
  abierto: "Abierto ahora",
  cerrado: "Cerrado",
  online: "Solo online",
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// "Hoy 10:00–20:00" o "Hoy cerrado"; null si no hay horarios
export function horarioDeHoy(local, ahora = new Date()) {
  if (!local.horarios) return null;
  const hoy = local.horarios[ahora.getDay()];
  return hoy ? `Hoy ${hoy.abre}–${hoy.cierra}` : `${DIAS[ahora.getDay()]}: cerrado`;
}

