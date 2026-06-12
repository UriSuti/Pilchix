# 🛍️ Pilchix

> Vidriera digital de moda: explorá marcas y sus productos desde un solo lugar.

Pilchix es una aplicación web full-stack que funciona como catálogo de marcas de indumentaria. Desde una landing, el usuario navega marcas destacadas, categorías y ofertas, y puede entrar a la página de cada local —con su propia URL— para ver su fachada, buscar, filtrar y ordenar sus productos.

---

## ✨ Características

- **Landing** con marcas destacadas, categorías, carrusel principal (hero) y sección de ofertas.
- **Página propia por local con URL única** (ej. `/zara`, `/under-armour`), generada a partir de un *slug* derivado del nombre de la marca.
- **Búsqueda, filtrado y ordenamiento** de productos dentro de cada local (por precio y más vendidos).
- **Datos dinámicos desde Supabase**: marcas, productos, categorías, ofertas, suscripciones y carrito.
- **Autenticación de usuarios** mediante React Context.

---

## 🧰 Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite |
| Ruteo | React Router |
| Estilos | CSS plano |
| Backend / Base de datos | Supabase (PostgreSQL) |

---

## 🚀 Puesta en marcha

### Requisitos previos

- Node.js 18 o superior
- Un proyecto de [Supabase](https://supabase.com/)

### Instalación

```bash
git clone <url-del-repo>
cd pilchix
npm install
```

### Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con las credenciales de tu proyecto de Supabase:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

> Las variables deben empezar con `VITE_` para que Vite las exponga al frontend.

### Levantar el entorno de desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta el servidor de desarrollo con hot-reload |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Corre ESLint sobre el código |

---

## 🧭 Ruteo

El proyecto usa **React Router** con dos rutas principales:

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `ViewLanding` | Página principal con marcas, categorías y ofertas |
| `/:storeSlug` | `ViewLocal` | Página de un local, identificado por su slug |

El *slug* se genera a partir del nombre de la marca con la utilidad `slugify` (`src/utils/slugify.js`):

```
"Zara"          →  /zara
"Under Armour"  →  /under-armour
"Tommy Hilfiger" → /tommy-hilfiger
```

Al entrar a una URL como `/zara`, `ViewLocal` lee el `storeSlug` con `useParams`, busca en las marcas la que coincide con ese slug y carga sus datos. Esto permite acceder directo a cualquier local por URL (incluso con refresh).

---

## 🗂️ Estructura del proyecto

```
src/
├── assets/                     # Imágenes y recursos estáticos
├── header_footer/              # Header y Footer compartidos
├── hooks/                      # Hooks globales (datos y búsqueda de la landing)
│   ├── useLandingData.js
│   └── useLandingSearch.js
├── services/                   # Acceso a datos / cliente de Supabase
├── utils/                      # Utilidades (slugify, etc.)
│
├── viewLanding/                # Vista de la landing
│   ├── components/
│   │   ├── CategorySection/
│   │   ├── FeaturedStoresSection/
│   │   ├── HeaderLanding/
│   │   ├── HeroCarousel/
│   │   ├── OffersSection/
│   │   └── SearchBar/
│   ├── helpers/
│   │   └── formatters.js
│   ├── services/
│   │   └── landing.js
│   ├── constants.js
│   ├── ViewLanding.css
│   └── ViewLanding.jsx
│
├── viewLocal/                  # Vista de un local
│   ├── components/
│   │   ├── CarruselFachadaLocal/
│   │   ├── FiltroLocal/
│   │   ├── Producto/
│   │   └── SeccionPrendasLocal/
│   ├── hooks/
│   │   └── useLocalData.js
│   ├── services/
│   ├── viewLocal.css
│   └── viewLocal.jsx
│
├── App.jsx                     # Definición de rutas
├── App.css
├── index.css                   # Estilos globales
└── main.jsx                    # Punto de entrada + BrowserRouter
```

---

## 🪝 Hooks principales

| Hook | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| `useLandingData` | `src/hooks/` | Trae todos los datos de la landing (marcas, categorías, ofertas, productos populares, carrito, suscripciones) en paralelo con `Promise.allSettled`. Devuelve `{ landingData, loading, error }`. |
| `useLandingSearch` | `src/hooks/` | Maneja el estado y la lógica de la búsqueda global. |
| `useLocalData` | `src/viewLocal/hooks/` | Recibe el `id_marca` de un local y trae sus productos e imagen de fachada. |

---

## 🗄️ Modelo de datos (Supabase)

Entidades principales del dominio:

- **marcas** — locales/marcas del catálogo (`id_marca`, `nombre`, `descripcion`, `logo`, `sitio_web`, etc.).
- **productos** — productos asociados a cada marca (nombre, precio, ventas).
- **categorias** — categorías de producto.
- **descuentos / ofertas** — promociones vigentes.
- **suscripciones** — suscripciones de usuarios a marcas.
- **carrito** — carrito de compras del usuario (con su detalle).

---

*Pilchix es un proyecto en desarrollo activo.*