import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7744575081225968-062607-26a6520f69f5e42563908c0ab41dec60-2615602953' })

app.post('/api/create-preference', async (req, res) => {
  try {
    const { items } = req.body
    if (!items || !items.length) {
      return res.status(400).json({ error: 'El carrito está vacío' })
    }

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: 'http://localhost:5173/carrito?pago=aprobado',
          failure: 'http://localhost:5173/carrito?pago=rechazado',
          pending: 'http://localhost:5173/carrito?pago=pendiente',
        },
        statement_descriptor: 'Pilchix',
      },
    })
    res.json({ preferenceId: result.id })
  } catch (error) {
    console.error('Error creating preference:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/process-payment', async (req, res) => {
  try {
    const payment = new Payment(client)
    const result = await payment.create({ body: req.body })
    res.json({
      status: result.status,
      statusDetail: result.status_detail,
      id: result.id,
    })
  } catch (error) {
    // error.cause contiene la respuesta real de la API de MP
    const cause = error.cause ?? error
    console.error('MP process-payment error:', JSON.stringify(cause, null, 2))
    res.status(500).json({ error: error.message, cause })
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`))
