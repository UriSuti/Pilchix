import "./viewLocal.css";
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../header_footer/Header/Header.jsx'
import Footer from '../header_footer/Footer/Footer.jsx'
import HeroLocal from './components/HeroLocal/HeroLocal.jsx'
import BarraHerramientas from './components/BarraHerramientas/BarraHerramientas.jsx'
import SeccionPrendasLocal from './components/SeccionPrendasLocal/seccionPrendasLocal.jsx'
import { useLocalData } from './hooks/useLocalData.js'
import { useLandingData } from '../hooks/useLandingData'
import { useLandingSearch } from '../hooks/useLandingSearch'
import { slugify } from '../utils/slugify.js'
import ViewLocalSkeleton from "../components/skeletons/ViewLocalSkeleton.jsx";
import BotonSuscribirse from "./components/BotonSuscribirse/BotonSuscribirse.jsx";

function ViewLocal() {
  const { storeSlug } = useParams()
  const [orden, setOrden] = useState('')
  const [busqueda, setBusqueda] = useState('')

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

  const termino = busqueda.trim().toLowerCase()
  const productosFiltrados = termino
    ? productosOrdenados.filter((p) =>
        `${p.nombre ?? ''} ${p.descripcion ?? ''}`.toLowerCase().includes(termino)
      )
    : productosOrdenados

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
          <HeroLocal
            marca={marca}
            imagenFachada={imagenFachada}
            cantidadProductos={productos.length}
          >
            <BotonSuscribirse idMarca={marca.id_marca} nombreMarca={marca.nombre} />
          </HeroLocal>
          <BarraHerramientas
            orden={orden}
            setOrden={setOrden}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            cantidad={productosFiltrados.length}
          />
          <main className="view-content" id="local-productos" style={{ scrollMarginTop: "80px" }}>
            {productosFiltrados.length === 0 ? (
              <div className="view-estado">
                {busqueda
                  ? `No encontramos productos para “${busqueda}”.`
                  : "Este local todavía no cargó productos."}
              </div>
            ) : (
              <SeccionPrendasLocal productos={productosFiltrados} />
            )}
          </main>
          <div className="spacer-footer" />
          <footer><Footer /></footer>
        </div>
      )}
    </div>
)
}

export default ViewLocal