import './filtroLocal.css'

function FiltroLocal({ search, setSearch, orden, setOrden }) {
  return (
    <section className="filtro-local">
      <div className="contenedor-filtros">
        <div className="busqueda-productos">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ordenar-productos">
          <select value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="">Ordenar</option>
            <option value="lowPrice">Menor precio</option>
            <option value="highPrice">Mayor precio</option>
            <option value="bestSeller">Más vendidos</option>
          </select>
        </div>

        <div className="suscripcion">
          <p>
            recibir notificaciones de novedades{" "}
            <a href="#">suscribirme</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FiltroLocal;