import { useState } from 'react'
import { enviarPruebaPorMail } from '../../services/probador'
import { SUFIJO_MAIL_ORT, validarDni } from '../../../utils/dni'
import './ProbadorVirtualModal.css'

// manda una prueba ya generada al mail de ORT que corresponde al DNI ingresado
function EnviarPruebaMail({ idPrueba }) {
  const [dni, setDni] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviadoA, setEnviadoA] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const limpio = dni.trim()
    const invalido = validarDni(limpio)
    if (invalido) {
      setError(invalido)
      return
    }
    setEnviando(true)
    setError(null)
    try {
      const { email } = await enviarPruebaPorMail(idPrueba, limpio)
      setEnviadoA(email)
    } catch (err) {
      setError(err.message || 'No se pudo enviar el mail')
    } finally {
      setEnviando(false)
    }
  }

  const handleOtroDni = () => {
    setEnviadoA(null)
    setDni('')
  }

  if (enviadoA) {
    return (
      <div className="probador-mail" role="status">
        <p className="probador-mail__ok">📩 La mandamos a <b>{enviadoA}</b>.</p>
        <button type="button" className="probador-btn-secondary" onClick={handleOtroDni}>
          Mandar a otro DNI
        </button>
      </div>
    )
  }

  return (
    <form className="probador-mail" onSubmit={handleSubmit} noValidate>
      <label className="probador-mail__label" htmlFor="probador-mail-dni">
        Mandala a tu mail de ORT
      </label>
      <div className="probador-mail__fila">
        <div className="probador-mail__campo">
          <input
            id="probador-mail-dni"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="DNI"
            value={dni}
            onChange={(e) => { setDni(e.target.value); setError(null) }}
            disabled={enviando}
            aria-invalid={Boolean(error)}
            aria-describedby="probador-mail-ayuda"
          />
          <span>{SUFIJO_MAIL_ORT}</span>
        </div>
        <button type="submit" className="probador-btn-primary" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      {error ? (
        <p id="probador-mail-ayuda" className="probador-mail__error" role="alert">{error}</p>
      ) : (
        <p id="probador-mail-ayuda" className="probador-mail__ayuda">8 dígitos, sin puntos ni espacios.</p>
      )}
    </form>
  )
}

export default EnviarPruebaMail
