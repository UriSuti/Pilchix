import './SelectorTalle.css'

function SelectorTalle() {
  return (
    <div className="selector-talle">
      <p className="selector-talle__titulo">Seleccionar Talle (US)</p>

      <div className="selector-talle__grilla">
        <button type="button" className="selector-talle__opcion">6</button>
        <button type="button" className="selector-talle__opcion">6.5</button>
        <button type="button" className="selector-talle__opcion">7</button>
        <button type="button" className="selector-talle__opcion">7.5</button>
        <button type="button" className="selector-talle__opcion">8</button>
        <button type="button" className="selector-talle__opcion">8.5</button>
        <button type="button" className="selector-talle__opcion">9</button>
        <button type="button" className="selector-talle__opcion">9.5</button>
      </div>
    </div>
  )
}

export default SelectorTalle
