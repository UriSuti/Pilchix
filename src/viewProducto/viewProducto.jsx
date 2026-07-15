import './viewProducto.css'
import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductos, incrementarVisualizacion } from './services/producto'
import { slugify } from '../utils/slugify'
import Footer from '../header_footer/Footer/Footer.jsx'
import Header from '../header_footer/Header/Header.jsx'
import { useLandingSearch } from '../hooks/useLandingSearch'
import GaleriaProducto from './components/GaleriaProducto/GaleriaProducto.jsx'
import InfoProducto from './components/InfoProducto/InfoProducto.jsx'
import Producto from '../viewLocal/components/Producto/Producto.jsx'
import OpinionesProducto from './components/OpinionesProducto/OpinionesProducto.jsx'
import ViewProductoSkeleton from '../components/skeletons/ViewProductoSkeleton.jsx'

function ViewProducto() {
  const { productSlug } = useParams()
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedTalle, setSelectedTalle] = useState(null)
  const contadoRef = useRef(null)
  const { textoBusqueda, setTextoBusqueda, buscarProductos, resultadosBusqueda } = useLandingSearch()

  const productId = producto?.id_producto ?? producto?.id ?? 'unknown'
  const storageKey = `productSelection_${productId}`

  useEffect(() => {
    if (!producto) return
    try {
      const raw = localStorage.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : null
      setSelectedColor(parsed?.color ?? null)
      setSelectedTalle(parsed?.talle ?? null)
    } catch {
      setSelectedColor(null)
      setSelectedTalle(null)
    }
  }, [storageKey, producto])

  const saveSelection = (color, talle) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color, talle }))
    } catch (e) {
      console.warn('No se pudo guardar selección en localStorage', e)
    }
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    saveSelection(color, selectedTalle)
  }

  const handleTalleChange = (talle) => {
    setSelectedTalle(talle)
    saveSelection(selectedColor, talle)
  }

  useEffect(() => {
    let active = true

    async function loadProducto() {
      setLoading(true)
      const { data, error } = await getProductos()

      if (!active) return

      if (error) {
        console.error(error)
        setProducto(null)
        setRelacionados([])
        setLoading(false)
        return
      }

      const found = (data || []).find((p) => slugify(p.nombre) === productSlug)
      setProducto(found || null)

      // relacionados: otros productos de la misma marca
      setRelacionados(
        found
          ? (data || [])
              .filter((p) => p.id_marca === found.id_marca && p.id_producto !== found.id_producto)
              .slice(0, 4)
          : []
      )

      setLoading(false)

      if (found && contadoRef.current !== found.id_producto) {
        contadoRef.current = found.id_producto // marca este producto como contado
        incrementarVisualizacion(found.id_producto).then(({ error: rpcError }) => {
          if (rpcError) console.error('No se pudo registrar la visualización:', rpcError)
        })
      }
    }

    loadProducto()

    return () => {
      active = false
    }
  }, [productSlug])

  const noEncontrado = !loading && !producto
  const marcaNombre = producto?.Marca?.nombre

  return (
    <div className="view-producto">
      <Header
        textoBusqueda={textoBusqueda}
        onBusquedaChange={setTextoBusqueda}
        onBuscar={buscarProductos}
        resultados={resultadosBusqueda}
      />

      {loading ? (
        <ViewProductoSkeleton />
      ) : noEncontrado ? (
        <div className="pdp-estado">No encontramos ese producto 😕</div>
      ) : (
        <>
          <div className="pdp-wrap">
            <nav className="pdp-crumbs" aria-label="Migas de pan">
              <Link to="/">Inicio</Link>
              <span>›</span>
              {marcaNombre && (
                <>
                  <Link to={`/${slugify(marcaNombre)}`}>{marcaNombre}</Link>
                  <span>›</span>
                </>
              )}
              <span className="pdp-crumbs__cur">{producto?.nombre || 'Producto'}</span>
            </nav>

            <section className="pdp">
              <GaleriaProducto producto={producto} loading={loading} selectedColor={selectedColor} />
              <InfoProducto
                producto={producto}
                loading={loading}
                marca={producto?.Marca}
                selectedColor={selectedColor}
                selectedTalle={selectedTalle}
                onColorChange={handleColorChange}
                onTalleChange={handleTalleChange}
              />
            </section>
          </div>

          {relacionados.length > 0 && (
            <section className="pdp-rel">
              <div className="pdp-wrap">
                <h2 className="pdp-rel__title">También te puede gustar</h2>
                <div className="pdp-rel__grid">
                  {relacionados.map((p) => (
                    <Producto key={p.id_producto} producto={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          <OpinionesProducto
            idProducto={producto.id_producto}
            nombreProducto={producto.nombre}
          />
        </>
      )}

      <Footer />
    </div>
  )
}

export default ViewProducto
