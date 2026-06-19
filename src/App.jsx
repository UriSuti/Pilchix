import './App.css'
import { Routes, Route } from 'react-router-dom'
import ViewLanding from './viewLanding/ViewLanding.jsx'
import ViewLocal from './viewLocal/viewLocal.jsx'
import ViewProducto from './viewProducto/viewProducto.jsx'
import SesionTest from './SessionTest.jsx'
import Login from './viewAuth/Login.jsx'
import Registro from './viewAuth/Registro.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ViewLanding />} />
      <Route path="/producto" element={<ViewProducto />} />
      <Route path="/:storeSlug" element={<ViewLocal />} />
      <Route path="/test" element={<SesionTest />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  )
}

export default App