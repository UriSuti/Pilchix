import { useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { apiFetch, tokenStore } from "../../services/api"
import { registrarCompraAlPagar } from "../../services/compras"
import './CheckoutModal.css'

initMercadoPago('APP_USR-3c9b2f24-c077-4438-b40b-7970f37d0eb7')

function CheckoutModal({ items, onClose }) {
  const [listo, setListo] = useState(false)
  const [error, setError] = useState(null)

  // Al hacer click en el botón de Mercado Pago: se crea la preferencia y, antes
  // del redirect, se registra la compra. Devolver el preferenceId dispara el redirect.
  const handleSubmit = async () => {
    const mpItems = items.map((item) => ({
      id: String(item.id),
      title: item.nombre,
      quantity: Number(item.cantidad),
      unit_price: Number(item.precio),
      currency_id: 'ARS',
    }))

    try {
      const { preferenceId } = await apiFetch("/pagos/create-preference", {
        method: "POST",
        body: { items: mpItems },
      })
      if (!preferenceId) throw new Error("Error al crear la preferencia de pago")

      // TEMPORAL: la compra se da por exitosa y se guarda acá, sin esperar a que MP apruebe el pago
      await registrarCompraAlPagar({ token: tokenStore.getUsuario() })
        .catch((e) => console.error('No se pudo registrar la compra', e?.message ?? e))

      return preferenceId
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor")
      throw err
    }
  }

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

          {!error && !listo && (
            <div className="checkout-loading">
              <div className="checkout-spinner" />
              <p>Preparando el pago...</p>
            </div>
          )}

          {!error && (
            <>
              <Wallet
                onSubmit={handleSubmit}
                onReady={() => setListo(true)}
                onError={() => setError("No se pudo cargar Mercado Pago")}
                customization={{ texts: { valueProp: 'smart_option' } }}
              />
              {listo && (
                <button className="checkout-btn-secondary" onClick={onClose} style={{ marginTop: 16, width: '100%' }}>
                  Cancelar
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default CheckoutModal
