import './SelectorColor.css'
import nike from '../../../assets/nike.webp'

function SelectorColor() {
  return (
    <div className="selector-color">
      <button type="button" className="selector-color__swatch is-active" aria-label="Color 1">
        <img src={nike} alt="Color 1" />
      </button>
      <button type="button" className="selector-color__swatch" aria-label="Color 2">
        <img src={nike} alt="Color 2" />
      </button>
    </div>
  )
}

export default SelectorColor
