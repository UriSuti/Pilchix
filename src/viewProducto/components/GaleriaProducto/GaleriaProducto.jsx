import './GaleriaProducto.css'
import nike from '../../../assets/nike.webp'

const IconReloj = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

function GaleriaProducto() {
  return (
    <section className="galeria-producto">
      <div className="galeria-producto__principal">
        {/* miniaturas */}
        <div className="galeria-producto__miniaturas">
          <button type="button" className="galeria-producto__miniatura is-active">
            <img src={nike} alt="Miniatura 1" />
          </button>
          <button type="button" className="galeria-producto__miniatura">
            <img src={nike} alt="Miniatura 2" />
          </button>
          <button type="button" className="galeria-producto__miniatura">
            <img src={nike} alt="Miniatura 3" />
          </button>
          <button type="button" className="galeria-producto__miniatura">
            <img src={nike} alt="Miniatura 4" />
          </button>
          <button type="button" className="galeria-producto__miniatura">
            <img src={nike} alt="Miniatura 5" />
          </button>
        </div>

        {/* imagen principal */}
        <div className="galeria-producto__imagen">
          <img src={nike} alt="Imagen del producto" />

          <div className="galeria-producto__flechas">
            <button type="button" aria-label="Imagen anterior">‹</button>
            <button type="button" aria-label="Imagen siguiente">›</button>
          </div>
        </div>
      </div>

      {/* banner de horario */}
      <div className="galeria-producto__horario">
        <IconReloj />
        <span>ACERCATE HOY 11:00 - 21:00</span>
      </div>
    </section>
  )
}

export default GaleriaProducto
