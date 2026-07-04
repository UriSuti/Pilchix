import './Producto.css'
import { Link } from 'react-router-dom'
import { slugify } from '../../../utils/slugify.js'
import { getImagenPortada } from '../../../utils/producto'
import BotonFavorito from '../BotonFavorito/BotonFavorito.jsx'

function formatearPrecio(valor) {
  if (valor == null) return ''
  return '$' + Number(valor).toLocaleString('es-AR')
}

function Producto({ producto }) {
  const imagenUrl = getImagenPortada(producto.Imagen)?.imagen || '/placeholder.png'
  const productSlug = slugify(producto.nombre || String(producto.id_producto || 'producto'))
  const marca = producto.Marca?.nombre

  return (
    <Link to={`/producto/${productSlug}`} className="card-producto__link">
      <article className="card-producto">
        {/* imagen + favorito */}
        <div className="card-producto__media">
          <div className="card-producto__fav">
            <BotonFavorito idProducto={producto.id_producto} />
          </div>
          <img src={imagenUrl} alt={producto.nombre} loading="lazy" />
        </div>

        {/* info */}
        <div className="card-producto__info">
          {marca && <p className="card-producto__marca">{marca}</p>}
          <h3 className="card-producto__nombre">{producto.nombre}</h3>
          <p className="card-producto__precio">{formatearPrecio(producto.precio)}</p>
        </div>
      </article>
    </Link>
  )
}

export default Producto
