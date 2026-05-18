// SELECT TOP 5
//     p.id_producto,
//     p.nombre,
//     p.descripcion,
//     p.precio,
//     i.imagen,
//     mp.visualizaciones
// FROM Producto p
// INNER JOIN Imagen i ON p.id_producto = i.id_producto
// INNER JOIN Metrica_Producto mp ON p.id_producto = mp.id_producto
// WHERE p.estado = 1
// ORDER BY mp.visualizaciones DESC;