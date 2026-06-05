import "./Footer.css";

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const IconTikTok = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">PILCHIX</div>

      <div className="site-footer__socials" aria-label="Redes sociales">
        <a href="/" aria-label="Instagram"><IconInstagram /></a>
        <a href="/" aria-label="TikTok"><IconTikTok /></a>
        <a href="/" aria-label="WhatsApp"><IconWhatsApp /></a>
        <a href="/" aria-label="X"><IconX /></a>
      </div>

      <div className="site-footer__columns">
        <div>
          <h3>Sobre Pilchix</h3>
          <a href="/">Descargar app</a>
          <a href="/">Nosotros</a>
          <a href="/">Empleos</a>
        </div>
        <div>
          <h3>Unite a Pilchix</h3>
          <a href="/">Registrá tu local</a>
        </div>
        <div>
          <h3>Ayuda</h3>
          <a href="/">Preguntas frecuentes</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;