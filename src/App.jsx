import './App.css'
import { Routes, Route } from 'react-router-dom'
import ViewLanding from './viewLanding/ViewLanding.jsx'
import ViewLocal from './viewLocal/viewLocal.jsx'
import ViewProducto from './viewProducto/viewProducto.jsx'
import SesionTest from './SessionTest.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ViewLanding />} />
      <Route path="/producto/:productSlug" element={<ViewProducto />} />
      <Route path="/:storeSlug" element={<ViewLocal />} />
      <Route path="/test" element={<SesionTest />} />
    </Routes>
  )
}

export default App