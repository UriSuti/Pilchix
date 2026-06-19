import './CartItem.css'

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
  </svg>
)

function formatPrice(valor) {
  if (valor == null) return '—'
  return '$' + Number(valor).toLocaleString('es-AR')
}

function CartItem({ item, onRemove, onChangeQuantity }) {
  return (
    <div className="cart-item">
      {/* col 1: product */}
      <div className="cart-item__product">
        <img
          className="cart-item__img"
          src={item.imagen || '/placeholder.png'}
          alt={item.nombre}
        />
        <div className="cart-item__info">
          <h3 className="cart-item__name">{item.nombre}</h3>
          <p className="cart-item__desc">{item.color} · {item.talle}</p>
          <span className="cart-item__stock">
            <IconCheck /> En stock
          </span>
        </div>
      </div>

      {/* col 2: unit price */}
      <div className="cart-item__price">
        {formatPrice(item.precio)}
      </div>

      {/* col 3: quantity */}
      <div className="cart-item__qty">
        <button
          aria-label="Reducir cantidad"
          onClick={() => onChangeQuantity(item, Math.max(1, item.cantidad - 1))}
        >
          −
        </button>
        <span>{item.cantidad}</span>
        <button
          aria-label="Aumentar cantidad"
          onClick={() => onChangeQuantity(item, item.cantidad + 1)}
        >
          +
        </button>
      </div>

      {/* col 4: subtotal + delete */}
      <div className="cart-item__subtotal">
        <span>{formatPrice(item.precio * item.cantidad)}</span>
        <button className="cart-item__remove" aria-label="Eliminar" onClick={() => onRemove(item)}>
          <IconTrash />
        </button>
      </div>
    </div>
  )
}

export default CartItem
