import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'
import CarruselFachadaLocal from './CarruselFachadaLocal.jsx'
import FiltroLocal from './FiltroLocal.jsx'
import SeccionPrendasLocal from './SeccionPrendasLocal.jsx'
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";

function ViewLocal({ local }) {  

  const [search, setSearch] = useState('');
  const [orden, setOrden] = useState('');
  const [productosDestacados, setproductosDestacados] = useState([]);
  const [imgMarca, setImgMarca] = useState(null);

  const productosFiltrados = productosDestacados.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === 'lowPrice') return a.precio - b.precio;
    if (orden === 'highPrice') return b.precio - a.precio;
    if (orden === 'bestSeller') return (b.ventas || 0) - (a.ventas || 0);
    return 0;
  });

  useEffect(() => {
    async function getProductos() {
      const { data, error } = await supabase
        .from('Producto')
        .select('*, Imagen(*)')
        .eq('id_marca', local)
              
        
      if (data) {
        setproductosDestacados(data)
      }

      if (error) {
        console.log(error)
      }
    }

    getProductos()
  }, [])    
  
  useEffect(() => {
    async function getMarca() {
      const { data, error } = await supabase
        .from('Marca')
        .select('imagen_fachada')
        .eq('id_marca', local)
        
        
      if (data) {
        setImgMarca(data[0].imagen_fachada)
      }

      if (error) {
        console.log(error)
      }
    }
    getMarca()
  }, [])  
  
    return (
    <div className="view-local">
     


      <CarruselFachadaLocal marca={imgMarca}/>
      <FiltroLocal search={search} setSearch={setSearch} orden={orden} setOrden={setOrden} />
      <main className="view-content">
        <SeccionPrendasLocal productos={productosOrdenados} />
        <div className="spacer-footer" />
      </main>
    </div>
    )

}

export default ViewLocal