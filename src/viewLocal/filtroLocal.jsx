function FiltroLocal() {
  return (
    <section className="filtro-local">
      <div className="contenedor-filtros">
        {/* Buscador */}
        <div className="busqueda-productos">
          <input type="text" placeholder="Buscar productos" />
        </div>

        {/* Select de orden */}
        <div className="ordenar-productos">
          <select>
            <option>Ordenar</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>Más vendidos</option>
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

export default FiltroLocal;