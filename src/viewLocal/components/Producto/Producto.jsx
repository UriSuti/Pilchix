import './Producto.css'
import { Link } from 'react-router-dom'
import { slugify } from '../../../utils/slugify.js'

const IconCorazon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

function formatearPrecio(valor) {
  if (valor == null) return ''
  return '$' + Number(valor).toLocaleString('es-AR')
}

function Producto({ producto }) {
  const imagenUrl = producto.Imagen?.[0]?.imagen || '/placeholder.png'
  const productSlug = slugify(producto.nombre || String(producto.id || 'producto'))

  return (
    <Link to={`/producto/${productSlug}`} className="card-producto__link">
      <article className="card-producto">
        {/* imagen + favorito */}
        <div className="card-producto__media">
          <button type="button" className="card-producto__fav" aria-label="Guardar en favoritos">
            <IconCorazon />
          </button>
          <img src={imagenUrl} alt={producto.nombre} />
        </div>

        {/* info */}
        <div className="card-producto__info">
          <h3 className="card-producto__nombre">{producto.nombre}</h3>
          {producto.descripcion && (
            <p className="card-producto__subtitulo">{producto.descripcion}</p>
          )}
          <p className="card-producto__precio">{formatearPrecio(producto.precio)}</p>

          {/* swatches de color (placeholder) */}

        </div>
      </article>
    </Link>
  )
}

export default Producto
