import './InfoProducto.css'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { agregarAlCarrito } from '../../../viewCarrito/services/cart'
import SelectorColor from '../SelectorColor/SelectorColor.jsx'
import SelectorTalle from '../SelectorTalle/SelectorTalle.jsx'
import BotonFavorito from '../../../viewLocal/components/BotonFavorito/BotonFavorito.jsx'

function formatearPrecio(valor) {
  if (valor == null) return ''
  return '$' + Number(valor).toLocaleString('es-AR')
}

function InfoProducto({ producto, loading, selectedColor, selectedTalle, onColorChange, onTalleChange }) {
  const [agregando, setAgregando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { estaLogueado, idUsuario } = useAuth()
  const { mostrarToast } = useToast()

  if (loading) {
    return <section className="info-producto">Cargando...</section>
  }

  if (!producto) {
    return <section className="info-producto">Producto no encontrado</section>
  }

  const handleAgregarCarrito = async () => {
    if (!selectedColor || !selectedTalle) {
      mostrarToast('Seleccioná talle y color antes de agregar', 'info')
      return
    }

    if (!estaLogueado) {
      mostrarToast('Iniciá sesión para agregar al carrito', 'info')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setAgregando(true)
    try {
      await agregarAlCarrito({
        idUsuario,
        idProducto: producto.id_producto ?? producto.id ?? producto.id_marca ?? null,
        cantidad: 1,
        precioUnitario: producto.precio,
        talle: selectedTalle,
        color: selectedColor,
      })
      mostrarToast('Producto agregado al carrito', 'exito')
    } catch (e) {
      console.error('Error agregando al carrito', e)
      mostrarToast('Ocurrió un error al agregar al carrito', 'error')
    } finally {
      setAgregando(false)
    }
  }

  return (
    <section className="info-producto">
      <div className="info-producto__encabezado">
        <div>
          <h1 className="info-producto__titulo">{producto.nombre}</h1>
          {producto.descripcion && (
            <p className="info-producto__subtitulo">{producto.descripcion}</p>
          )}
        </div>

        <BotonFavorito idProducto={producto.id_producto} />
      </div>

      <div className="info-producto__precio">
        <span className="info-producto__precio-actual">{formatearPrecio(producto.precio)}</span>
      </div>

      <SelectorColor colores={producto?.colores} value={selectedColor} onChange={onColorChange} />

      <SelectorTalle guiaTalles={producto?.guia_talles} value={selectedTalle} onChange={onTalleChange} />

      <button type="button" className="info-producto__carrito" onClick={handleAgregarCarrito} disabled={agregando}>
        {agregando ? 'AGREGANDO...' : 'AGREGAR AL CARRITO'}
      </button>

      <a className="info-producto__link" href="#">
        Leer más sobre el producto
      </a>
    </section>
  )
}

export default InfoProducto
