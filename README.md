# ProRun - Tienda de Indumentaria Deportiva

Proyecto final del curso de JavaScript: simulador de e-commerce para una marca deportiva ficticia (ProRun), que integra las herramientas vistas a lo largo de la diplomatura (DOM, fetch, async/await, localStorage, funciones de orden superior, librerías externas, etc.).


## Estructura del proyecto

```
proyecto-final/
├── index.html          # Único archivo suelto en la raíz
├── css/
│   └── style.css       # Estilos con la paleta de marca (negro + azul Francia)
├── js/
│   ├── productos.js    # Fetch del catálogo, renderizado, búsqueda y filtro
│   └── carrito.js      # Lógica del carrito, localStorage y checkout
├── data/
│   └── productos.json  # Catálogo de productos (base de datos simulada)
├── assets/
│   └── favicon.svg     # Ícono de la marca
└── README.md
```

## Funcionalidades

- Catálogo de productos cargado dinámicamente desde un JSON local, vía `fetch` con `async/await`.
- Búsqueda por nombre y filtro por categoría.
- Carrito de compras: agregar, modificar cantidades, eliminar ítems.
- Persistencia del carrito en `localStorage` (sobrevive a un refresh de página).
- Cálculo de totales con funciones de orden superior (`map`, `filter`, `find`, `reduce`).
- Notificaciones mediante SweetAlert2 (sin uso de `alert`, `confirm` ni `prompt` nativos).
- Circuito de compra completo: ver catálogo → agregar al carrito → modificar → confirmar compra.

## Tecnologías

- HTML5, CSS3, JavaScript (ES6+)
- [SweetAlert2](https://sweetalert2.github.io/) (vía CDN)