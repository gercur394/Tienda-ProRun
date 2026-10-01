/* ======================================================================
   productos.js
   Responsabilidad de este archivo: traer el catálogo desde productos.json
   mediante fetch, renderizarlo en el DOM, y manejar la búsqueda/filtro
   por categoría. El carrito (agregar, modificar, confirmar) vive en
   carrito.js para mantener cada archivo enfocado en una sola tarea.
   ====================================================================== */

// ---------- Selección de elementos del DOM ----------
const contenedorProductos = document.querySelector("#contenedor-productos");
const inputBusqueda = document.querySelector("#input-busqueda");
const selectCategoria = document.querySelector("#select-categoria");


let productos = [];


async function cargarProductos() {
  
  contenedorProductos.innerHTML = `<p class="mensaje-estado">Cargando productos...</p>`;

  try {
    const respuesta = await fetch("data/productos.json");

    
    if (!respuesta.ok) {
      throw new Error("No se pudo acceder al catálogo de productos.");
    }

    const datosRecibidos = await respuesta.json();
    productos = datosRecibidos; 

    renderizarProductos(productos);

  } catch (error) {
    contenedorProductos.innerHTML = `<p class="mensaje-estado">No pudimos cargar el catálogo. Intentá recargar la página.</p>`;
    Swal.fire({
      icon: "error",
      title: "Error al cargar productos",
      text: error.message
    });
  } finally {
    console.log("Carga de catálogo finalizada.");
  }
}


function crearTarjetaProducto(producto) {
 
  const { id, nombre, categoria, precio, talles, imagen, descripcion } = producto;

 
  const opcionesTalle = talles
    .map(talle => `<option value="${talle}">${talle}</option>`)
    .join("");

  
  const precioFormateado = precio.toLocaleString("es-AR");

  return `
    <article class="tarjeta-producto" data-id="${id}">
      <img src="${imagen}" alt="${nombre}">
      <div class="tarjeta-producto-info">
        <span class="categoria">${categoria}</span>
        <h3>${nombre}</h3>
        <p>${descripcion}</p>
        <select class="select-talle" aria-label="Talle de ${nombre}">
          ${opcionesTalle}
        </select>
        <p class="precio">$${precioFormateado}</p>
        <button class="btn-agregar" data-id="${id}">Agregar al carrito</button>
      </div>
    </article>
  `;
}


function renderizarProductos(listaProductos) {
 
  const contenidoHTML = listaProductos.length === 0
    ? `<p class="mensaje-estado">No se encontraron productos con ese criterio.</p>`
    : listaProductos.map(crearTarjetaProducto).join("");

  contenedorProductos.innerHTML = contenidoHTML;
}


function filtrarProductos() {
  const textoBusqueda = inputBusqueda.value.toLowerCase();
  const categoriaElegida = selectCategoria.value;

  const productosFiltrados = productos.filter(producto => {
    const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
   
    const coincideCategoria = categoriaElegida === "todas" || producto.categoria === categoriaElegida;

    return coincideNombre && coincideCategoria;
  });

  renderizarProductos(productosFiltrados);
}

// ---------- Eventos ----------
inputBusqueda.addEventListener("keyup", filtrarProductos);
selectCategoria.addEventListener("change", filtrarProductos);


contenedorProductos.addEventListener("click", function (evento) {
  if (!evento.target.classList.contains("btn-agregar")) return;

  const idProducto = Number(evento.target.dataset.id);

  
  const productoElegido = productos.find(producto => producto.id === idProducto);

  
  const tarjeta = evento.target.closest(".tarjeta-producto");
  const talleElegido = tarjeta.querySelector(".select-talle").value;

 
  agregarAlCarrito(productoElegido, talleElegido);
});

// ---------- Arranque ----------
cargarProductos();