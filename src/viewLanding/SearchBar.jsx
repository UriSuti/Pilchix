// INSERT INTO Busqueda (
//     id_usuario,
//     texto_busqueda,
//     fecha
// )
// VALUES (
//     @id_usuario,
//     @texto_busqueda,
//     GETDATE()
// );

// SELECT 
//     p.id_producto,
//     p.nombre,
//     p.descripcion,
//     p.precio,
//     p.stock,
//     p.estado,
//     p.fecha_alta,
//     m.nombre AS marca
// FROM Producto p
// INNER JOIN Marca m ON p.id_marca = m.id_marca
// WHERE 
//     p.nombre LIKE '%' + @texto_busqueda + '%'
//     OR p.descripcion LIKE '%' + @texto_busqueda + '%'
//     OR m.nombre LIKE '%' + @texto_busqueda + '%';

// SELECT 
//     p.id_producto,
//     p.nombre,
//     p.descripcion,
//     p.precio,
//     p.stock,
//     m.nombre AS marca,
//     c.nombre AS categoria
// FROM Producto p
// INNER JOIN Marca m ON p.id_marca = m.id_marca
// INNER JOIN Producto_Categoria pc ON p.id_producto = pc.id_producto
// INNER JOIN Categoria c ON pc.id_categoria = c.id_categoria
// WHERE c.nombre LIKE '%' + @texto_busqueda + '%';