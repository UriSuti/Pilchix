import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPruebasVirtuales } from "../../services/perfil";
import { slugify } from "../../../utils/slugify.js";

const formatFecha = (f) => {
  if (!f) return "";
  return new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
};

function MisPruebas() {
  const navigate = useNavigate();
  const [pruebas, setPruebas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      const { data } = await getPruebasVirtuales();
      if (!activo) return;
      setPruebas(data ?? []);
      setCargando(false);
    })();
    return () => { activo = false; };
  }, []);

  if (cargando) return <p className="perfil-vacio">Cargando...</p>;

  if (pruebas.length === 0) {
    return (
      <div className="perfil-vacio">
        <h3 className="perfil-vacio__titulo">Todavía no probaste ninguna prenda</h3>
        <p className="perfil-vacio__texto">
          Entrá a un producto y usá el probador virtual para ver cómo te queda.
        </p>
        <button className="perfil-agregar" onClick={() => navigate("/")}>
          Explorar productos
        </button>
      </div>
    );
  }

  return (
    <div className="perfil-grid">
      {pruebas.map((p) => (
        <div
          key={p.id_prueba}
          className="card-perfil"
          onClick={() => p.Producto && navigate(`/producto/${slugify(p.Producto.nombre)}`)}
        >
          <img src={p.imagen} alt={p.Producto?.nombre ?? "Prueba virtual"} className="card-perfil__img" />
          <span className="card-perfil__nombre">{p.Producto?.nombre ?? "Producto"}</span>
          <span className="card-perfil__fecha">{formatFecha(p.fecha)}</span>
        </div>
      ))}
    </div>
  );
}

export default MisPruebas;
