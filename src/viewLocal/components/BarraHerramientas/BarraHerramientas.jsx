import './BarraHerramientas.css'

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

function BarraHerramientas({ orden, setOrden, busqueda = '', setBusqueda, cantidad = 0 }) {
  return (
    <section className="barra-herramientas">
      <div className="barra-herramientas__fila">
        {/* título de la sección */}
        <div className="barra-herramientas__tabs">
          <span className="barra-herramientas__tab is-active">Productos</span>
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

          <div className="barra-herramientas__buscar">
            <span className="barra-herramientas__buscar-icon"><IconSearch /></span>
            <input
              type="search"
              className="barra-herramientas__buscar-input"
              placeholder="Buscar en este local"
              value={busqueda}
              onChange={(e) => setBusqueda?.(e.target.value)}
              aria-label="Buscar productos del local"
            />
          </div>
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
