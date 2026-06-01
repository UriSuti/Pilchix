import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import SearchBar from "./SearchBar/SearchBar.jsx";
import { useLandingSearch } from "../../hooks/useLandingSearch";
import "./Header.css";

function Header({
  idUsuario = null, 
}) {
  const navigate = useNavigate(); 

  const {
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    buscarProductos,
  } = useLandingSearch(idUsuario);

  const searchWrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setTextoBusqueda("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setTextoBusqueda]);

  return (
    <header className="site-header">
      {/* ✅ navigate("/") lleva a la landing, reemplaza setLocal?.(null) */}
      <a className="site-header__brand" onClick={() => navigate("/")}>
        PILCHIX
      </a>

      <div className="site-header__search-wrapper" ref={searchWrapperRef}>
        <form className="site-header__search" onSubmit={buscarProductos}>
          <span className="site-header__search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={textoBusqueda}
            onChange={(event) => setTextoBusqueda(event.target.value)}
            placeholder="Buscar prendas, marcas y categorias"
            aria-label="Buscar productos"
          />
          {textoBusqueda && (
            <button
              className="site-header__search-clear"
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setTextoBusqueda("")}
            >
              ✕
            </button>
          )}
        </form>

        {textoBusqueda.trim() && (
          <SearchBar resultados={resultadosBusqueda} textoBusqueda={textoBusqueda} />
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