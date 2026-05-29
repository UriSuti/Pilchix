import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'
import useLocalData from './hooks/useLocalData.js'
import Header from '../header_footer/Header/Header.jsx'
import Footer from '../header_footer/Footer/Footer.jsx'
import CarruselFachadaLocal from './components/CarruselFachadaLocal/carruselFachadaLocal.jsx'
import FiltroLocal from './components/FiltroLocal/FiltroLocal.jsx'
import SeccionPrendasLocal from './components/SeccionPrendasLocal/SeccionPrendasLocal.jsx'

function ViewLocal({ local }) {  

  const [search, setSearch] = useState('');
  const [orden, setOrden] = useState('');
  const { productos, imagenFachada, loading, error } = useLocalData(local);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === 'lowPrice') return a.precio - b.precio;
    if (orden === 'highPrice') return b.precio - a.precio;
    if (orden === 'bestSeller') return (b.ventas || 0) - (a.ventas || 0);
    return 0;
  });

  if (loading) {
    return <div className="view-local">Cargando...</div>;
  }

  if (error) {
    return <div className="view-local">Error: {error}</div>;
  }
    
    return (
    <div className="view-local">
      <Header/>
      <CarruselFachadaLocal marca={imgMarca}/>
      <FiltroLocal search={search} setSearch={setSearch} orden={orden} setOrden={setOrden} />
      <main className="view-content">
        <SeccionPrendasLocal productos={productosOrdenados} />
        <div className="spacer-footer" />
        <footer>
          <Footer />
        </footer>
      </main>
    </div>
    )

}

export default ViewLocal