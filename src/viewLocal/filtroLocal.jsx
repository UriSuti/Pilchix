import { useEffect } from 'react';
import './filtroLocal.css'

function FiltroLocal({ search, setSearch, orden, setOrden }){

  return (
    <section className="filtro-local">
      <div className="contenedor-filtros">
        {/* Buscador */}
        <div className="busqueda-productos">
          <input type="text" placeholder="Buscar productos" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>

        {/* Select de orden */}
        <div className="ordenar-productos">
          <select value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="">Ordenar</option>
            <option value="lowPrice">Menor precio</option>
            <option value="highPrice">Mayor precio</option>
            <option value="bestSeller">Más vendidos</option>
          </select>
        </div>

        {/* Texto lateral */}
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
export default FiltroLocal