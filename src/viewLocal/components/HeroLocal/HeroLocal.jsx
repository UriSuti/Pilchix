import './HeroLocal.css'
import fallback from '../../../assets/LandingImage.jpg'

function HeroLocal({ marca, imagenFachada }) {
  const fondo = imagenFachada || fallback
  const nombre = marca?.nombre || ''
  const tagline = marca?.descripcion || ''
  const logo = marca?.logo

  return (
    <section className="hero-local">
      {/* imagen de fondo (fachada de la marca) */}
      <img className="hero-local__fondo" src={fondo} alt={`Fachada de ${nombre}`} />

      {/* panel con la info de la marca */}
      <div className="hero-local__panel">
        <div className="hero-local__marca-block">
          {logo && <img className="hero-local__logo" src={logo} alt={`Logo de ${nombre}`} />}
          <h1 className="hero-local__marca">{nombre}</h1>
        </div>

        {tagline && <p className="hero-local__tagline">{tagline}</p>}

        <button type="button" className="hero-local__cta">
          Ver colección
        </button>
      </div>
    </section>
  )
}

export default HeroLocal
