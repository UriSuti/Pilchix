function selectProductos() {
  const [productos, setProductos] = useState([])

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

function insertProductos() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    async function getProductos() {
      const { data, error } = await supabase
        .from('Producto')
        .insert({ id_producto: 1, id_marca: 2, nombre: "Reloj Divaldi", descripcion: "lorem ipsum dolor sit amet", precio:1000, stock: 10, estado:true, fecha_alta: "2025-01-10"})
        
      if (data) {
        setProductos(data)
      }

      if (error) {
        console.log(error)
      }
    }

    getProductos()
  }, [])

}