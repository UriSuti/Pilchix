// SELECT 
//     id_categoria,
//     nombre
// FROM Categoria
// ORDER BY nombre;

// SELECT 
//     c.id_categoria,
//     c.nombre,
//     MIN(i.imagen) AS imagen_categoria
// FROM Categoria c
// INNER JOIN Producto_Categoria pc ON c.id_categoria = pc.id_categoria
// INNER JOIN Producto p ON pc.id_producto = p.id_producto
// INNER JOIN Imagen i ON p.id_producto = i.id_producto
// WHERE p.estado = 1
// GROUP BY c.id_categoria, c.nombre;