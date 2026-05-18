import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import ViewLanding from './viewLanding/ViewLanding'

function App() {
  const [productos, setProductos] = useState([])


  supabase.from("Producto").select("nombre").then(res =>{
    console.log(res.data);
     
  })


  useEffect(() => {
    async function getProductos() {
      const { data, error } = await supabase
        .from('Producto')
        .select('*')
        
      if (data) {
        setProductos(data)
      }

      if (error) {
        console.log(error)
      }
    }

    getProductos()
  }, [])

  
  return (
    <ul>
      {productos.map((producto) => (
        <li key={producto.id_producto}>
          {producto.nombre} - ${producto.precio}
        </li>
      ))}
    </ul>
  )
}

export default App