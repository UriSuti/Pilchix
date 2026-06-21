import "./viewLocal.css";
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../header_footer/Header/Header.jsx'
import Footer from '../header_footer/Footer/Footer.jsx'
import HeroLocal from './components/HeroLocal/HeroLocal.jsx'
import FranjaBeneficios from './components/FranjaBeneficios/FranjaBeneficios.jsx'
import BarraHerramientas from './components/BarraHerramientas/BarraHerramientas.jsx'
import SeccionPrendasLocal from './components/SeccionPrendasLocal/seccionPrendasLocal.jsx'
import { useLocalData } from './hooks/useLocalData.js'
import { useLandingData } from '../hooks/useLandingData'
import { useLandingSearch } from '../hooks/useLandingSearch'
import { slugify } from '../utils/slugify.js'
import ViewLocalSkeleton from "./components/ViewLocalSkeleton/ViewLocalSkeleton.jsx";
import BotonSuscribirse from "./components/BotonSuscribirse/BotonSuscribirse.jsx";

function ViewLocal() {
  const { storeSlug } = useParams()
  const [orden, setOrden] = useState('')

  // 1) traigo todas las marcas y encuentro la que pide la URL
  const { landingData, loading: cargandoMarcas } = useLandingData()
  const marca = landingData.marcas.find((m) => slugify(m.nombre) === storeSlug)

  // 2) cargo los datos de ESA marca
  const { productos = [], imagenFachada, loading, error } = useLocalData(marca?.id_marca)

  // 3) búsqueda del header
  const { textoBusqueda, setTextoBusqueda, buscarProductos, resultadosBusqueda } = useLandingSearch()

  const productosOrdenados = [...productos].sort((a, b) => {
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
          <div className="local-hero">
            <HeroLocal marca={marca} imagenFachada={imagenFachada} />
            <div className="local-hero__suscribir">
              <BotonSuscribirse idMarca={marca.id_marca} nombreMarca={marca.nombre} />
            </div>
          </div>
          <FranjaBeneficios />
          <BarraHerramientas
            orden={orden}
            setOrden={setOrden}
            cantidad={productosOrdenados.length}
          />
          <main className="view-content">
            <SeccionPrendasLocal productos={productosOrdenados} />
          </main>
          <div className="spacer-footer" />
          <footer><Footer /></footer>
        </div>
      )}
    </div>
)
}

export default ViewLocal