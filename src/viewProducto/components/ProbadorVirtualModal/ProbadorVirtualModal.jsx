import { useEffect, useState } from 'react'
import { enviarPruebaPorMail, generarPruebaLook, generarPruebaVirtual, getFotoProbador } from '../../services/probador'
import { validarDni } from '../../../utils/dni'
import { compartirImagen, descargarImagen, puedeCompartir } from '../../../utils/exportarImagen'
import { slugify } from '../../../utils/slugify'
import CamaraCaptura from './CamaraCaptura'
import EnviarPruebaMail, { AyudaDni, CampoDni } from './EnviarPruebaMail'
import './ProbadorVirtualModal.css'

// color: hex del color elegido en la ficha (opcional); sin él se prueba la portada
// prendas: en vez de producto, para probar un look completo sobre la misma foto
function ProbadorVirtualModal({ producto, prendas, color, onClose }) {
  const nombre = prendas ? 'el look completo' : producto?.nombre
  const [fotoGuardada, setFotoGuardada] = useState(null) // URL de la foto del perfil
  const [cargandoFoto, setCargandoFoto] = useState(true)
  const [foto, setFoto] = useState(null)                 // archivo subido o sacado ahora
  const [previewUrl, setPreviewUrl] = useState(null)
  const [camaraAbierta, setCamaraAbierta] = useState(false)
  const [guardarFoto, setGuardarFoto] = useState(true)
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [idPrueba, setIdPrueba] = useState(null)
  const [mailEnviado, setMailEnviado] = useState(false)
  const [error, setError] = useState(null)
  // el DNI se pide antes de generar; la prueba se manda sola a <dni>@est.ort.edu.ar
  const [dni, setDni] = useState('')
  const [dniError, setDniError] = useState(null)
  const [envio, setEnvio] = useState(null) // { estado: 'enviando' | 'ok' | 'error', email?, error? }

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

  const usarFoto = (archivo) => {
    setFoto(archivo)
    setResultado(null)
    setError(null)
    setPreviewUrl(URL.createObjectURL(archivo))
  }

  const handleElegirFoto = (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (archivo) usarFoto(archivo)
  }

  const handleFotoSacada = (archivo) => {
    setCamaraAbierta(false)
    usarFoto(archivo)
  }

  // foto que se va a usar: la recién subida o sacada o, si no hay, la guardada
  const fotoAMostrar = previewUrl ?? fotoGuardada

  const enviarAlDni = (id, dniLimpio) => {
    setEnvio({ estado: 'enviando' })
    enviarPruebaPorMail(id, dniLimpio)
      .then(({ email }) => setEnvio({ estado: 'ok', email }))
      .catch((err) => setEnvio({ estado: 'error', error: err.message || 'No se pudo enviar el mail' }))
  }

  const handleGenerar = async () => {
    if (!fotoAMostrar) return
    const dniLimpio = dni.trim()
    const invalido = validarDni(dniLimpio)
    if (invalido) {
      setDniError(invalido)
      return
    }
    setCargando(true)
    setError(null)
    try {
      const { imagen, idPrueba, fotoProbador, mailEnviado } = prendas
        ? await generarPruebaLook(prendas.map((p) => p.id_producto), foto, { guardarFoto })
        : await generarPruebaVirtual(producto.id_producto, foto, { guardarFoto, color })
      setResultado(imagen)
      setIdPrueba(idPrueba ?? null)
      setMailEnviado(Boolean(mailEnviado))
      // recién con la foto generada se manda al mail del DNI (no frena mostrar el resultado)
      if (idPrueba) enviarAlDni(idPrueba, dniLimpio)
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
    setEnvio(null)
    setFoto(null)
    setPreviewUrl(null)
    setResultado(null)
    setError(null)
  }

  const handleVolverAFotoGuardada = () => {
    setFoto(null)
    setPreviewUrl(null)
  }

  const [exportando, setExportando] = useState(false)
  const nombreArchivo = `pilchix-${slugify(prendas ? 'look' : producto?.nombre ?? 'look')}.png`

  const handleDescargar = async () => {
    setExportando(true)
    try {
      await descargarImagen(resultado, nombreArchivo)
    } finally {
      setExportando(false)
    }
  }

  const handleCompartir = async () => {
    setExportando(true)
    try {
      const ok = await compartirImagen(resultado, nombreArchivo)
      if (!ok) await descargarImagen(resultado, nombreArchivo) // sin soporte → descarga
    } catch (err) {
      // AbortError = el usuario cerró el menú de compartir, no es un error
      if (err.name !== 'AbortError') await descargarImagen(resultado, nombreArchivo)
    } finally {
      setExportando(false)
    }
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
              ? <>Usamos la foto guardada en tu perfil para mostrarte cómo te queda <b>{nombre}</b>.</>
              : <>Sacate o subí una foto y vas a ver cómo te queda <b>{nombre}</b>.</>}
          </p>

          {prendas && !resultado && (
            <ul className="probador-modal__prendas">
              {prendas.map((p) => <li key={p.id_producto}>{p.nombre}</li>)}
            </ul>
          )}

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
              <p>
                {!cargando
                  ? 'Cargando...'
                  : prendas
                    ? `Probando ${prendas.length} prendas una por una, puede tardar hasta un par de minutos...`
                    : 'Generando tu imagen, puede tardar unos segundos...'}
              </p>
            </div>
          )}

          {!error && !cargando && !cargandoFoto && resultado && (
            <div className="probador-resultado">
              <img src={resultado} alt={`${nombre} puesto`} />
              {mailEnviado && (
                <p className="probador-resultado__mail">📩 También te la mandamos a tu mail.</p>
              )}
              {envio?.estado === 'enviando' && (
                <p className="probador-resultado__mail">Enviándola a tu mail de ORT...</p>
              )}
              {envio?.estado === 'ok' && (
                <p className="probador-resultado__mail">📩 La mandamos a <b>{envio.email}</b>.</p>
              )}
              {envio?.estado === 'error' && idPrueba && (
                <>
                  <p className="probador-mail__error" role="alert">{envio.error}. Probá de nuevo:</p>
                  <EnviarPruebaMail idPrueba={idPrueba} dniInicial={dni.trim()} />
                </>
              )}
              <div className="probador-resultado__acciones">
                <button className="probador-btn-primary" onClick={handleDescargar} disabled={exportando}>
                  {exportando ? 'Preparando...' : 'Descargar'}
                </button>
                {puedeCompartir() && (
                  <button className="probador-btn-secondary" onClick={handleCompartir} disabled={exportando}>
                    Compartir
                  </button>
                )}
                <button className="probador-btn-secondary" onClick={handleProbarOtraFoto}>
                  Probar con otra foto
                </button>
              </div>
            </div>
          )}

          {!error && !cargando && !cargandoFoto && !resultado && camaraAbierta && (
            <CamaraCaptura onCapturar={handleFotoSacada} onCancelar={() => setCamaraAbierta(false)} />
          )}

          {!error && !cargando && !cargandoFoto && !resultado && !camaraAbierta && (
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
                  <div className="probador-mail">
                    <label className="probador-mail__label" htmlFor="probador-dni">
                      Tu DNI, para mandarte la foto al mail de ORT
                    </label>
                    <CampoDni
                      id="probador-dni"
                      value={dni}
                      onChange={(v) => { setDni(v); setDniError(null) }}
                      error={dniError}
                    />
                    <AyudaDni id="probador-dni" error={dniError} />
                  </div>
                  <div className="probador-upload__acciones">
                    <label className="probador-btn-secondary" htmlFor="probador-input-foto">
                      Subir otra
                    </label>
                    <button className="probador-btn-secondary" onClick={() => setCamaraAbierta(true)}>
                      Sacar otra
                    </button>
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
                <>
                  <div className="probador-upload__opciones">
                    <button type="button" className="probador-upload__zona" onClick={() => setCamaraAbierta(true)}>
                      <span className="probador-upload__icono">📷</span>
                      <span>Sacar una foto ahora</span>
                    </button>
                    <label className="probador-upload__zona" htmlFor="probador-input-foto">
                      <span className="probador-upload__icono">🖼️</span>
                      <span>Subir desde mis archivos</span>
                    </label>
                  </div>
                  <p className="probador-upload__ayuda">Usá una foto tuya de cuerpo entero.</p>
                </>
              )}
              <input
                id="probador-input-foto"
                type="file"
                accept="image/*"
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
