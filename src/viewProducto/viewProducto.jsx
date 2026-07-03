import './viewProducto.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { slugify } from '../utils/slugify'
import Footer from '../header_footer/Footer/Footer.jsx'
import Header from '../header_footer/Header/Header.jsx'
import { useLandingSearch } from '../hooks/useLandingSearch'
import GaleriaProducto from './components/GaleriaProducto/GaleriaProducto.jsx'
import InfoProducto from './components/InfoProducto/InfoProducto.jsx'
import { usePaginaCargando } from '../context/NavLoadingContext.jsx'

function ViewProducto() {
  const { productSlug } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const { textoBusqueda, setTextoBusqueda, buscarProductos, resultadosBusqueda } = useLandingSearch()
  usePaginaCargando(loading)

  useEffect(() => {
    let active = true

    async function loadProducto() {
      setLoading(true)
      const { data, error } = await supabase.from('Producto').select('*, Imagen(*)')

      if (!active) return

      if (error) {
        console.error(error)
        setProducto(null)
        setLoading(false)
        return
      }

      const found = (data || []).find((p) => slugify(p.nombre) === productSlug)
      setProducto(found || null)
      setLoading(false)

      if (found) {
        supabase
          .rpc('incrementar_visualizacion', { p_id_producto: found.id_producto })
          .then(({ error: rpcError }) => {
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

  return (
    <div className="view-producto">
      <Header
        textoBusqueda={textoBusqueda}
        onBusquedaChange={setTextoBusqueda}
        onBuscar={buscarProductos}
        resultados={resultadosBusqueda}
      />


      {noEncontrado ? (
        <div className="catpage__estado" style={{ padding: "80px 20px", textAlign: "center" }}>
          No encontramos ese producto 😕
        </div>
      ) : (
        <main className="contenido-producto">
          <GaleriaProducto producto={producto} loading={loading} />
          <InfoProducto producto={producto} loading={loading} />
        </main>
      )}
      <Footer />
    </div>
  )
}

export default ViewProducto
