import './InfoProducto.css'
import SelectorColor from '../SelectorColor/SelectorColor.jsx'
import SelectorTalle from '../SelectorTalle/SelectorTalle.jsx'

const IconCorazon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

function InfoProducto() {
  return (
    <section className="info-producto">
      {/* encabezado: titulo + favorito */}
      <div className="info-producto__encabezado">
        <div>
          <h1 className="info-producto__titulo">Nike SB FC Classic</h1>
          <p className="info-producto__subtitulo">Zapatillas de Moda para Hombre</p>
        </div>

        <button type="button" className="info-producto__favorito" aria-label="Guardar en favoritos">
          <IconCorazon />
        </button>
      </div>

      {/* precio */}
      <div className="info-producto__precio">
        <span className="info-producto__precio-actual">$50.000</span>
        <span className="info-producto__precio-original">$70.000</span>
      </div>

      {/* colores */}
      <SelectorColor />

      {/* talles */}
      <SelectorTalle />

      {/* carrito */}
      <button type="button" className="info-producto__carrito">
        AGREGAR AL CARRITO
      </button>

      {/* link */}
      <a className="info-producto__link" href="#">
        Leer más sobre el producto
      </a>
    </section>
  )
}

export default InfoProducto
