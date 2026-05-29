import './carruselFachadaLocal.css'


function CarruselFachadaLocal({marca}) {
  
  return (
    <section className="carrusel-fachada-local">
      
      

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