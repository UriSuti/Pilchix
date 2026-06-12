import './viewProducto.css'
import GaleriaProducto from './components/GaleriaProducto/GaleriaProducto.jsx'
import InfoProducto from './components/InfoProducto/InfoProducto.jsx'

function ViewProducto() {
  return (
    <div className="view-producto">
      <main className="contenido-producto">
        <GaleriaProducto />
        <InfoProducto />
      </main>
    </div>
  )
}

export default ViewProducto
