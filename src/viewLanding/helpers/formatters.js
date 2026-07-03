import { getImagenPortada } from "../../utils/producto";

export const isValidUserId = (value) =>
  value !== undefined && value !== null && value !== "" && value !== "undefined";

export const formatSuscripciones = (suscripcionesData = []) =>
  suscripcionesData.map((suscripcion) => ({
    id_suscripcion: suscripcion.id_suscripcion,
    id_marca: suscripcion.id_marca,
    fecha_inicio: suscripcion.fecha_inicio,
    marca: suscripcion.Marca?.nombre ?? "Marca sin nombre",
  }));

export const formatCategorias = (categoriasData = [], productosCategoriasData = []) =>
  categoriasData.map((categoria) => {
    const relacion = productosCategoriasData.find(
      (item) =>
        item.id_categoria === categoria.id_categoria &&
        item.Producto &&
        item.Producto.Imagen?.length > 0
    );

    return {
      ...categoria,
      imagen_categoria: getImagenPortada(relacion?.Producto?.Imagen)?.imagen ?? null,
    };
  });

export const formatMarcasPopulares = (marcasMetricasData = []) =>
  marcasMetricasData
    .map((marca) => {
      const totalVisualizaciones =
        marca.Producto?.reduce((total, producto) => {
          const visualizacionesProducto =
            producto.Metrica_Producto?.reduce(
              (subtotal, metrica) => subtotal + Number(metrica.visualizaciones || 0),
              0
            ) ?? 0;

          return total + visualizacionesProducto;
        }, 0) ?? 0;

      return {
        id_marca: marca.id_marca,
        nombre: marca.nombre,
        descripcion: marca.descripcion,
        logo: marca.logo,
        sitio_web: marca.sitio_web,
        ubicacion: marca.ubicacion,
        total_visualizaciones: totalVisualizaciones,
      };
    })
    .sort((a, b) => b.total_visualizaciones - a.total_visualizaciones);

export const formatProductosPopulares = (productosData = []) =>
  productosData
    .map((producto) => ({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: getImagenPortada(producto.Imagen)?.imagen ?? null,
      visualizaciones: producto.Metrica_Producto?.[0]?.visualizaciones || 0,
      marca: producto.Marca?.nombre ?? "The North Face",
      categoria: producto.descripcion?.slice(0, 12) ?? "11km",
    }))
    .sort((a, b) => b.visualizaciones - a.visualizaciones)
    .slice(0, 8);

export const formatDescuentos = (descuentosData = []) =>
  descuentosData.map((descuento) => ({
    id_descuento: descuento.id_descuento,
    porcentaje: descuento.porcentaje,
    precio_anterior: descuento.precio_anterior,
    precio_final: descuento.precio_final,
    fecha_inicio: descuento.fecha_inicio,
    fecha_fin: descuento.fecha_fin,
    id_producto: descuento.Producto?.id_producto,
    producto: descuento.Producto?.nombre,
    descripcion: descuento.Producto?.descripcion,
    precio: descuento.Producto?.precio,
    imagen: getImagenPortada(descuento.Producto?.Imagen)?.imagen ?? null,
    marca: descuento.Producto?.Marca?.nombre ?? "The North Face",
  }));

export const formatSearchProducts = (productosData = []) =>
  productosData.map((producto) => ({
    id_producto: producto.id_producto,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    imagen: getImagenPortada(producto.Imagen)?.imagen ?? null,
    marca: producto.Marca?.nombre ?? "Sin marca",
    categoria: null,
  }));

export const formatSearchCategoryProducts = (categoriasData = []) =>
  categoriasData
    .filter((item) => item.Producto?.id_producto)
    .map((item) => ({
      id_producto: item.Producto.id_producto,
      nombre: item.Producto.nombre,
      descripcion: item.Producto.descripcion,
      precio: item.Producto.precio,
      stock: item.Producto.stock,
      imagen: getImagenPortada(item.Producto.Imagen)?.imagen ?? null,
      marca: item.Producto.Marca?.nombre ?? "Sin marca",
      categoria: item.Categoria?.nombre ?? null,
    }));

export const mergeResultadosBusqueda = (...colecciones) => {
  const unicos = new Map();

  colecciones.flat().forEach((producto) => {
    if (!unicos.has(producto.id_producto)) {
      unicos.set(producto.id_producto, producto);
    }
  });

  return Array.from(unicos.values());
};

export const buildLandingResumen = ({ categorias = [], marcas = [], descuentos = [] }) => ({
  categorias: categorias.length,
  marcas: marcas.length,
  descuentos: descuentos.length,
});
