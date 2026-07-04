import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import "./Footer.css";

const IconInstagram = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
)
const IconTikTok = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
  </svg>
)
const IconWhatsApp = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
)
const IconX = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

const INSTAGRAM_URL = "https://www.instagram.com/pilchix/";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Footer() {
  const { mostrarToast } = useToast();
  const [email, setEmail] = useState("");

  // links que todavía no tienen página: no rompemos la navegación (no saltan
  // arriba), avisamos con un toast.
  const proximamente = (e) => {
    e.preventDefault();
    mostrarToast("Próximamente 🙂", "info");
  };

  const suscribir = () => {
    if (!EMAIL_RE.test(email.trim())) {
      mostrarToast("Ingresá un email válido", "error");
      return;
    }
    mostrarToast("¡Listo! Te suscribiste a las novedades 🎉", "exito");
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* Brand column */}
        <div className="site-footer__brand-col">
          <div className="site-footer__logo">PILCHIX</div>
          <p className="site-footer__tagline">Moda y estilo para quienes marcan tendencia.</p>
          <div className="site-footer__socials" aria-label="Redes sociales">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram /></a>
            <a href="#" onClick={proximamente} aria-label="TikTok"><IconTikTok /></a>
            <a href="#" onClick={proximamente} aria-label="WhatsApp"><IconWhatsApp /></a>
            <a href="#" onClick={proximamente} aria-label="X"><IconX /></a>
          </div>
        </div>

        {/* Sobre Pilchix */}
        <div className="site-footer__col">
          <h4>Sobre Pilchix</h4>
          <a href="#" onClick={proximamente}>Descargar app</a>
          <a href="#" onClick={proximamente}>Nosotros</a>
          <a href="#" onClick={proximamente}>Empleos</a>
          <a href="#" onClick={proximamente}>Blog</a>
        </div>

        {/* Unite a Pilchix */}
        <div className="site-footer__col">
          <h4>Unite a Pilchix</h4>
          <a href="#" onClick={proximamente}>Registrá tu local</a>
          <a href="#" onClick={proximamente}>Vender en Pilchix</a>
          <a href="#" onClick={proximamente}>Programa de afiliados</a>
        </div>

        {/* Ayuda */}
        <div className="site-footer__col">
          <h4>Ayuda</h4>
          <a href="#" onClick={proximamente}>Preguntas frecuentes</a>
          <a href="#" onClick={proximamente}>Envíos y entregas</a>
          <a href="#" onClick={proximamente}>Devoluciones</a>
          <a href="#" onClick={proximamente}>Contacto</a>
        </div>

        {/* Newsletter */}
        <div className="site-footer__newsletter">
          <h4>Recibí novedades</h4>
          <p>Suscribite y enterate de lanzamientos y promociones exclusivas.</p>
          <form
            className="site-footer__newsletter-form"
            onSubmit={(e) => { e.preventDefault(); suscribir(); }}
          >
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <button type="submit" aria-label="Suscribirse"><IconArrow /></button>
          </form>
        </div>

      </div>

      <div className="site-footer__bottom">
        <span>© 2024 Pilchix. Todos los derechos reservados.</span>
        <div className="site-footer__bottom-links">
          <a href="#" onClick={proximamente}>Términos y condiciones</a>
          <a href="#" onClick={proximamente}>Política de privacidad</a>
          <a href="#" onClick={proximamente}>Política de cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
