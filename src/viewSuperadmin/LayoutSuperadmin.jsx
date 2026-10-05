import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../viewAdmin/LayoutAdmin.css";
import "./Superadmin.css";

const NAV = [
  { to: "/superadmin", label: "Pagos pendientes", end: true },
  { to: "/superadmin/historial", label: "Historial de pagos" },
];

function LayoutSuperadmin() {
  const navigate = useNavigate();
  const { admin, estaLogueado, cargando, logout } = useAdminAuth();

  if (cargando) return null;
  if (!estaLogueado) return <Navigate to="/superadmin/login" replace />;

  // si el token venció, las páginas llaman a esto y volvemos al login
  const sesionVencida = () => { logout(); navigate("/superadmin/login", { replace: true }); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div>
            <strong>PILCHIX</strong>
            <span>Administración · {admin.nombre}</span>
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

        <button className="admin-sidebar__logout" onClick={sesionVencida}>
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-content">
        <Outlet context={{ sesionVencida }} />
      </main>
    </div>
  );
}

export default LayoutSuperadmin;
