import './App.css'
import { Routes, Route } from 'react-router-dom'
import ViewLanding from './viewLanding/ViewLanding.jsx'
import ViewLocal from './viewLocal/viewLocal.jsx'
import ViewProducto from './viewProducto/viewProducto.jsx'
import SesionTest from './SessionTest.jsx'
import Login from './viewAuth/Login.jsx'
import Registro from './viewAuth/Registro.jsx'
import CartPage from './viewCarrito/CartPage.jsx'
import Perfil from './viewPerfil/Perfil.jsx'
import ViewCategoria from './viewCategoria/ViewCategoria.jsx'
import ViewLocales from './viewLocales/ViewLocales.jsx'
import LayoutAdmin from './viewAdmin/LayoutAdmin.jsx'
import LoginMarca from './viewAdmin/Login/LoginMarca.jsx'
import Dashboard from './viewAdmin/Dashboard/Dashboard.jsx'
import Catalogo from './viewAdmin/Catalogo/Catalogo.jsx'
import AgregarProducto from './viewAdmin/AgregarProducto/AgregarProducto.jsx'
import Metricas from './viewAdmin/Metricas/Metricas.jsx'
import Configuracion from './viewAdmin/Configuracion/Configuracion.jsx'
import RegistroMarca from './viewAdmin/Login/RegistroMarca.jsx'
import EditarProducto from './viewAdmin/EditarProducto/EditarProducto.jsx'
import SoloInvitados from './components/SoloInvitados.jsx'
import SoloInvitadosMarca from './components/SoloInvitadosMarca.jsx'

function App() {
  return (
    <Routes>
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/" element={<ViewLanding />} />
      <Route path="/producto/:productSlug" element={<ViewProducto />} />
      <Route path="/categoria/:categorySlug" element={<ViewCategoria />} />
      <Route path="/locales" element={<ViewLocales />} />
      <Route path="/:storeSlug" element={<ViewLocal />} />
      <Route path="/test" element={<SesionTest />} />
      <Route path="/login" element={<SoloInvitados><Login /></SoloInvitados>} />
      <Route path="/registro" element={<SoloInvitados><Registro /></SoloInvitados>} />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/admin/login" element={<SoloInvitadosMarca><LoginMarca /></SoloInvitadosMarca>} />
      <Route path="/admin/registro" element={<SoloInvitadosMarca><RegistroMarca /></SoloInvitadosMarca>} />
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<Dashboard />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="catalogo/nuevo" element={<AgregarProducto />} />
        <Route path="catalogo/editar/:idProducto" element={<EditarProducto />} />
        <Route path="metricas" element={<Metricas />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  )
}

export default App