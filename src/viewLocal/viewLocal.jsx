import CarruselFachadaLocal from "./carruselFachadaLocal"
import FiltroLocal from "./filtroLocal"

function viewLocal(){

    return (
    <div className="view-local">
      <CarruselFachadaLocal />
      <FiltroLocal />
      <main className="view-content">
        <SeccionPrendas titulo="Productos Destacados" productos={productosDestacados} tipo="destacados" />
        <SeccionPrendas titulo="Productos SALE 🔥" productos={productosSale} tipo="sale" />
        <div className="spacer-footer" />
      </main>
      <Footer />
    </div>
    )

}

export default viewLocal