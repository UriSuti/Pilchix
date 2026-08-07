import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { useLandingSearch } from "../../hooks/useLandingSearch";
import { Link } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { slugify } from "../../utils/slugify.js";
import "./Header.css";
import { useNotificaciones } from "../../hooks/useNotificaciones.js";

function textoNotificacion(n) {
  const marca = n.Marca?.nombre ?? "Una marca";
  const producto = n.Producto?.nombre ?? "un producto";
  if (n.tipo === "nuevo_producto") return `${marca} sumó: ${producto}`;
  if (n.tipo === "oferta") return `${marca} puso en oferta: ${producto}`;
  return `${marca}: ${producto}`;
}

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

function Header({ idUsuario = null, teal = false }) {
  const navigate = useNavigate();
  const { notificaciones, noLeidas, cargarLista, marcasLeidas } = useNotificaciones();
  const [notifAbierto, setNotifAbierto] = useState(false);
  const notifRef = useRef(null);
  
  const abrirNotificaciones = async () => {
    const abrir = !notifAbierto;
    setNotifAbierto(abrir);
    if (abrir) {
      await cargarLista();
      await marcasLeidas();
    }
  };

  const irANotificacion = (n) => {
    setNotifAbierto(false);
    if (n.Producto?.nombre) navigate(`/producto/${slugify(n.Producto.nombre)}`)
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [scrolled, setScrolled] = useState(false);

  // Mismo header en todas las páginas: se vuelve glass al bajar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { mostrarToast } = useToast();

  const {
    textoBusqueda,
    setTextoBusqueda,
    resultadosBusqueda,
    marcasBusqueda,
    categoriasBusqueda,
    cargando,
    buscarProductos,
  } = useLandingSearch(idUsuario);

  // Al apretar Enter: si lo buscado coincide con una marca, va directo a su local.
  const handleBuscar = (e) => {
    e.preventDefault();
    const q = textoBusqueda.trim().toLowerCase();
    if (!q) return;
    const marca =
      marcasBusqueda.find((m) => m.nombre?.toLowerCase() === q) ||
      marcasBusqueda.find((m) => m.nombre?.toLowerCase().startsWith(q)) ||
      marcasBusqueda[0];
    if (marca) {
      setTextoBusqueda("");
      navigate(`/${slugify(marca.nombre)}`);
      return;
    }
    buscarProductos(e);
  };

  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const perfilRef = useRef(null);

  const searchWrapperRef = useRef(null);

  const { estaLogueado, usuario, logout, idUsuario: idUsuarioActual } = useAuth();
  const { cantidad: cantidadCarrito } = useCarrito(idUsuarioActual)

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

  const headerClass = [
    "site-header",
    teal ? "site-header--teal" : "",
    scrolled ? "site-header--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <a className="site-header__brand" onClick={() => navigate("/")}>
        Pilchix
      </a>

      <div className="site-header__search-wrapper" ref={searchWrapperRef}>
        <form className="site-header__search" onSubmit={handleBuscar}>
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
          <SearchBar resultados={resultadosBusqueda} marcas={marcasBusqueda} categorias={categoriasBusqueda} textoBusqueda={textoBusqueda} cargando={cargando} />
        )}
      </div>

      <div className="site-header__actions" aria-label="Acciones">
        <button className="site-header__action site-header__action--carrito" type="button" aria-label="Carrito" title="Carrito" onClick={() => navigate('/carrito')}>
          <IconCart />
          {cantidadCarrito > 0 && (
            <span className="site-header__badge" key={cantidadCarrito}>
              {cantidadCarrito > 99 ? "99+" : cantidadCarrito}
            </span>
          )}
        </button>
        <div className="site-header__notif" ref={notifRef}>
          <button
            className="site-header__action site-header__action--notif"
            type="button"
            aria-label="Notificaciones"
            title="Notificaciones"
            onClick={abrirNotificaciones}
          >
            <IconBell />
            {noLeidas > 0 && <span className="site-header__badge">{noLeidas}</span>}
          </button>

          {notifAbierto && (
            <div className="site-header__notif-menu">
              <p className="site-header__notif-titulo">Notificaciones</p>
              {notificaciones.length === 0 ? (
                <p className="site-header__notif-vacio">No tenés notificaciones</p>
              ) : (
                notificaciones.map((n) => (
                  <div
                    key={n.id_notificacion}
                    className={`notif-item ${n.leida ? "" : "notif-item--nueva"}`}
                    onClick={() => irANotificacion(n)}
                  >
                    {n.Marca?.logo && <img src={n.Marca.logo} alt="" className="notif-item__logo" />}
                    <span className="notif-item__texto">{textoNotificacion(n)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="site-header__perfil" ref={perfilRef}>
          <button
            className="site-header__action site-header__action--profile"
            type="button"
            aria-label="Perfil"
            title="Perfil"
            onClick={() =>
              estaLogueado ? setMenuPerfilAbierto((v) => !v) : navigate("/login")
            }
          >{!estaLogueado ? (
              <IconUser />
            ) : usuario.foto_perfil ? (
              <img src={usuario.foto_perfil} alt="Perfil" className="site-header__avatar" />
            ) : (
              <span className="site-header__avatar-inicial">
                {usuario.nombre?.charAt(0).toUpperCase()}
              </span>
            )}
          </button>

          {estaLogueado && menuPerfilAbierto && (
            <div className="site-header__perfil-menu">
              <p className="site-header__perfil-nombre">Hola, {usuario.nombre}</p>
              <button
                type="button"
                className="site-header__perfil-link"
                onClick={() => { setMenuPerfilAbierto(false); navigate("/perfil"); }}
              >
                Mi perfil
              </button>
              <button
                type="button"
                className="site-header__logout"
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