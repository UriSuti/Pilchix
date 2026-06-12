import './seccionPrendasLocal.css'
import Producto from '../Producto/Producto.jsx'


function SeccionPrendasLocal({productos}){
  
  return (
    <section className="seccion-prendas-local">
      <div className="grid-productos">
        {productos.map((producto) => (
        
          <Producto producto={producto} />
        ))}
      </div>
    </section>
  );
}

export default SeccionPrendasLocal