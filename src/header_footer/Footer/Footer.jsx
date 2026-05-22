import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">PILCHIX</div>

      <div className="site-footer__socials" aria-label="Redes sociales">
        <a href="/" aria-label="Instagram">◎</a>
        <a href="/" aria-label="TikTok">◉</a>
        <a href="/" aria-label="WhatsApp">◌</a>
        <a href="/" aria-label="X">✕</a>
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
