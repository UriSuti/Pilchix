import './SelectorColor.css'
import nike from '../../../assets/nike.webp'

function normalizeColores(colores) {
  if (!colores) return []

  let parsed = colores

  try {
    if (typeof colores === 'string') {
      parsed = JSON.parse(colores)
    }
  } catch (e) {
    console.warn('SelectorColor: error parsing colores', e)
    parsed = null
  }

  if (!parsed) return []

  // If it's an array of strings: ["#fff","#000"]
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return []
    if (typeof parsed[0] === 'string') return parsed.map((c) => String(c).trim())

    // Array of objects: [{"hex":"#fff","nombre":"Blanco"}, {"color":"#000"}] or [{"colors":[...] }]
    // Flatten values when they are arrays inside the objects
    const vals = parsed.flatMap((item) => {
      if (!item) return []
      if (typeof item === 'string') return [item.trim()]
      const candidate = item.hex ?? item.color ?? item.codigo ?? Object.values(item)[0]
      if (Array.isArray(candidate)) return candidate
      return candidate ? [candidate] : []
    })

    return vals.filter(Boolean).map((c) => String(c).trim())
  }

  // If it's an object, maybe shape like { colors: ["#fff"] } or { "Blanco": "#fff" }
  if (typeof parsed === 'object') {
    // find an array value
    const arr = Object.values(parsed).find((v) => Array.isArray(v))
    if (arr) return arr.map((c) => String(c).trim())

    // otherwise map values
    return Object.values(parsed).map((v) => String(v).trim())
  }

  return []
}

function SelectorColor({ colores, value: selectedColor, onChange }) {
  const opciones = normalizeColores(colores)

  const mostrarFallback = opciones.length === 0

  const handleClick = (color) => {
    if (onChange) onChange(color)
  }

  return (
    <div className="selector-color">
      {mostrarFallback ? (
        <>
          <button type="button" className={`selector-color__swatch ${selectedColor === '#4a72b0' ? 'is-active' : ''}`} aria-label="Color 1" onClick={() => handleClick('#4a72b0')}>
            <span className="card-producto__swatch" style={{ backgroundColor: '#4a72b0' }} />
          </button>
          <button type="button" className={`selector-color__swatch ${selectedColor === '#ffffff' ? 'is-active' : ''}`} aria-label="Color 2" onClick={() => handleClick('#ffffff')}>
            <span className="card-producto__swatch" style={{ backgroundColor: '#ffffff' }} />
          </button>
          <button type="button" className={`selector-color__swatch ${selectedColor === '#11233f' ? 'is-active' : ''}`} aria-label="Color 3" onClick={() => handleClick('#11233f')}>
            <span className="card-producto__swatch" style={{ backgroundColor: '#11233f' }} />
          </button>
        </>
      ) : (
        opciones.map((color, i) => (
          <button
            key={color + i}
            type="button"
            className={`selector-color__swatch ${selectedColor === color ? 'is-active' : ''}`}
            aria-label={`Color ${i + 1}`}
            onClick={() => handleClick(color)}
          >
            {color && String(color).startsWith('data:') ? (
              <img src={color} alt={`Color ${i + 1}`} />
            ) : (
              <span className="card-producto__swatch" style={{ backgroundColor: color || '#ddd' }} />
            )}
          </button>
        ))
      )}
    </div>
  )
}

export default SelectorColor
