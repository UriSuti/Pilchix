import { supabase } from '../../utils/supabase'
import { getImagenPortada } from '../../utils/producto'

// In-memory cache so repeated adds don't query Carrito every time
const cartIdCache = {}

// Avisa al resto de la app (ej: el badge del header) que el carrito cambió.
// delta = piezas sumadas/restadas (para el bump instantáneo); omitir si no se sabe.
function notificarCambioCarrito(delta) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('carrito:cambio', { detail: { delta } }))
}

async function obtenerOCrearCarrito(idUsuario) {
  if (cartIdCache[idUsuario]) return cartIdCache[idUsuario]

  const { data: existing, error: fetchError } = await supabase
    .from('Carrito')
    .select('id_carrito')
    .eq('id_usuario', idUsuario)
    .order('id_carrito', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchError) throw fetchError

  if (existing) {
    cartIdCache[idUsuario] = existing.id_carrito
    return existing.id_carrito
  }

  const { data: created, error: insertError } = await supabase
    .from('Carrito')
    .insert({ id_usuario: idUsuario })
    .select('id_carrito')
    .single()

  if (insertError) throw insertError
  cartIdCache[idUsuario] = created.id_carrito
  return created.id_carrito
}

export async function agregarAlCarrito({ idUsuario, idProducto, cantidad = 1, precioUnitario, talle, color }) {
  const idCarrito = await obtenerOCrearCarrito(idUsuario)

  const { data: existing } = await supabase
    .from('Carrito_Detalle')
    .select('id_detalle, cantidad')
    .eq('id_carrito', idCarrito)
    .eq('id_producto', idProducto)
    .eq('talle', talle)
    .eq('color', color)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('Carrito_Detalle')
      .update({ cantidad: existing.cantidad + cantidad })
      .eq('id_detalle', existing.id_detalle)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('Carrito_Detalle')
      .insert({ id_carrito: idCarrito, id_producto: idProducto, cantidad, precio_unitario: precioUnitario, talle, color })
    if (error) throw error
  }

  notificarCambioCarrito(cantidad)
}

export async function obtenerItemsCarrito(idUsuario) {
  const { data: carrito, error: carritoError } = await supabase
    .from('Carrito')
    .select('id_carrito')
    .eq('id_usuario', idUsuario)
    .order('id_carrito', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (carritoError) throw carritoError
  if (!carrito) return []

  cartIdCache[idUsuario] = carrito.id_carrito

  const { data: detalles, error: detallesError } = await supabase
    .from('Carrito_Detalle')
    .select('*')
    .eq('id_carrito', carrito.id_carrito)

  if (detallesError) throw detallesError
  if (!detalles.length) return []

  const productIds = detalles.map((d) => d.id_producto)

  const { data: productos, error: productosError } = await supabase
    .from('Producto')
    .select('id_producto, nombre, Imagen(imagen, es_portada)')
    .in('id_producto', productIds)

  if (productosError) throw productosError

  const productoMap = Object.fromEntries(productos.map((p) => [p.id_producto, p]))

  return detalles.map((d) => ({
    id_detalle: d.id_detalle,
    id: d.id_producto,
    nombre: productoMap[d.id_producto]?.nombre ?? '',
    precio: d.precio_unitario,
    color: d.color,
    talle: d.talle,
    cantidad: d.cantidad,
    imagen: getImagenPortada(productoMap[d.id_producto]?.Imagen)?.imagen ?? null,
  }))
}

export async function actualizarCantidadItem(idDetalle, cantidad) {
  const { error } = await supabase
    .from('Carrito_Detalle')
    .update({ cantidad })
    .eq('id_detalle', idDetalle)
  if (error) throw error
  notificarCambioCarrito()
}

export async function eliminarItemCarrito(idDetalle) {
  const { error } = await supabase
    .from('Carrito_Detalle')
    .delete()
    .eq('id_detalle', idDetalle)
  if (error) throw error
  notificarCambioCarrito()
}
