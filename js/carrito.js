/* ======================================================================
   carrito.js
   Responsabilidad de este archivo: todo lo relacionado al carrito de
   compras — agregar productos, modificar cantidades, eliminar ítems,
   calcular el total, persistir en localStorage y confirmar la compra.
   ====================================================================== */

// ---------- Selección de elementos del DOM ----------
const btnAbrirCarrito = document.querySelector("#btn-abrir-carrito");
const btnCerrarCarrito = document.querySelector("#btn-cerrar-carrito");
const panelCarrito = document.querySelector("#panel-carrito");
const fondoOscuro = document.querySelector("#fondo-oscuro");
const contenedorCarritoItems = document.querySelector("#contenedor-carrito-items");
const totalCarritoTexto = document.querySelector("#total-carrito");
const contadorCarritoTexto = document.querySelector("#contador-carrito");
const btnVaciarCarrito = document.querySelector("#btn-vaciar-carrito");
const btnConfirmarCompra = document.querySelector("#btn-confirmar-compra");


let carrito = JSON.parse(localStorage.getItem("carritoProRun")) ?? [];


function guardarCarritoEnStorage() {
  localStorage.setItem("carritoProRun", JSON.stringify(carrito));
}


function agregarAlCarrito(producto, talle) {
  
  const { id, nombre, precio, imagen } = producto;

  
  const itemExistente = carrito.find(item => item.id === id && item.talle === talle);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, imagen, talle, cantidad: 1 });
  }

  guardarCarritoEnStorage();
  renderizarCarrito();

  Swal.fire({
    icon: "success",
    title: "Agregado al carrito",
    text: `${nombre} (talle ${talle})`,
    timer: 1200,
    showConfirmButton: false
  });
}


function crearFilaCarrito(item) {
  const { id, nombre, precio, imagen, talle, cantidad } = item;
  const subtotal = (precio * cantidad).toLocaleString("es-AR");

  return `
    <div class="item-carrito" data-id="${id}" data-talle="${talle}">
      <img src="${imagen}" alt="${nombre}">
      <div class="item-carrito-info">
        <strong>${nombre}</strong>
        <p>Talle: ${talle} — $${subtotal}</p>
        <div class="item-carrito-controles">
          <button class="btn-restar">−</button>
          <span>${cantidad}</span>
          <button class="btn-sumar">+</button>
          <button class="btn-eliminar-item">🗑</button>
        </div>
      </div>
    </div>
  `;
}


function renderizarCarrito() {
  const contenidoHTML = carrito.length === 0
    ? `<p class="mensaje-estado">Tu carrito está vacío.</p>`
    : carrito.map(crearFilaCarrito).join("");

  contenedorCarritoItems.innerHTML = contenidoHTML;

  
  const total = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
  totalCarritoTexto.textContent = total.toLocaleString("es-AR");

  
  const cantidadTotalItems = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  contadorCarritoTexto.textContent = cantidadTotalItems;
}


function alternarPanelCarrito() {
  panelCarrito.classList.toggle("oculto");
  fondoOscuro.classList.toggle("oculto");
}

// ---------- Eventos de apertura/cierre del panel ----------
btnAbrirCarrito.addEventListener("click", alternarPanelCarrito);
btnCerrarCarrito.addEventListener("click", alternarPanelCarrito);
fondoOscuro.addEventListener("click", alternarPanelCarrito);

// ---------- Eventos dentro del carrito (sumar, restar, eliminar) ----------

contenedorCarritoItems.addEventListener("click", function (evento) {
  const filaItem = evento.target.closest(".item-carrito");
  if (!filaItem) return; // el clic no fue dentro de ningún ítem

  const idItem = Number(filaItem.dataset.id);
  const talleItem = filaItem.dataset.talle;
  const item = carrito.find(producto => producto.id === idItem && producto.talle === talleItem);

  if (evento.target.classList.contains("btn-sumar")) {
    item.cantidad += 1;
  }

  if (evento.target.classList.contains("btn-restar")) {
    item.cantidad -= 1;
    // Si al restar llega a 0, lo sacamos del carrito directamente
    if (item.cantidad === 0) {
      carrito = carrito.filter(producto => !(producto.id === idItem && producto.talle === talleItem));
    }
  }

  if (evento.target.classList.contains("btn-eliminar-item")) {
    carrito = carrito.filter(producto => !(producto.id === idItem && producto.talle === talleItem));
  }

  guardarCarritoEnStorage();
  renderizarCarrito();
});

// ---------- Vaciar carrito ----------
btnVaciarCarrito.addEventListener("click", function () {
  if (carrito.length === 0) return;

  carrito = [];
  guardarCarritoEnStorage();
  renderizarCarrito();

  Swal.fire({
    icon: "info",
    title: "Carrito vaciado",
    timer: 1200,
    showConfirmButton: false
  });
});

// ---------- Confirmar compra ----------
btnConfirmarCompra.addEventListener("click", function () {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Tu carrito está vacío",
      text: "Agregá al menos un producto antes de confirmar la compra."
    });
    return;
  }

  const totalCompra = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);

  Swal.fire({
    icon: "success",
    title: "¡Compra confirmada!",
    text: `Total abonado: $${totalCompra.toLocaleString("es-AR")}. ¡Gracias por elegir ProRun!`
  });

  // Checkout completo: vaciamos el carrito y cerramos el panel
  carrito = [];
  guardarCarritoEnStorage();
  renderizarCarrito();
  alternarPanelCarrito();
});

// ---------- Arranque ----------
// Renderizamos el carrito apenas carga la página, para reflejar lo que
// ya estuviera guardado en localStorage de una sesión anterior.
renderizarCarrito();