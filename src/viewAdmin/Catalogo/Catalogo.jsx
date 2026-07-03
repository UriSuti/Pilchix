import { useNavigate } from "react-router-dom";
import { useMarcaAuth } from "../../context/MarcaAuthContext";
import { useCatalogo } from "../hooks/useCatalogo";
import { usePaginaCargando } from "../../context/NavLoadingContext";
import { getImagenPortada } from "../../utils/producto";
import "./Catalogo.css";

const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));

function Catalogo() {
  const navigate = useNavigate();
  const { idMarca } = useMarcaAuth();
  const { productos, cargando } = useCatalogo(idMarca);

  usePaginaCargando(cargando);

  return (
    <div className="catalogo">
      <header className="catalogo__head">
        <div>
          <h1>Catálogo de productos</h1>
          <p>{productos.length} productos</p>
        </div>
        <button className="catalogo__nuevo" onClick={() => navigate("/admin/catalogo/nuevo")}>
          + Agregar producto
        </button>
      </header>

      {!cargando && productos.length === 0 ? (
        <div className="catalogo__vacio">
          <p>Todavía no cargaste productos.</p>
          <button onClick={() => navigate("/admin/catalogo/nuevo")}>Agregar el primero</button>
        </div>
      ) : (
        <div className="catalogo__grid">
          {productos.map((p) => {
            const portada = getImagenPortada(p.Imagen);
            return (
            <article key={p.id_producto} className="prod-card">
              <div className="prod-card__img">
                {portada?.imagen ? (
                  <img src={portada.imagen} alt={p.nombre} />
                ) : (
                  <div className="prod-card__placeholder">{p.nombre?.charAt(0)}</div>
                )}
                <span className={`prod-card__estado ${p.estado ? "is-activo" : "is-inactivo"}`}>
                  {p.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="prod-card__body">
                <h3>{p.nombre}</h3>
                <div className="prod-card__meta">
                  <strong>{formatPrecio(p.precio)}</strong>
                  <span>Stock: {p.stock ?? 0}</span>
                </div>
              </div>
              <div className="prod-card__acciones">
                <button onClick={() => navigate(`/admin/catalogo/editar/${p.id_producto}`)}>
                  Editar
                </button>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Catalogo;