import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import CarruselFachadaLocal from './carruselFachadaLocal'
import FiltroLocal from './filtroLocal'
import SeccionPrendas from './seccionPrendasLocal.jsx'

function viewLocal(){
  
  const [productosDestacados, setproductosDestacados] = useState([]);
  const [productosSale, setproductosSale] = useState([]);

  useEffect(() => {
    async function getProductos() {
      const { data, error } = await supabase
        .from('Producto')
        .select('*')
        
      if (data) {
        setproductosDestacados(data)
                        
      }

      if (error) {
        console.log(error)
      }
    }

    getProductos()
  }, [])  

    return (
    <div className="view-local">
      <CarruselFachadaLocal />
      <FiltroLocal />
      <main className="view-content">
        <SeccionPrendas titulo="Productos Destacados"  tipo="destacados" />
        {/* <SeccionPrendas titulo="Productos SALE 🔥" productos={productosSale} tipo="sale" /> */}
        <div className="spacer-footer" />
      </main>
    </div>
    )

}

export default viewLocal