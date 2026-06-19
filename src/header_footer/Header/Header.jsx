import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { useLandingSearch } from "../../hooks/useLandingSearch";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./Header.css";

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function Header({ idUsuario = null }) {
  const navigate = useNavigate();

  const { mostrarToast } = useToast();

  const {
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    cargando,
    buscarProductos,
  } = useLandingSearch(idUsuario);

  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const perfilRef = useRef(null);

  const searchWrapperRef = useRef(null);

  const { estaLogueado, usuario, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setTextoBusqueda("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setTextoBusqueda]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (perfilRef.current && !perfilRef.current.contains(event.target)) {
        setMenuPerfilAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <a className="site-header__brand" onClick={() => navigate("/")}>
        PILCHIX
      </a>

      <div className="site-header__search-wrapper" ref={searchWrapperRef}>
        <form className="site-header__search" onSubmit={buscarProductos}>
          <span className="site-header__search-icon" aria-hidden="true">
            <IconSearch />
          </span>
          <input
            type="search"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            placeholder="Buscá prendas, marcas y categorías"
            aria-label="Buscar productos"
          />
          {textoBusqueda && (
            <button
              className="site-header__search-clear"
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setTextoBusqueda("")}
            >
              <IconClose />
            </button>
          )}
        </form>

        {textoBusqueda.trim() && (
          <SearchBar resultados={resultadosBusqueda} textoBusqueda={textoBusqueda} cargando={cargando} />
        )}
      </div>

      <div className="site-header__actions" aria-label="Acciones">
        <button className="site-header__action" type="button" aria-label="Carrito" onClick={() => navigate('/carrito')}>
          <IconCart />
        </button>
        <button className="site-header__action" type="button" aria-label="Notificaciones">
          <IconBell />
        </button>
        <div className="site-header__perfil" ref={perfilRef}>
          <button
            className="site-header__action site-header__action--profile"
            type="button"
            aria-label="Perfil"
            onClick={() =>
              estaLogueado ? setMenuPerfilAbierto((v) => !v) : navigate("/login")
            }
          >{estaLogueado && usuario.foto_perfil ? (
            <img src={usuario.foto_perfil} alt="Perfil" className="site-header__avatar" />
          ) : (
            <IconUser />
          )}
          </button>

          {estaLogueado && menuPerfilAbierto && (
            <div className="site-header__perfil-menu">
              <p className="site-header__perfil-nombre">Hola, {usuario.nombre}</p>
              <button
                type="button"
                onClick={() => { setMenuPerfilAbierto(false); navigate("/perfil"); }}
              >
                Mi perfil
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuPerfilAbierto(false);
                  mostrarToast("Cerraste sesión", "info");
                  navigate("/");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;