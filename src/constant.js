// ============================================
// CONSTANTS.JS — Fuente única de data del proyecto
// ============================================

// --------------------------------------------
// INFO DEL LOCAL
// --------------------------------------------
export const INFO_LOCAL = {
  nombre: "Nike",
  direccion: "Yatay 240, Almagro",
  horarioApertura: "08:00hs",
  horarioCierre: "20:00hs",
  estaAbierto: true,
  calificacion: 4.5,
  cantidadResenas: "145K",
};

// --------------------------------------------
// IMÁGENES DE FACHADA (carrusel)
// --------------------------------------------
export const IMAGENES_FACHADA = [
  { id: 1, url: "https://via.placeholder.com/430x200/111111/ffffff?text=Fachada+1", alt: "Fachada del local Nike - foto 1" },
  { id: 2, url: "https://via.placeholder.com/430x200/1a1a1a/ffffff?text=Fachada+2", alt: "Fachada del local Nike - foto 2" },
  { id: 3, url: "https://via.placeholder.com/430x200/222222/ffffff?text=Fachada+3", alt: "Fachada del local Nike - foto 3" },
  { id: 4, url: "https://via.placeholder.com/430x200/2a2a2a/ffffff?text=Fachada+4", alt: "Fachada del local Nike - foto 4" },
  { id: 5, url: "https://via.placeholder.com/430x200/333333/ffffff?text=Fachada+5", alt: "Fachada del local Nike - foto 5" },
];

// --------------------------------------------
// CATEGORÍAS / FILTROS
// --------------------------------------------
export const CATEGORIAS = [
  { id: 1, nombre: "Ofertas Hot" },
  { id: 2, nombre: "Zapatillas" },
  { id: 3, nombre: "Remeras" },
  { id: 4, nombre: "Pantalones" },
  { id: 5, nombre: "Jordan" },
];

// --------------------------------------------
// PRODUCTOS
// --------------------------------------------
export const PRODUCTOS_DESTACADOS = [
  {
    id: 101,
    nombre: "Nike Sportswear Club Fleece",
    categoria: "Pantalones",
    precio: 45000,
    imagen: "https://via.placeholder.com/180x180/111111/ffffff?text=Producto+1",
    guardado: false,
  },
  {
    id: 102,
    nombre: "Nike Big Swoosh Woven",
    categoria: "Pantalones",
    precio: 52000,
    imagen: "https://via.placeholder.com/180x180/111111/ffffff?text=Producto+2",
    guardado: false,
  },
  {
    id: 103,
    nombre: "Nike Club Fleece Gris",
    categoria: "Pantalones",
    precio: 43000,
    imagen: "https://via.placeholder.com/180x180/888888/ffffff?text=Producto+3",
    guardado: true,
  },
  {
    id: 104,
    nombre: "Nike Tech Woven Negro",
    categoria: "Pantalones",
    precio: 58000,
    imagen: "https://via.placeholder.com/180x180/333333/ffffff?text=Producto+4",
    guardado: true,
  },
];

export const PRODUCTOS_SALE = [
  {
    id: 201,
    nombre: "Nike Woven Sale Edición 1",
    categoria: "Pantalones",
    precio: 38000,
    precioOriginal: 52000,
    imagen: "https://via.placeholder.com/180x180/111111/ffffff?text=Sale+1",
    guardado: false,
  },
  {
    id: 202,
    nombre: "Nike Woven Sale Edición 2",
    categoria: "Pantalones",
    precio: 39000,
    precioOriginal: 54000,
    imagen: "https://via.placeholder.com/180x180/111111/ffffff?text=Sale+2",
    guardado: false,
  },
  {
    id: 203,
    nombre: "Nike Woven Sale Edición 3",
    categoria: "Pantalones",
    precio: 36000,
    precioOriginal: 50000,
    imagen: "https://via.placeholder.com/180x180/111111/ffffff?text=Sale+3",
    guardado: false,
  },
  {
    id: 204,
    nombre: "Nike Woven Sale Edición 4",
    categoria: "Pantalones",
    precio: 37000,
    precioOriginal: 51000,
    imagen: "https://via.placeholder.com/180x180/111111/ffffff?text=Sale+4",
    guardado: false,
  },
];

// --------------------------------------------
// NAVEGACIÓN DEL FOOTER
// --------------------------------------------
export const ITEMS_NAVEGACION = [
  { id: 1, nombre: "Home",      icono: "🏠", ruta: "/" },
  { id: 2, nombre: "Search",    icono: "🔍", ruta: "/search" },
  { id: 3, nombre: "Favorites", icono: "🤍", ruta: "/favorites" },
  { id: 4, nombre: "Profile",   icono: "👤", ruta: "/profile" },
];