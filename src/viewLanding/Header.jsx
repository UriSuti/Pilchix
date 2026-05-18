// SELECT COUNT(*) AS cantidad_productos
// FROM Carrito_Detalle cd
// INNER JOIN Carrito c ON cd.id_carrito = c.id_carrito
// WHERE c.id_usuario = @id_usuario;

// SELECT 
//     s.id_suscripcion,
//     s.id_marca,
//     s.fecha_inicio,
//     m.nombre AS marca
// FROM Suscripcion s
// INNER JOIN Marca m ON s.id_marca = m.id_marca
// WHERE s.id_usuario = @id_usuario;