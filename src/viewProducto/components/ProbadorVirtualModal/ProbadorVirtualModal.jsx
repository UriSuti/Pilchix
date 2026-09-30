import { useEffect, useState } from 'react'
import { generarPruebaVirtual, getFotoProbador } from '../../services/probador'
import './ProbadorVirtualModal.css'

function ProbadorVirtualModal({ producto, onClose }) {
  const [fotoGuardada, setFotoGuardada] = useState(null) // URL de la foto del perfil
  const [cargandoFoto, setCargandoFoto] = useState(true)
  const [foto, setFoto] = useState(null)                 // archivo subido ahora
  const [previewUrl, setPreviewUrl] = useState(null)
  const [guardarFoto, setGuardarFoto] = useState(true)
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  // si el usuario ya tiene una foto guardada en el perfil, se usa directo
  useEffect(() => {
    let activo = true
    getFotoProbador()
      .then((url) => { if (activo) setFotoGuardada(url) })
      .catch(() => {})
      .finally(() => { if (activo) setCargandoFoto(false) })
    return () => { activo = false }
  }, [])

  // libera el object URL de la preview al cambiar de foto o desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleElegirFoto = (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    setFoto(archivo)
    setResultado(null)
    setError(null)
    setPreviewUrl(URL.createObjectURL(archivo))
  }

  // foto que se va a usar: la recién subida o, si no hay, la guardada
  const fotoAMostrar = previewUrl ?? fotoGuardada

  const handleGenerar = async () => {
    if (!fotoAMostrar) return
    setCargando(true)
    setError(null)
    try {
      const { imagen, fotoProbador } = await generarPruebaVirtual(producto.id_producto, foto, { guardarFoto })
      setResultado(imagen)
      if (fotoProbador) {
        // la foto subida quedó guardada: de acá en más se usa esa
        setFotoGuardada(fotoProbador)
        setFoto(null)
        setPreviewUrl(null)
      }
    } catch (err) {
      setError(err.message || 'No se pudo generar la imagen')
    } finally {
      setCargando(false)
    }
  }

  const handleProbarOtraFoto = () => {
    setFoto(null)
    setPreviewUrl(null)
    setResultado(null)
    setError(null)
  }

  const handleVolverAFotoGuardada = () => {
    setFoto(null)
    setPreviewUrl(null)
  }

  return (
    <div className="probador-backdrop" onClick={onClose}>
      <div className="probador-modal" onClick={(e) => e.stopPropagation()}>
        <div className="probador-modal__header">
          <h2>Probador virtual</h2>
          <button className="probador-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="probador-modal__body">
          <p className="probador-modal__subtitulo">
            {fotoGuardada && !foto
              ? <>Usamos la foto guardada en tu perfil para mostrarte cómo te queda <b>{producto?.nombre}</b>.</>
              : <>Subí una foto tuya y vas a ver cómo te queda <b>{producto?.nombre}</b>.</>}
          </p>

          {error && (
            <div className="probador-error">
              <p>{error}</p>
              <button className="probador-btn-secondary" onClick={() => setError(null)}>
                Volver a intentar
              </button>
            </div>
          )}

          {!error && (cargando || cargandoFoto) && (
            <div className="probador-loading">
              <div className="probador-spinner" />
              <p>{cargando ? 'Generando tu imagen, puede tardar unos segundos...' : 'Cargando...'}</p>
            </div>
          )}

          {!error && !cargando && !cargandoFoto && resultado && (
            <div className="probador-resultado">
              <img src={resultado} alt={`${producto?.nombre} puesto`} />
              <button className="probador-btn-secondary" onClick={handleProbarOtraFoto}>
                Probar con otra foto
              </button>
            </div>
          )}

          {!error && !cargando && !cargandoFoto && !resultado && (
            <div className="probador-upload">
              {fotoAMostrar ? (
                <>
                  <img className="probador-upload__preview" src={fotoAMostrar} alt="Tu foto" />
                  {foto && (
                    <label className="probador-upload__guardar">
                      <input
                        type="checkbox"
                        checked={guardarFoto}
                        onChange={(e) => setGuardarFoto(e.target.checked)}
                      />
                      {fotoGuardada ? 'Reemplazar la foto guardada en mi perfil' : 'Guardar esta foto en mi perfil'}
                    </label>
                  )}
                  <div className="probador-upload__acciones">
                    <label className="probador-btn-secondary" htmlFor="probador-input-foto">
                      {foto ? 'Cambiar foto' : 'Usar otra foto'}
                    </label>
                    {foto && fotoGuardada && (
                      <button className="probador-btn-secondary" onClick={handleVolverAFotoGuardada}>
                        Usar la guardada
                      </button>
                    )}
                    <button className="probador-btn-primary" onClick={handleGenerar}>
                      Generar
                    </button>
                  </div>
                </>
              ) : (
                <label className="probador-upload__zona" htmlFor="probador-input-foto">
                  <span className="probador-upload__icono">📷</span>
                  <span>Subí una foto tuya de cuerpo entero</span>
                </label>
              )}
              <input
                id="probador-input-foto"
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleElegirFoto}
                hidden
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProbadorVirtualModal
