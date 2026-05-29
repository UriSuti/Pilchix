import { useRef, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar.jsx"; 
import "./Header.css";

function Header({
  textoBusqueda = "",
  onBusquedaChange,
  onBuscar,
  setLocal,
  resultados = [],
}) {

  const searchWrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        onBusquedaChange(""); 
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBusquedaChange]);

  return (
    <header className="site-header">
      <a className="site-header__brand" onClick={() => setLocal(null)}>
        PILCHIX
      </a>


      <div className="site-header__search-wrapper" ref={searchWrapperRef}>
        <form className="site-header__search" onSubmit={onBuscar}>
          <span className="site-header__search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={textoBusqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="Buscar prendas, marcas y categorias"
            aria-label="Buscar productos"
          />
          {textoBusqueda && (
            <button
              className="site-header__search-clear"
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onBusquedaChange("")}
            >
              ✕
            </button>
          )}
        </form>

        {textoBusqueda.trim() && (
          <SearchBar resultados={resultados} textoBusqueda={textoBusqueda} />
        )}
      </div>

      <div className="site-header__actions" aria-label="Acciones">
        <button className="site-header__action" type="button" aria-label="Carrito">🛒</button>
        <button className="site-header__action" type="button" aria-label="Notificaciones">🔔</button>
        <button className="site-header__action site-header__action--profile" type="button" aria-label="Perfil">👤</button>
      </div>
    </header>
  );
}

export default Header;