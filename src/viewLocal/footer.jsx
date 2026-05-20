import "./footer.css"

function Footer() {
  return (
    <footer className="footer">
      {/* Logo */}
      <div className="footer-logo">
        <h2>PILCHIX</h2>
      </div>

      {/* Redes sociales */}
      <div className="footer-redes">
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
        <a href="#">WhatsApp</a>
        <a href="#">X</a>
      </div>

      {/* Columnas */}
      <div className="footer-columnas">
        <div className="footer-columna">
          <h4>Sobre Pilchix</h4>
          <ul>
            <li><a href="#">Descargar app</a></li>
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Empleos</a></li>
          </ul>
        </div>

        <div className="footer-columna">
          <h4>Unite a Pilchix</h4>
          <ul>
            <li><a href="#">Registra tu local</a></li>
          </ul>
        </div>

        <div className="footer-columna">
          <h4>Ayuda</h4>
          <ul>
            <li><a href="#">Preguntas frecuentes</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;