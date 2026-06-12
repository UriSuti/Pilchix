import "./viewLocal.css";
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../header_footer/Header/Header.jsx'
import Footer from '../header_footer/Footer/Footer.jsx'
import CarruselFachadaLocal from './components/CarruselFachadaLocal/carruselFachadaLocal.jsx'
import FiltroLocal from './components/FiltroLocal/filtroLocal.jsx'
import SeccionPrendasLocal from './components/SeccionPrendasLocal/seccionPrendasLocal.jsx'
import { useLocalData } from './hooks/useLocalData.js'
import { useLandingData } from '../hooks/useLandingData'
import { useLandingSearch } from '../hooks/useLandingSearch'
import { slugify } from '../utils/slugify.js'
import ViewLocalSkeleton from "./components/ViewLocalSkeleton/ViewLocalSkeleton.jsx";

function ViewLocal() {
  const { storeSlug } = useParams()
  const [search, setSearch] = useState('')
  const [orden, setOrden] = useState('')

  // 1) traigo todas las marcas y encuentro la que pide la URL
  const { landingData, loading: cargandoMarcas } = useLandingData()
  const marca = landingData.marcas.find((m) => slugify(m.nombre) === storeSlug)

  // 2) cargo los datos de ESA marca
  const { productos = [], imagenFachada, loading, error } = useLocalData(marca?.id_marca)

  // 3) búsqueda del header
  const { textoBusqueda, setTextoBusqueda, buscarProductos, resultadosBusqueda } = useLandingSearch()

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === 'lowPrice') return a.precio - b.precio
    if (orden === 'highPrice') return b.precio - a.precio
    if (orden === 'bestSeller') return (b.ventas || 0) - (a.ventas || 0)
    return 0
  })

  const cargando = cargandoMarcas || loading
  const noEncontrado = !cargandoMarcas && !marca

  return (
    <div className="view-local">
      <Header
        textoBusqueda={textoBusqueda}
        onBusquedaChange={setTextoBusqueda}
        onBuscar={buscarProductos}
        resultados={resultadosBusqueda}
      />

      {cargando && <ViewLocalSkeleton />}

      {!cargando && noEncontrado && (
        <div className="view-estado">No encontramos ese local 😕</div>
      )}

      {!cargando && error && (
        <div className="view-estado">Ups, algo salió mal. Probá recargar.</div>
      )}

      {!cargando && marca && !error && (
        <div className="contenido-local">
          <CarruselFachadaLocal marca={imagenFachada} />
          <FiltroLocal search={search} setSearch={setSearch} orden={orden} setOrden={setOrden} />
          <main className="view-content">
            <SeccionPrendasLocal productos={productosOrdenados} />
            <div className="spacer-footer" />
            <footer><Footer /></footer>
          </main>
        </div>
      )}
    </div>
)
}

export default ViewLocal