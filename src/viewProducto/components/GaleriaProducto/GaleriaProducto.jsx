import './GaleriaProducto.css'
import { useState } from 'react'
import nike from '../../../assets/nike.webp'
import { getImagenesPorColor } from '../../../utils/producto'

const IconReloj = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

function GaleriaProducto({ producto, loading, selectedColor }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [claveGaleria, setClaveGaleria] = useState(null)

  const imagenes = producto
    ? [...getImagenesPorColor(producto.Imagen, selectedColor)].sort(
        (a, b) => (b.es_portada ? 1 : 0) - (a.es_portada ? 1 : 0)
      )
    : []

  // reinicia la imagen activa cuando cambia el producto o el color elegido
  const claveActual = `${producto?.id_producto ?? ''}|${selectedColor ?? ''}`
  if (claveActual !== claveGaleria) {
    setClaveGaleria(claveActual)
    setActiveIndex(0)
  }

  if (loading) {
    return <section className="galeria-producto">Cargando...</section>
  }

  if (!producto) {
    return <section className="galeria-producto">Producto no encontrado</section>
  }

  const irAnterior = () => setActiveIndex((i) => (i - 1 + imagenes.length) % imagenes.length)
  const irSiguiente = () => setActiveIndex((i) => (i + 1) % imagenes.length)

  return (
    <section className="galeria-producto">
      <div className="galeria-producto__principal">
        {/* miniaturas */}
        <div className="galeria-producto__miniaturas">
          {imagenes.length > 0 ? (
            imagenes.map((img, i) => (
              <button
                key={img.id_imagen ?? i}
                type="button"
                className={`galeria-producto__miniatura ${i === activeIndex ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                <img src={img.imagen} alt={`Miniatura ${i + 1}`} />
              </button>
            ))
          ) : (
            <button type="button" className="galeria-producto__miniatura is-active">
              <img src={nike} alt="Miniatura" />
            </button>
          )}
        </div>

        {/* imagen principal */}
        <div className="galeria-producto__imagen">
          <img src={imagenes[activeIndex]?.imagen || nike} alt={producto.nombre} />

          {imagenes.length > 1 && (
            <div className="galeria-producto__flechas">
              <button type="button" aria-label="Imagen anterior" onClick={irAnterior}>‹</button>
              <button type="button" aria-label="Imagen siguiente" onClick={irSiguiente}>›</button>
            </div>
          )}
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
