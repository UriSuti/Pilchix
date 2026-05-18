// SELECT 
//     d.id_descuento,
//     d.porcentaje,
//     d.precio_anterior,
//     d.precio_final,
//     d.fecha_inicio,
//     d.fecha_fin,
//     p.id_producto,
//     p.nombre AS producto,
//     p.descripcion,
//     p.precio,
//     i.imagen,
//     m.nombre AS marca
// FROM Descuento d
// INNER JOIN Producto p ON d.id_producto = p.id_producto
// INNER JOIN Marca m ON p.id_marca = m.id_marca
// LEFT JOIN Imagen i ON p.id_producto = i.id_producto
// WHERE 
//     GETDATE() BETWEEN d.fecha_inicio AND d.fecha_fin
//     AND p.estado = 1;