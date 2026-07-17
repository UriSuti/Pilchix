import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CartItem from './components/CartItem'
import CartSummary from './components/CartSummary'
import Header from '../header_footer/Header/Header'
import Footer from '../header_footer/Footer/Footer'
import { obtenerItemsCarrito, actualizarCantidadItem, eliminarItemCarrito } from './services/cart'
import { confirmarCompra } from '../services/compras'
import { tokenStore } from '../services/api'
import './CartPage.css'

const IconTruck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconReturn = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
)
const IconHeadset = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
  </svg>
)
const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
)
const IconBag = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const BENEFITS = [
  { icon: <IconTruck />, title: 'Envío rápido', desc: 'Recibe tu pedido en 1-3 días hábiles' },
  { icon: <IconShield />, title: 'Compra segura', desc: 'Tus datos están protegidos con encriptación' },
  { icon: <IconReturn />, title: 'Devoluciones fáciles', desc: '30 días para cambios y devoluciones' },
  { icon: <IconHeadset />, title: 'Atención al cliente', desc: 'Nuestro equipo está para ayudarte' },
]

const PAGO_BANNERS = {
  aprobado: { bg: '#dcfce7', color: '#15803d', texto: '¡Pago aprobado! Gracias por tu compra.' },
  rechazado: { bg: '#fee2e2', color: '#dc2626', texto: 'El pago fue rechazado. Podés intentarlo de nuevo.' },
  pendiente: { bg: '#fef9c3', color: '#a16207', texto: 'Tu pago está pendiente de acreditación.' },
}

function CartPage() {
  const { estaLogueado, idUsuario } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)

  const estadoPago = searchParams.get('pago')
  const confirmadoRef = useRef(false)

  const cargar = useCallback(() => {
    setCargando(true)
    obtenerItemsCarrito(idUsuario)
      .then(setItems)
      .catch((e) => console.error('Error cargando carrito', e?.message ?? e))
      .finally(() => setCargando(false))
  }, [idUsuario])

  useEffect(() => {
    if (!estaLogueado) { navigate('/login'); return }

    if (estadoPago === 'aprobado' && !confirmadoRef.current) {
      confirmadoRef.current = true
      const idPagoMp = searchParams.get('payment_id') || searchParams.get('collection_id') || null
      confirmarCompra({ idPagoMp, token: tokenStore.getUsuario() })
        .catch((e) => console.error('No se pudo registrar la compra', e?.message ?? e))
        .finally(cargar)
      return
    }

    cargar()
  }, [estaLogueado, cargar, navigate, estadoPago, searchParams])

  const handleRemove = (item) => {
    setItems((prev) => prev.filter((i) => i.id_detalle !== item.id_detalle))
    eliminarItemCarrito(item.id_detalle).catch((e) => {
      console.error('Error eliminando', e)
      setItems((prev) => [...prev, item])
    })
  }

  const handleChangeQty = (item, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.id_detalle === item.id_detalle ? { ...i, cantidad: qty } : i))
    )
    actualizarCantidadItem(item.id_detalle, qty).catch((e) => {
      console.error('Error actualizando cantidad', e)
      setItems((prev) =>
        prev.map((i) => (i.id_detalle === item.id_detalle ? { ...i, cantidad: item.cantidad } : i))
      )
    })
  }

  if (cargando) {
    return <div className="cart-loading">Cargando carrito...</div>
  }

  return (
    <div className="cart-layout">
    <Header idUsuario={idUsuario} />
    <div className="cart-page">
      {estadoPago && PAGO_BANNERS[estadoPago] && (
        <div style={{
          background: PAGO_BANNERS[estadoPago].bg,
          color: PAGO_BANNERS[estadoPago].color,
          padding: '14px 20px',
          borderRadius: 8,
          margin: '0 0 16px',
          fontWeight: 600,
          fontSize: '0.97rem',
        }}>
          {PAGO_BANNERS[estadoPago].texto}
        </div>
      )}

      <div className="cart-page__header">
        <div>
          <h1>Carrito de Compras</h1>
          <p>{items.length} artículo{items.length !== 1 ? 's' : ''} en tu carrito</p>
        </div>
        <p className="cart-page__help">
          ¿Necesitás ayuda? <a href="mailto:hola@pilchix.com">Contactanos</a>
        </p>
      </div>

      <div className="cart-page__content">
        <main className="cart-page__main">
          <div className="cart-table">
            {items.length > 0 && (
              <div className="cart-table__head">
                <span>Producto</span>
                <span>Precio unitario</span>
                <span>Cantidad</span>
                <span>Subtotal</span>
              </div>
            )}

            {items.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty__icon"><IconBag /></span>
                <h3>Tu carrito está vacío</h3>
                <p>Todavía no agregaste productos. Descubrí lo que creemos que te va a gustar.</p>
                <a className="cart-empty__cta" href="/#recomendados">Descubrí productos →</a>
              </div>
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.id_detalle}
                  item={item}
                  onRemove={handleRemove}
                  onChangeQuantity={handleChangeQty}
                />
              ))
            )}

            <div className="cart-table__foot">
              <Link to="/" className="cart-table__continue">← Seguir comprando</Link>
              <button className="cart-table__update" onClick={cargar}>
                <IconRefresh /> Actualizar carrito
              </button>
            </div>
          </div>

          <div className="cart-benefits">
            {BENEFITS.map((b) => (
              <div key={b.title} className="cart-benefit">
                <div className="cart-benefit__icon">{b.icon}</div>
                <div className="cart-benefit__text">
                  <strong>{b.title}</strong>
                  <span>{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <CartSummary items={items} />
      </div>
    </div>

    <Footer />
    </div>
  )
}

export default CartPage
