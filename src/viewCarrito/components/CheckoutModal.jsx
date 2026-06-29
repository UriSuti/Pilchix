import { useEffect, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import './CheckoutModal.css'

initMercadoPago('APP_USR-3c9b2f24-c077-4438-b40b-7970f37d0eb7')

function CheckoutModal({ items, onClose }) {
  const [preferenceId, setPreferenceId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const mpItems = items.map((item) => ({
      id: String(item.id),
      title: item.nombre,
      quantity: Number(item.cantidad),
      unit_price: Number(item.precio),
      currency_id: 'ARS',
    }))

    fetch('/api/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: mpItems }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.preferenceId) {
          setPreferenceId(data.preferenceId)
        } else {
          setError(data.error ?? 'Error al crear la preferencia de pago')
        }
      })
      .catch(() => setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?'))
  }, [])

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>

        <div className="checkout-modal__header">
          <h2>Finalizar compra</h2>
          <button className="checkout-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="checkout-modal__body">
          {error && (
            <div className="checkout-error">
              <p>{error}</p>
              <button className="checkout-btn-secondary" onClick={onClose}>Volver al carrito</button>
            </div>
          )}

          {!error && !preferenceId && (
            <div className="checkout-loading">
              <div className="checkout-spinner" />
              <p>Preparando el pago...</p>
            </div>
          )}

          {preferenceId && (
            <>
              <Wallet
                initialization={{ preferenceId }}
                customization={{ texts: { valueProp: 'smart_option' } }}
              />
              <button className="checkout-btn-secondary" onClick={onClose} style={{ marginTop: 16, width: '100%' }}>
                Cancelar
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default CheckoutModal
