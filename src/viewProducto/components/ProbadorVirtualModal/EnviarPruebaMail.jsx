import { useState } from 'react'
import { enviarPruebaPorMail } from '../../services/probador'
import { SUFIJO_MAIL_ORT, validarDni } from '../../../utils/dni'
import './ProbadorVirtualModal.css'

// input de DNI con el sufijo del mail de ORT; lo usan este form y el modal (antes de generar)
export function CampoDni({ id, value, onChange, disabled, error }) {
  return (
    <div className="probador-mail__campo">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DNI"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-ayuda`}
      />
      <span>{SUFIJO_MAIL_ORT}</span>
    </div>
  )
}

export function AyudaDni({ id, error }) {
  return error ? (
    <p id={`${id}-ayuda`} className="probador-mail__error" role="alert">{error}</p>
  ) : (
    <p id={`${id}-ayuda`} className="probador-mail__ayuda">8 dígitos, sin puntos ni espacios.</p>
  )
}

// manda una prueba ya generada al mail de ORT que corresponde al DNI ingresado.
// dniInicial: para reintentar cuando falló el envío automático
function EnviarPruebaMail({ idPrueba, dniInicial = '' }) {
  const [dni, setDni] = useState(dniInicial)
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
        <CampoDni
          id="probador-mail-dni"
          value={dni}
          onChange={(v) => { setDni(v); setError(null) }}
          disabled={enviando}
          error={error}
        />
        <button type="submit" className="probador-btn-primary" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      <AyudaDni id="probador-mail-dni" error={error} />
    </form>
  )
}

export default EnviarPruebaMail
