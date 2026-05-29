function Producto({ producto }) {     
      const imagenUrl = producto.Imagen?.[0]?.imagen || '/placeholder.png';
   
        return <>
        <article className="card-producto">
          <img src={imagenUrl} alt={producto.nombre} />
          <h3>{producto.nombre}</h3>
          <p>${producto.precio.toFixed(2)}</p>
        </article>
    </>


}

export default Producto