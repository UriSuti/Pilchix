import './InfoProducto.css'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
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

/* íconos estilo lucide (inline, como el resto de la app) */
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
)
const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
)
const IconReturn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

function Acordeon({ items }) {
  const [abierto, setAbierto] = useState(0)
  return (
    <div className="ipacc">
      {items.map((it, i) => (
        <div className="ipacc__item" key={i}>
          <button
            type="button"
            className="ipacc__q"
            onClick={() => setAbierto(abierto === i ? -1 : i)}
          >
            {it.q}
            <span>{abierto === i ? '−' : '+'}</span>
          </button>
          {abierto === i && <div className="ipacc__a">{it.a}</div>}
        </div>
      ))}
    </div>
  )
}

function InfoProducto({ producto, loading, marca, selectedColor, selectedTalle, onColorChange, onTalleChange }) {
  const [agregando, setAgregando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { estaLogueado, idUsuario } = useAuth()
  const { mostrarToast } = useToast()

  if (loading) {
    return <section className="ipinfo ipinfo--estado">Cargando…</section>
  }

  if (!producto) {
    return <section className="ipinfo ipinfo--estado">Producto no encontrado</section>
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

      const { error: rpcError } = await supabase.rpc('incrementar_clic', {
        p_id_producto: producto.id_producto,
      })
      if (rpcError) console.error('No se pudo registrar el clic:', rpcError)
    } catch (e) {
      console.error('Error agregando al carrito', e)
      mostrarToast('Ocurrió un error al agregar al carrito', 'error')
    } finally {
      setAgregando(false)
    }
  }

  return (
    <section className="ipinfo">
      {marca?.nombre && (
        <span className="ipinfo__brand">
          {marca.logo && <img src={marca.logo} alt={marca.nombre} />}
          {marca.nombre}
        </span>
      )}

      <h1 className="ipinfo__title">{producto.nombre}</h1>

      <p className="ipinfo__price">{formatearPrecio(producto.precio)}</p>

      {producto.descripcion && <p className="ipinfo__desc">{producto.descripcion}</p>}

      <div className="ipblock">
        <div className="ipblock__head"><b>Color</b></div>
        <SelectorColor colores={producto?.colores} value={selectedColor} onChange={onColorChange} />
      </div>

      <div className="ipblock">
        <div className="ipblock__head"><b>Talle</b></div>
        <SelectorTalle guiaTalles={producto?.guia_talles} value={selectedTalle} onChange={onTalleChange} />
      </div>

      <div className="ipinfo__buy">
        <button
          type="button"
          className="ipinfo__cart"
          onClick={handleAgregarCarrito}
          disabled={agregando}
        >
          {agregando ? 'AGREGANDO…' : 'AGREGAR AL CARRITO'}
        </button>
        <span className="ipinfo__fav">
          <BotonFavorito idProducto={producto.id_producto} />
        </span>
      </div>

      <div className="ipinfo__trust">
        <div><IconStore />Retiro en el local</div>
        <div><IconTruck />Envío a todo el país</div>
        <div><IconReturn />Cambios y devoluciones</div>
      </div>

      <Acordeon
        items={[
          { q: 'Detalles del producto', a: producto.descripcion || 'Sin descripción adicional.' },
          { q: 'Envíos y entregas', a: 'Retiro sin cargo en el local. Envíos a todo el país en 3 a 5 días hábiles.' },
          { q: 'Cambios y devoluciones', a: 'Tenés 30 días para hacer cambios. El primer cambio es sin cargo.' },
        ]}
      />
    </section>
  )
}

export default InfoProducto
