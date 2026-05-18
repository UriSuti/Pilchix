// SELECT 
//     id_marca,
//     nombre,
//     descripcion,
//     logo,
//     sitio_web,
//     ubicacion
// FROM Marca
// WHERE estado = 1;

// SELECT 
//     m.id_marca,
//     m.nombre,
//     m.descripcion,
//     m.logo,
//     m.sitio_web,
//     m.ubicacion,
//     SUM(mp.visualizaciones) AS total_visualizaciones
// FROM Marca m
// INNER JOIN Producto p ON m.id_marca = p.id_marca
// INNER JOIN Metrica_Producto mp ON p.id_producto = mp.id_producto
// WHERE m.estado = 1
// GROUP BY 
//     m.id_marca,
//     m.nombre,
//     m.descripcion,
//     m.logo,
//     m.sitio_web,
//     m.ubicacion
// ORDER BY total_visualizaciones DESC;