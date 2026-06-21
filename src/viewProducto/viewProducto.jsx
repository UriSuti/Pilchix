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

function ViewProducto() {
  const { productSlug } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const { textoBusqueda, setTextoBusqueda, buscarProductos, resultadosBusqueda } = useLandingSearch()

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
    }

    loadProducto()

    return () => {
      active = false
    }
  }, [productSlug])

  return (
    <div className="view-producto">
      <Header
        textoBusqueda={textoBusqueda}
        onBusquedaChange={setTextoBusqueda}
        onBuscar={buscarProductos}
        resultados={resultadosBusqueda}
      />


      <main className="contenido-producto">
        <GaleriaProducto producto={producto} loading={loading} />
        <InfoProducto producto={producto} loading={loading} />
      </main>
      <Footer />
    </div>
  )
}

export default ViewProducto
