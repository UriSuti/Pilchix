function CarruselFachadaLocal() {
  return (
    <section className="carrusel-fachada-local">
      {/* Header */}
      <header className="header-local">
        <div className="logo">PILCHIX</div>

        <div className="barra-busqueda">
          <input type="text" placeholder="Buscar productos..." />
        </div>

        <div className="iconos-header">
          <span>🛒</span>
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>

      {/* Imagen principal */}
      <div className="imagen-fachada">
        <img
          src="/src/assets/fachada-nike.jpg"
          alt="Fachada del local"
        />
      </div>
    </section>
  );
}

export default CarruselFachadaLocal;