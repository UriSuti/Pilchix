import './SelectorTalle.css'

function SelectorTalle({ guiaTalles, value: selectedTalle, onChange }) {
  // guiaTalles can be: null | stringified JSON | JS object
  let sizes = null

  try {
    if (!guiaTalles) {
      sizes = null
    } else if (typeof guiaTalles === 'string') {
      sizes = JSON.parse(guiaTalles)
    } else {
      sizes = guiaTalles
    }
  } catch (e) {
    console.warn('Invalid guia_talles format', e)
    sizes = null
  }

  // Normalizar a un array simple de talles si es necesario
  let opciones = []
  const key = 'US'
  if (Array.isArray(sizes)) {
    // Array de strings: ["6","6.5"]
    if (sizes.length > 0 && typeof sizes[0] === 'string') {
      opciones = sizes
    } else if (sizes.length > 0 && typeof sizes[0] === 'object') {
      // Array de objetos: [{ "US": [..] }, { "US": [..] }] o [{"US":[..]}]
      opciones = sizes.flatMap((item) => {
        if (!item || typeof item !== 'object') return []
        const vals = item[key] ?? Object.values(item)[0]
        if (Array.isArray(vals)) return vals
        return vals ? [vals] : []
      })
    }
  } else if (sizes && typeof sizes === 'object') {
    // Objeto con listas por sistema: { US: [...], EU: [...] }
    if (Array.isArray(sizes[key])) {
      opciones = sizes[key]
    } else {
      const firstArray = Object.values(sizes).find((v) => Array.isArray(v))
      opciones = firstArray || []
    }
  }

  // Normalizar a strings y filtrar valores inválidos
  opciones = opciones.map((v) => (v == null ? '' : String(v).trim())).filter(Boolean)

  // fallback visual si no hay guia de talles
  if (!opciones || opciones.length === 0) {
    opciones = ['S', 'M', 'L', 'XL']
  }

  const handleClick = (talle) => {
    if (onChange) onChange(talle)
  }

  return (
    <div className="selector-talle">
      <p className="selector-talle__titulo">Seleccionar Talle (US)</p>

      <div className="selector-talle__grilla">
        {opciones.map((talle) => (
          <button
            key={talle}
            type="button"
            className={`selector-talle__opcion ${selectedTalle === talle ? 'is-active' : ''}`}
            onClick={() => handleClick(talle)}
          >
            {talle}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SelectorTalle
