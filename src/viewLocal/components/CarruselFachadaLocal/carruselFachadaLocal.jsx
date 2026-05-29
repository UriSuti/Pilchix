import './carruselFachadaLocal.css'


function CarruselFachadaLocal({marca}) {
  
  return (
    <section className="carrusel-fachada-local">
      {/* Header */}
      <header className="header-local">
        <div className="logo">PILCHIX</div>

        <div className="barra-busqueda">
          <input type="text" placeholder="Buscar productos..." />
        </div>

        <div className="iconos-header">
          <span className="material-symbols-outlined"></span>
          <span className="material-symbols-outlined"></span>
          <span className="material-symbols-outlined"></span>
        </div>
      </header>

      {/* Imagen principal */}
      <div className="imagen-fachada">
        <img
          src={marca}
          alt="Fachada del local"
        />
      </div>
    </section>
  );
}

export default CarruselFachadaLocal;