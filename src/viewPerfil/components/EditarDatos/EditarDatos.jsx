import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext.jsx";
import { subirFotoPerfil } from "../../../services/storage";
import { actualizarDatosUsuario } from "../../../services/auth";
import "./EditarDatos.css";

function EditarDatos() {
  const { usuario, idUsuario, actualizarUsuarioLocal } = useAuth();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? "",
    email: usuario?.email ?? "",
  });
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(usuario?.foto_perfil ?? null);
  const [guardando, setGuardando] = useState(false);

  const setCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setFoto(archivo);
    setPreviewFoto(URL.createObjectURL(archivo));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const datos = { nombre: form.nombre.trim(), email: form.email.trim() };

      // si eligió foto nueva, la sube y agrega la URL
      if (foto) {
        const { url, error: errorFoto } = await subirFotoPerfil(idUsuario, foto);
        if (errorFoto) {
          mostrarToast("No se pudo subir la foto", "error");
        } else {
          datos.foto_perfil = url;
        }
      }

      const { usuario: actualizado, error } = await actualizarDatosUsuario(idUsuario, datos);
      if (error) {
        mostrarToast(error, "error");
        return;
      }

      actualizarUsuarioLocal(actualizado); // refresca context + header
      setFoto(null);
      mostrarToast("Datos actualizados", "exito");
    } catch (err) {
      mostrarToast("Ocurrió un error inesperado", "error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="editar-datos" onSubmit={handleGuardar}>
      <div className="editar-datos__foto">
        {previewFoto ? (
          <img src={previewFoto} alt="Foto de perfil" className="editar-datos__avatar" />
        ) : (
          <div className="editar-datos__avatar editar-datos__avatar--placeholder">
            {form.nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <label className="editar-datos__cambiar-foto">
          Cambiar foto
          <input type="file" accept="image/*" onChange={handleFoto} hidden />
        </label>
      </div>

      <label className="editar-datos__field">
        <span>Nombre</span>
        <input value={form.nombre} onChange={setCampo("nombre")} required />
      </label>

      <label className="editar-datos__field">
        <span>Correo electrónico</span>
        <input type="email" value={form.email} onChange={setCampo("email")} required />
      </label>

      <button className="editar-datos__btn" type="submit" disabled={guardando}>
        {guardando ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

export default EditarDatos;