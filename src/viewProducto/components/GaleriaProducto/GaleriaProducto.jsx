import './GaleriaProducto.css'
import { useState } from 'react'
import nike from '../../../assets/nike.webp'
import { getImagenesPorColor } from '../../../utils/producto'

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
    return <section className="ipgal ipgal--estado">Cargando…</section>
  }

  if (!producto) {
    return <section className="ipgal ipgal--estado">Producto no encontrado</section>
  }

  const lista = imagenes.length > 0 ? imagenes : [{ imagen: nike, id_imagen: 'fallback' }]
  const principal = lista[activeIndex]?.imagen || nike

  return (
    <section className="ipgal">
      {/* miniaturas */}
      <div className="ipgal__thumbs">
        {lista.map((img, i) => (
          <button
            key={img.id_imagen ?? i}
            type="button"
            className={`ipgal__thumb ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <img src={img.imagen} alt={`Vista ${i + 1} de ${producto.nombre}`} />
          </button>
        ))}
      </div>

      {/* imagen principal */}
      <div className="ipgal__main">
        <img src={principal} alt={producto.nombre} />
      </div>
    </section>
  )
}

export default GaleriaProducto
