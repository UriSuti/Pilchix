import './HeroLocal.css'
import fallback from '../../../assets/LandingImage.jpg'

function HeroLocal({ marca, imagenFachada, cantidadProductos = 0, children }) {
  const fondo = imagenFachada || fallback
  const nombre = marca?.nombre || ''
  const tagline = marca?.descripcion || ''
  const logo = marca?.logo
  const ubicacion = marca?.ubicacion

  return (
    <section className="hero-local">
      {/* fachada de la marca */}
      <img className="hero-local__fondo" src={fondo} alt={`Fachada de ${nombre}`} />

      <div className="hero-local__inner">
        <div className="hero-local__row">
          <div className="hero-local__brand">
            {logo && (
              <div className="hero-local__logo">
                <img src={logo} alt={`Logo de ${nombre}`} />
              </div>
            )}
            <div>
              <h1 className="hero-local__name">{nombre}</h1>
              {tagline && <p className="hero-local__tag">{tagline}</p>}
              <div className="hero-local__meta">
                <div>
                  <b>{cantidadProductos}</b>
                  <span>{cantidadProductos === 1 ? 'producto' : 'productos'}</span>
                </div>
                {ubicacion && (
                  <div>
                    <b>{ubicacion}</b>
                    <span>ubicación</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hero-local__actions">
            {children}
            <button
              type="button"
              className="hero-local__cta"
              onClick={() =>
                document
                  .getElementById('local-productos')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              Ver colección
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroLocal
