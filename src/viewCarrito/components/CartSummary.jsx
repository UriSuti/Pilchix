import { useState } from 'react'
import CheckoutModal from './CheckoutModal'
import './CartSummary.css'

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const IconShieldCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
)

function formatPrice(valor) {
  return '$' + Number(valor).toLocaleString('es-AR')
}

function CartSummary({ items }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const subtotal = items.reduce((s, it) => s + (Number(it.precio) || 0) * (it.cantidad || 1), 0)

  return (
    <>
      <aside className="cart-summary">
        <h3>Resumen de Compra</h3>

        <div className="cart-summary__line">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <hr className="cart-summary__divider" />

        <div className="cart-summary__total">
          <strong>Total</strong>
          <strong>{formatPrice(subtotal)}</strong>
        </div>

        <button
          className="cart-summary__checkout"
          onClick={() => setModalAbierto(true)}
          disabled={items.length === 0}
        >
          <IconLock /> Proceder al pago
        </button>

        <p className="cart-summary__secure">
          <IconShieldCheck /> Pago seguro y protegido
        </p>
      </aside>

      {modalAbierto && (
        <CheckoutModal
          items={items}
          total={subtotal}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  )
}

export default CartSummary
