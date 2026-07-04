import "./ViewCategoria.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import Producto from "../viewLocal/components/Producto/Producto";
import CategoryCoverflow from "./components/CategoryCoverflow/CategoryCoverflow";
import FiltrosCategoria from "./components/FiltrosCategoria/FiltrosCategoria";
import { useCategoriasData } from "./hooks/useCategoriasData";
import ViewCategoriaSkeleton from "../components/skeletons/ViewCategoriaSkeleton";

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function ViewCategoria() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { categorias, loading, error } = useCategoriasData();

  const [marcasSel, setMarcasSel] = useState(() => new Set());
  const [tallesSel, setTallesSel] = useState(() => new Set());
  const [precio, setPrecio] = useState(null); // null = rango completo
  const [orden, setOrden] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // índice activo según el slug de la URL
  const indiceSlug = categorias.findIndex((c) => c.slug === categorySlug);
  const activeIndex = indiceSlug >= 0 ? indiceSlug : 0;
  const categoria = categorias[activeIndex] ?? null;

  // límites de precio de la categoría
  const precioBounds = useMemo(() => {
    const precios = (categoria?.productos ?? []).map((p) => Number(p.precio) || 0);
    return precios.length ? [Math.min(...precios), Math.max(...precios)] : [0, 0];
  }, [categoria]);
  const rango = precio ?? precioBounds;

  // marcas con su conteo de productos en la categoría
  const marcasConConteo = useMemo(() => {
    if (!categoria) return [];
    return categoria.marcas.map((m) => ({
      ...m,
      count: categoria.productos.filter((p) => p.Marca?.id_marca === m.id_marca).length,
    }));
  }, [categoria]);

  // al cambiar de categoría reseteo todos los filtros
  useEffect(() => {
    setMarcasSel(new Set());
    setTallesSel(new Set());
    setPrecio(null);
    setOrden("");
    setBusqueda("");
  }, [categoria?.id_categoria]);

  // cambiar de categoría = navegar a su slug (URL conectada y compartible)
  function irACategoria(i) {
    const total = categorias.length;
    if (total === 0) return;
    const cat = categorias[((i % total) + total) % total];
    if (cat) navigate(`/categoria/${cat.slug}`);
  }

  const toggleMarca = (id) =>
    setMarcasSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleTalle = (t) =>
    setTallesSel((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });

  const limpiar = () => {
    setMarcasSel(new Set());
    setTallesSel(new Set());
    setPrecio(null);
    setBusqueda("");
  };

  const hayFiltros =
    marcasSel.size > 0 ||
    tallesSel.size > 0 ||
    busqueda.trim() !== "" ||
    (precio !== null && (precio[0] > precioBounds[0] || precio[1] < precioBounds[1]));

  // productos filtrados (marca + precio + talle + búsqueda) y ordenados
  const productos = useMemo(() => {
    if (!categoria) return [];
    let lista = categoria.productos;

    if (marcasSel.size) lista = lista.filter((p) => marcasSel.has(p.Marca?.id_marca));

    lista = lista.filter((p) => {
      const v = Number(p.precio) || 0;
      return v >= rango[0] && v <= rango[1];
    });

    if (tallesSel.size) lista = lista.filter((p) => p._talles?.some((t) => tallesSel.has(t)));

    const termino = busqueda.trim().toLowerCase();
    if (termino) {
      lista = lista.filter((p) =>
        `${p.nombre ?? ""} ${p.descripcion ?? ""}`.toLowerCase().includes(termino)
      );
    }

    lista = [...lista].sort((a, b) => {
      if (orden === "lowPrice") return (a.precio ?? 0) - (b.precio ?? 0);
      if (orden === "highPrice") return (b.precio ?? 0) - (a.precio ?? 0);
      return 0;
    });

    return lista;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria, marcasSel, tallesSel, rango[0], rango[1], busqueda, orden]);

  const noEncontrada = !loading && categorias.length > 0 && indiceSlug < 0;

  return (
    <div className="view-categoria">
      <Header />

      {loading && <ViewCategoriaSkeleton />}

      {!loading && error && (
        <div className="catpage__estado">Ups, no pudimos cargar las categorías. Probá recargar.</div>
      )}

      {!loading && !error && categorias.length === 0 && (
        <div className="catpage__estado">Todavía no hay categorías para mostrar.</div>
      )}

      {!loading && !error && noEncontrada && (
        <div className="catpage__estado">
          No encontramos esa categoría 😕
          <Link className="catpage__volver" to={`/categoria/${categorias[0].slug}`}>
            Ver {categorias[0].nombre}
          </Link>
        </div>
      )}

      {!loading && !error && categoria && (
        <>
          <CategoryCoverflow
            categorias={categorias}
            activeIndex={activeIndex}
            onChange={irACategoria}
          />

          <div className="resbar">
            <div className="resbar__inner">
              <p className="resbar__count">
                <b>{productos.length}</b>{" "}
                {productos.length === 1 ? "producto" : "productos"}
              </p>
              <div className="resbar__right">
                <div className="resbar__sort">
                  <small>Ordenar por</small>
                  <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                    <option value="">Destacados</option>
                    <option value="lowPrice">Menor precio</option>
                    <option value="highPrice">Mayor precio</option>
                  </select>
                </div>
                <div className="resbar__search">
                  <IconSearch />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={`Buscar en ${categoria.nombre}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="catlayout">
            <FiltrosCategoria
              marcas={marcasConConteo}
              marcasSel={marcasSel}
              onToggleMarca={toggleMarca}
              talles={categoria.talles}
              tallesSel={tallesSel}
              onToggleTalle={toggleTalle}
              precioBounds={precioBounds}
              precio={rango}
              onPrecio={setPrecio}
              hayFiltros={hayFiltros}
              onLimpiar={limpiar}
            />

            <main className="catresults">
              {productos.length === 0 ? (
                <p className="catresults__empty">No hay productos que coincidan con los filtros.</p>
              ) : (
                <div className="catgrid">
                  {productos.map((producto) => (
                    <Producto key={producto.id_producto} producto={producto} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

export default ViewCategoria;
