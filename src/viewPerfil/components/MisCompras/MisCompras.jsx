import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getComprasUsuario } from "../../services/perfil";
import { slugify } from "../../../utils/slugify.js";
import "./MisCompras.css";

const formatPrecio = (v) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(Number(v || 0));

const formatFecha = (f) => {
  if (!f) return "";
  return new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
};

function MisCompras() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      const { data } = await getComprasUsuario();
      if (!activo) return;
      setCompras(data ?? []);
      setCargando(false);
    })();
    return () => { activo = false; };
  }, []);

  if (cargando) return <p className="perfil-vacio">Cargando...</p>;

  if (compras.length === 0) {
    return (
      <div className="perfil-vacio">
        <p>Todavía no hiciste ninguna compra.</p>
        <button className="perfil-agregar" onClick={() => navigate("/")}>
          <span className="perfil-agregar__icono">+</span>
          Explorar productos
        </button>
      </div>
    );
  }

  return (
    <div className="mis-compras">
      {compras.map((compra) => (
        <div key={compra.id_compra} className="compra-ticket">
          <div className="compra-ticket__head">
            <span className="compra-ticket__fecha">{formatFecha(compra.fecha)}</span>
            <span className="compra-ticket__total">{formatPrecio(compra.monto_total)}</span>
          </div>

          <div className="compra-ticket__items">
            {(compra.Compra_Detalle ?? []).map((d) => {
              const prod = d.Producto;
              const imagen = prod?.Imagen?.[0]?.imagen;
              return (
                <div
                  key={d.id_detalle}
                  className="compra-item"
                  onClick={() => prod && navigate(`/producto/${slugify(prod.nombre)}`)}
                >
                  {imagen ? (
                    <img src={imagen} alt={prod?.nombre} className="compra-item__img" />
                  ) : (
                    <div className="compra-item__ph">{prod?.nombre?.charAt(0)}</div>
                  )}
                  <div className="compra-item__info">
                    <h4>{prod?.nombre ?? "Producto"}</h4>
                    <span>
                      {d.cantidad} u.
                      {d.talle ? ` · Talle ${d.talle}` : ""}
                    </span>
                  </div>
                  <strong className="compra-item__precio">{formatPrecio(d.precio_unitario)}</strong>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MisCompras;