// imagen a mostrar como portada: la marcada explícitamente, o si no hay ninguna, la primera del array
export function getImagenPortada(imagenes) {
  if (!imagenes || imagenes.length === 0) return null;
  return imagenes.find((img) => img.es_portada) ?? imagenes[0];
}

// imágenes asociadas a un color; si no hay ninguna, caen a las generales (sin color); si tampoco hay, a todas
export function getImagenesPorColor(imagenes, color) {
  if (!imagenes || imagenes.length === 0) return [];
  if (color) {
    const delColor = imagenes.filter((img) => img.color === color);
    if (delColor.length > 0) return delColor;
  }
  const generales = imagenes.filter((img) => !img.color);
  if (generales.length > 0) return generales;
  return imagenes;
}
