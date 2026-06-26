import { useEffect, useState } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import './CheckoutModal.css'

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' })

function CheckoutModal({ items, total, onClose }) {
  const [preferenceId, setPreferenceId] = useState(null)
  const [error, setError] = useState(null)
  const [paymentResult, setPaymentResult] = useState(null)

  useEffect(() => {
    const mpItems = items.map((item) => ({
      id: String(item.id_producto),
      title: item.nombre || 'Producto',
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
        if (data.error) throw new Error(data.error)
        setPreferenceId(data.preferenceId)
      })
      .catch(() => setError('No se pudo inicializar el pago. Intentá de nuevo.'))
  }, [items])

  // onSubmit DEBE retornar una Promise que rechace en caso de error,
  // así el Brick puede mostrar el error y dejar reintentar al usuario.
  const handleSubmit = async ({ formData }) => {
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Error procesando el pago')
    }

    const result = await response.json()
    setPaymentResult(result)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="checkout-backdrop" onClick={handleBackdropClick}>
      <div className="checkout-modal">
        <div className="checkout-modal__header">
          <h2>Finalizar compra</h2>
          <button
            className="checkout-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="checkout-modal__body">
          {paymentResult ? (
            <PaymentResult result={paymentResult} onClose={onClose} />
          ) : error ? (
            <div className="checkout-error">
              <p>{error}</p>
              <button className="checkout-btn-secondary" onClick={onClose}>
                Volver al carrito
              </button>
            </div>
          ) : !preferenceId ? (
            <div className="checkout-loading">
              <div className="checkout-spinner" />
              <p>Preparando el pago...</p>
            </div>
          ) : (
            <>
              <Payment
                initialization={{ amount: total, preferenceId }}
                customization={{
                  paymentMethods: {
                    ticket: 'all',
                    creditCard: 'all',
                    debitCard: 'all',
                    mercadoPago: 'all',
                  },
                }}
                onSubmit={handleSubmit}
                onError={(err) => {
                  console.error('MP error:', err)
                  setError('Ocurrió un error con el pago. Intentá de nuevo.')
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function PaymentResult({ result, onClose }) {
  const aprobado = result.status === 'approved'
  const pendiente = result.status === 'in_process' || result.status === 'pending'

  let titulo, mensaje, clase
  if (aprobado) {
    titulo = '¡Pago aprobado!'
    mensaje = 'Tu compra fue procesada con éxito. Pronto recibirás un mail de confirmación.'
    clase = 'success'
  } else if (pendiente) {
    titulo = 'Pago pendiente'
    mensaje = 'Tu pago está siendo procesado. Te avisaremos cuando se confirme.'
    clase = 'pending'
  } else {
    titulo = 'Pago no aprobado'
    mensaje = 'No pudimos procesar tu pago. Revisá los datos e intentá de nuevo.'
    clase = 'error'
  }

  return (
    <div className={`checkout-result checkout-result--${clase}`}>
      <div className="checkout-result__icon">
        {aprobado ? '✓' : pendiente ? '⏳' : '✗'}
      </div>
      <h3>{titulo}</h3>
      <p>{mensaje}</p>
      {result.id && (
        <p className="checkout-result__id">N° de operación: {result.id}</p>
      )}
      <button className="checkout-btn-primary" onClick={onClose}>
        {aprobado ? 'Volver al inicio' : 'Cerrar'}
      </button>
    </div>
  )
}

export default CheckoutModal
