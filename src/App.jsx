import './App.css'
import { useState, useEffect } from 'react'
import ViewLocal from './viewLocal/ViewLocal'
import ViewLanding from './viewLanding/ViewLanding'
import { getLandingCategoriasConProductos } from './viewLanding/services/landing'

function App() {

  const [local, setLocal] = useState(null);

  console.log(getLandingCategoriasConProductos())


  return (
    local !== null? <ViewLocal local={local} /> : <ViewLanding local={local} setLocal={setLocal} />
  )
}

export default App