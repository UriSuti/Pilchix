import './InfoProducto.css'
import { useEffect, useState } from 'react'
import SelectorColor from '../SelectorColor/SelectorColor.jsx'
import SelectorTalle from '../SelectorTalle/SelectorTalle.jsx'

function formatearPrecio(valor) {
  if (valor == null) return ''
  return '$' + Number(valor).toLocaleString('es-AR')
}

const IconCorazon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

function InfoProducto({ producto, loading }) {
  if (loading) {
    return <section className="info-producto">Cargando...</section>
  }

  if (!producto) {
    return <section className="info-producto">Producto no encontrado</section>
  }

  const productId = producto?.id_producto ?? producto?.id ?? producto?.id_marca ?? 'unknown'

  const storageKey = `productSelection_${productId}`

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedTalle, setSelectedTalle] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        setSelectedColor(parsed.color ?? null)
        setSelectedTalle(parsed.talle ?? null)
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey])

  const saveSelection = (color, talle) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color, talle }))
    } catch (e) {
      console.warn('No se pudo guardar selección en localStorage', e)
    }
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    saveSelection(color, selectedTalle)
  }

  const handleTalleChange = (talle) => {
    setSelectedTalle(talle)
    saveSelection(selectedColor, talle)
  }

  const handleAgregarCarrito = () => {
    const cartKey = 'cart'
    try {
      const raw = localStorage.getItem(cartKey)
      const cart = raw ? JSON.parse(raw) : []

      const newItem = {
        id: producto.id_producto ?? producto.id ?? producto.id_marca ?? null,
        nombre: producto.nombre,
        precio: producto.precio,
        color: selectedColor,
        talle: selectedTalle,
        cantidad: 1,
        imagen: producto.Imagen?.[0]?.imagen ?? null,
      }

      cart.push(newItem)
      localStorage.setItem(cartKey, JSON.stringify(cart))
      // optionally: show a toast or feedback
      console.log('Añadido al carrito', newItem)
    } catch (e) {
      console.error('Error agregando al carrito', e)
    }
  }

  return (
    <section className="info-producto">
      {/* encabezado: titulo + favorito */}
      <div className="info-producto__encabezado">
        <div>
          <h1 className="info-producto__titulo">{producto.nombre}</h1>
          {producto.descripcion && (
            <p className="info-producto__subtitulo">{producto.descripcion}</p>
          )}
        </div>

        <button type="button" className="info-producto__favorito" aria-label="Guardar en favoritos">
          <IconCorazon />
        </button>
      </div>

      {/* precio */}
      <div className="info-producto__precio">
        <span className="info-producto__precio-actual">{formatearPrecio(producto.precio)}</span>
      </div>

      {/* colores */}
      <SelectorColor colores={producto?.colores} value={selectedColor} onChange={handleColorChange} />

      {/* talles */}
      <SelectorTalle guiaTalles={producto?.guia_talles} value={selectedTalle} onChange={handleTalleChange} />

      {/* carrito */}
      <button type="button" className="info-producto__carrito" onClick={handleAgregarCarrito}>
        AGREGAR AL CARRITO
      </button>

      {/* link */}
      <a className="info-producto__link" href="#">
        Leer más sobre el producto
      </a>
    </section>
  )
}

export default InfoProducto
