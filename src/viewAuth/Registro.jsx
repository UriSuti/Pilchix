import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../header_footer/Header/Header.jsx";
import Footer from "../header_footer/Footer/Footer.jsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext.jsx";
import { subirFotoPerfil } from "../services/storage";
import { actualizarFotoPerfil } from "../services/auth";
import "./auth.css";

function Registro() {
    const navigate = useNavigate();
    const { register, actualizarUsuarioLocal } = useAuth();
    const { mostrarToast } = useToast();

    const [form, setForm] = useState({ nombre: "", email: "", contraseña: "", confirmar: "" });
    const [foto, setFoto] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const setCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

    const handleFoto = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        setFoto(archivo);
        setPreviewFoto(URL.createObjectURL(archivo));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.contraseña !== form.confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setEnviando(true);
        try {
            const { ok, error, usuario } = await register({
            nombre: form.nombre.trim(),
            email: form.email.trim(),
            contraseña: form.contraseña,
            });

            if (!ok) {
            setError(error);
            return;
            }

            if (foto) {
            const { url, error: errorFoto } = await subirFotoPerfil(usuario.id_usuario, foto);
            if (errorFoto) {
                mostrarToast("Cuenta creada, pero no se pudo subir la foto", "error");
            } else {
                const { usuario: usuarioConFoto } = await actualizarFotoPerfil(usuario.id_usuario, url);
                if (usuarioConFoto) actualizarUsuarioLocal(usuarioConFoto);
            }
            }

            mostrarToast("Cuenta creada correctamente", "exito");
            navigate("/");
        } catch (err) {
            setError("Ocurrió un error inesperado. Probá de nuevo.");
            mostrarToast("No se pudo completar el registro", "error");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="auth-page">
        <Header />
        <main className="auth-main">
            <h1 className="auth-hero">DONDE LAS MARCAS<br />SE ENCUENTRAN CON VOS</h1>

            <form className="auth-card" onSubmit={handleSubmit}>
            <h2 className="auth-card__title">CREAR CUENTA</h2>

            <label className="auth-field"><span>* Nombre</span>
                <input value={form.nombre} onChange={setCampo("nombre")} required /></label>
            <label className="auth-field"><span>* Correo electrónico</span>
                <input type="email" value={form.email} onChange={setCampo("email")} required /></label>
            <label className="auth-field"><span>* Contraseña</span>
                <input type="password" value={form.contraseña} onChange={setCampo("contraseña")} required /></label>
            <label className="auth-field"><span>* Confirmar contraseña</span>
                <input type="password" value={form.confirmar} onChange={setCampo("confirmar")} required /></label>

            <label className="auth-field">
                <span>Foto de perfil (opcional)</span>
                <input type="file" accept="image/*" onChange={handleFoto} />
            </label>

            {previewFoto && (
                <img src={previewFoto} alt="Vista previa" className="auth-preview-foto" />
            )}

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit" disabled={enviando}>
                {enviando ? "Creando..." : "CREAR CUENTA"}
            </button>

            <p className="auth-switch">¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
            </form>
        </main>
        <Footer />
        </div>
    );
}

export default Registro;