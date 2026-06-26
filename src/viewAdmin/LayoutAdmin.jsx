import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMarcaAuth } from "../context/MarcaAuthContext";
import "./LayoutAdmin.css";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/catalogo", label: "Catálogo" },
  { to: "/admin/catalogo/nuevo", label: "Agregar producto" },
  { to: "/admin/metricas", label: "Métricas" },
  { to: "/admin/configuracion", label: "Configuración" },
];

function LayoutAdmin() {
  const navigate = useNavigate();
  const { marca, estaLogueada, cargando, logout } = useMarcaAuth();

  if (!cargando && !estaLogueada) {
    navigate("/admin/login");
    return null;
  }
  if (cargando || !marca) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          {marca.logo && <img src={marca.logo} alt={marca.nombre} />}
          <div>
            <strong>{marca.nombre}</strong>
            <span>Brand Portal</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? "admin-sidebar__link--activo" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="admin-sidebar__logout"
          onClick={() => { logout(); navigate("/admin/login"); }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;