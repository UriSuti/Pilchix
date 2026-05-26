import "./Header.css";

function Header({
  cantidadProductos = 0,
  suscripciones = [],
  textoBusqueda = "",
  onBusquedaChange,
  onBuscar,
}) {
  return (
    <header className="site-header">
      <div className="site-header__brand">PILCHIX</div>

      <form className="site-header__search" onSubmit={onBuscar}>
        <span className="site-header__search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={textoBusqueda}
          onChange={(event) => onBusquedaChange(event.target.value)}
          placeholder="Buscar prendas, marcas y categorias"
          aria-label="Buscar productos"
        />
      </form>

      <div className="site-header__actions" aria-label="Acciones">
        <button className="site-header__action" type="button" aria-label="Carrito">
          🛒
          <span>{cantidadProductos}</span>
        </button>
        <button className="site-header__action" type="button" aria-label="Notificaciones">
          🔔
          <span>{suscripciones.length}</span>
        </button>
        <button className="site-header__action site-header__action--profile" type="button" aria-label="Perfil">
          👤
        </button>
      </div>
    </header>
  );
}

export default Header;