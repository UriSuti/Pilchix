import { useState } from "react";
import supabase from "../utils/supabase";

function SearchBar({ id_usuario }) {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState([]);

  async function buscarProductos(e) {
    e.preventDefault();

    const texto_busqueda = textoBusqueda.trim();

    if (texto_busqueda === "") {
      return;
    }

    const { error: errorBusqueda } = await supabase
      .from("Busqueda")
      .insert([
        {
          id_usuario: id_usuario,
          texto_busqueda: texto_busqueda,
          fecha: new Date().toISOString(),
        },
      ]);

    if (errorBusqueda) {
      console.error("Error al guardar búsqueda:", errorBusqueda);
    }

    const { data: productosData, error: errorProductos } = await supabase
      .from("Producto")
      .select(`
        id_producto,
        nombre,
        descripcion,
        precio,
        stock,
        estado,
        fecha_alta,
        Marca (
          nombre
        )
      `)
      .or(
        `nombre.ilike.%${texto_busqueda}%,descripcion.ilike.%${texto_busqueda}%,Marca.nombre.ilike.%${texto_busqueda}%`
      );

    if (errorProductos) {
      console.error("Error al buscar productos:", errorProductos);
      return;
    }

    const productosFormateados = productosData.map((producto) => ({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      estado: producto.estado,
      fecha_alta: producto.fecha_alta,
      marca: producto.Marca?.nombre,
    }));

    setProductos(productosFormateados);

    const { data: productosCategoriaData, error: errorProductosCategoria } =
      await supabase
        .from("Producto_Categoria")
        .select(`
          Producto (
            id_producto,
            nombre,
            descripcion,
            precio,
            stock,
            Marca (
              nombre
            )
          ),
          Categoria (
            nombre
          )
        `)
        .ilike("Categoria.nombre", `%${texto_busqueda}%`);

    if (errorProductosCategoria) {
      console.error("Error al buscar productos por categoría:", errorProductosCategoria);
      return;
    }

    const productosCategoriaFormateados = productosCategoriaData.map((item) => ({
      id_producto: item.Producto?.id_producto,
      nombre: item.Producto?.nombre,
      descripcion: item.Producto?.descripcion,
      precio: item.Producto?.precio,
      stock: item.Producto?.stock,
      marca: item.Producto?.Marca?.nombre,
      categoria: item.Categoria?.nombre,
    }));

    setProductosPorCategoria(productosCategoriaFormateados);
  }

  return (
    
  );
}

export default SearchBar;