import './viewProducto.css'
import { useEffect, useState, useRef } from 'react'
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
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedTalle, setSelectedTalle] = useState(null)
  const contadoRef = useRef(null)
  const { textoBusqueda, setTextoBusqueda, buscarProductos, resultadosBusqueda } = useLandingSearch()
  usePaginaCargando(loading)

  const productId = producto?.id_producto ?? producto?.id ?? producto?.id_marca ?? 'unknown'
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

      if (found && contadoRef.current !== found.id_producto) {
        contadoRef.current = found.id_producto   // marca este producto como contado
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
          <GaleriaProducto producto={producto} loading={loading} selectedColor={selectedColor} />
          <InfoProducto
            producto={producto}
            loading={loading}
            selectedColor={selectedColor}
            selectedTalle={selectedTalle}
            onColorChange={handleColorChange}
            onTalleChange={handleTalleChange}
          />
        </main>
      )}
      <Footer />
    </div>
  )
}

export default ViewProducto
