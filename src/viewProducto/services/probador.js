import { apiFetchForm, tokenStore } from "../../services/api";

// devuelve { imagen: "<data uri o url del resultado>" }; lanza si falla
// (incluido el caso "llegaste al límite de hoy", con status 429)
export function generarPruebaVirtual(idProducto, archivoFoto) {
  const formData = new FormData();
  formData.append("foto", archivoFoto);
  return apiFetchForm(`/probador/${idProducto}`, {
    method: "POST",
    formData,
    token: tokenStore.getUsuario(),
  });
}
