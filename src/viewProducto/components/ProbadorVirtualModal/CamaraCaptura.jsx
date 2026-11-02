import { useEffect, useRef, useState } from 'react'
import './ProbadorVirtualModal.css'

const camaraDisponible = () => Boolean(navigator.mediaDevices?.getUserMedia)

function mensajeDeError(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'No tenemos permiso para usar la cámara. Habilitalo en el navegador y volvé a intentar.'
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No encontramos ninguna cámara en este dispositivo.'
    case 'NotReadableError':
    case 'AbortError':
      return 'La cámara está siendo usada por otra aplicación.'
    default:
      return 'No se pudo abrir la cámara.'
  }
}

// cámara en vivo: al sacar la foto le pasa un File a onCapturar
function CamaraCaptura({ onCapturar, onCancelar }) {
  const videoRef = useRef(null)
  const [facingMode, setFacingMode] = useState('user')
  const [lista, setLista] = useState(false)
  const [variasCamaras, setVariasCamaras] = useState(false)
  const [error, setError] = useState(
    camaraDisponible() ? null : 'Tu navegador no permite usar la cámara en esta página.'
  )

  useEffect(() => {
    if (!camaraDisponible()) return
    let activo = true
    let stream = null

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      .then((s) => {
        // el modal se pudo cerrar mientras se esperaba el permiso
        if (!activo) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        stream = s
        videoRef.current.srcObject = s
        // la lista completa de cámaras recién se conoce con el permiso dado
        navigator.mediaDevices.enumerateDevices()
          .then((dispositivos) => {
            if (activo) setVariasCamaras(dispositivos.filter((d) => d.kind === 'videoinput').length > 1)
          })
          .catch(() => {})
      })
      .catch((err) => { if (activo) setError(mensajeDeError(err)) })

    // apaga la cámara al cerrar o al cambiar de cámara
    return () => {
      activo = false
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [facingMode])

  const handleCambiarCamara = () => {
    setLista(false)
    setFacingMode((actual) => (actual === 'user' ? 'environment' : 'user'))
  }

  const handleSacar = () => {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('No se pudo sacar la foto.')
        return
      }
      onCapturar(new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.92)
  }

  if (error) {
    return (
      <div className="probador-error">
        <p>{error}</p>
        <button type="button" className="probador-btn-secondary" onClick={onCancelar}>
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="probador-camara">
      {/* la vista previa va espejada en la cámara frontal; la foto sale sin espejar */}
      <video
        ref={videoRef}
        className={`probador-camara__video ${facingMode === 'user' ? 'probador-camara__video--espejo' : ''}`}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => setLista(true)}
      />
      <p className="probador-camara__ayuda">Alejate para que se vea tu cuerpo entero.</p>
      <div className="probador-upload__acciones">
        <button type="button" className="probador-btn-secondary" onClick={onCancelar}>
          Cancelar
        </button>
        {variasCamaras && (
          <button type="button" className="probador-btn-secondary" onClick={handleCambiarCamara}>
            Cambiar cámara
          </button>
        )}
        <button type="button" className="probador-btn-primary" onClick={handleSacar} disabled={!lista}>
          Sacar foto
        </button>
      </div>
    </div>
  )
}

export default CamaraCaptura
