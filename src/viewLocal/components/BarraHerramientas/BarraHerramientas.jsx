import './BarraHerramientas.css'

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const IconFiltros = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

function BarraHerramientas({ orden, setOrden, cantidad = 0 }) {
  return (
    <section className="barra-herramientas">
      <div className="barra-herramientas__fila">
        {/* tabs */}
        <div className="barra-herramientas__tabs">
          <button type="button" className="barra-herramientas__tab is-active">
            Productos
          </button>
          <button type="button" className="barra-herramientas__tab">
            Categorías
          </button>
        </div>

        {/* acciones derecha */}
        <div className="barra-herramientas__acciones">
          <div className="barra-herramientas__orden">
            <span className="barra-herramientas__orden-label">Ordenar por</span>
            <div className="barra-herramientas__orden-control">
              <select
                className="barra-herramientas__orden-select"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="">Destacados</option>
                <option value="lowPrice">Menor precio</option>
                <option value="highPrice">Mayor precio</option>
                <option value="bestSeller">Más vendidos</option>
              </select>
              <span className="barra-herramientas__orden-flecha"><IconChevron /></span>
            </div>
          </div>

          <button type="button" className="barra-herramientas__filtros">
            <IconFiltros />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* contador */}
      <p className="barra-herramientas__contador">
        {cantidad} {cantidad === 1 ? 'producto encontrado' : 'productos encontrados'}
      </p>
    </section>
  )
}

export default BarraHerramientas
