import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import ViewLocal from './viewLocal/viewLocal'

function App() {


  
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