// baja la imagen como blob, sirva para URL remota, base64 o blob
async function aBlob(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error("No se pudo obtener la imagen");
  return res.blob();
}

export async function descargarImagen(src, nombre = "pilchix-probador.png") {
  let url = src;
  let revocar = false;

  // las data: y blob: se descargan directo; las URLs remotas hay que bajarlas primero
  if (!src.startsWith("data:") && !src.startsWith("blob:")) {
    try {
      url = URL.createObjectURL(await aBlob(src));
      revocar = true;
    } catch {
      window.open(src, "_blank"); // si el servidor no deja (CORS), al menos se abre
      return;
    }
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (revocar) setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function compartirImagen(src, nombre = "pilchix-probador.png") {
  const blob = await aBlob(src);
  const file = new File([blob], nombre, { type: blob.type || "image/png" });
  if (!navigator.canShare?.({ files: [file] })) return false;
  await navigator.share({ files: [file], title: "Mi look en Pilchix" });
  return true;
}

export const puedeCompartir = () => typeof navigator !== "undefined" && !!navigator.share;