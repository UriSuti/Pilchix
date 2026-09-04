import { useEffect, useState } from 'react'
import { generarPruebaVirtual } from '../../services/probador'
import './ProbadorVirtualModal.css'

function ProbadorVirtualModal({ producto, onClose }) {
  const [foto, setFoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  // libera el object URL de la preview al cambiar de foto o desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleElegirFoto = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    setFoto(archivo)
    setResultado(null)
    setError(null)
    setPreviewUrl(URL.createObjectURL(archivo))
  }

  const handleGenerar = async () => {
    if (!foto) return
    setCargando(true)
    setError(null)
    try {
      const { imagen } = await generarPruebaVirtual(producto.id_producto, foto)
      setResultado(imagen)
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

  return (
    <div className="probador-backdrop" onClick={onClose}>
      <div className="probador-modal" onClick={(e) => e.stopPropagation()}>
        <div className="probador-modal__header">
          <h2>Probador virtual</h2>
          <button className="probador-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="probador-modal__body">
          <p className="probador-modal__subtitulo">
            Subí una foto tuya y vas a ver cómo te queda <b>{producto?.nombre}</b>.
          </p>

          {error && (
            <div className="probador-error">
              <p>{error}</p>
              <button className="probador-btn-secondary" onClick={() => setError(null)}>
                Volver a intentar
              </button>
            </div>
          )}

          {!error && cargando && (
            <div className="probador-loading">
              <div className="probador-spinner" />
              <p>Generando tu imagen, puede tardar unos segundos...</p>
            </div>
          )}

          {!error && !cargando && resultado && (
            <div className="probador-resultado">
              <img src={resultado} alt={`${producto?.nombre} puesto`} />
              <button className="probador-btn-secondary" onClick={handleProbarOtraFoto}>
                Probar con otra foto
              </button>
            </div>
          )}

          {!error && !cargando && !resultado && (
            <div className="probador-upload">
              {previewUrl ? (
                <>
                  <img className="probador-upload__preview" src={previewUrl} alt="Tu foto" />
                  <div className="probador-upload__acciones">
                    <label className="probador-btn-secondary" htmlFor="probador-input-foto">
                      Cambiar foto
                    </label>
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
