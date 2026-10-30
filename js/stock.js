const stockProductos = [
    { id: 1, nombre: "Elegante", precio: 450, img: "/css/blaco y negro.jpg" },
    { id: 2, nombre: "Primavera", precio: 300, img: "/css/elegante.jpg" },
    { id: 3, nombre: "Relieve", precio: 840, img: "/css/le.jpg" },
    { id: 4, nombre: "Con Formas", precio: 380, img: "/css/cara.jpg" },
    { id: 5, nombre: "Print B&N", precio: 240, img: "/css/rayas.jpg" },
    { id: 6, nombre: "Jade", precio: 900, img: "/css/uñas-estructurales-11.webp" }
];

const contenedor = document.querySelector('#contenedor');
const cartButton = document.querySelector('#cart-btn');
const cartCount = cartButton?.querySelector('p');
const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector('#precioTotal');
const procesarCompra = document.querySelector('#procesarCompra');
const modalBody = document.querySelector('.cart-items-container .modal-body');

function cargarCarrito() {
    try {
        const saved = JSON.parse(localStorage.getItem('carrito')) || [];
        if (!Array.isArray(saved)) return [];
        return saved.reduce((items, savedItem) => {
            const product = stockProductos.find(item => item.id === savedItem?.id);
            const quantity = Number(savedItem?.cantidad);
            if (product && Number.isInteger(quantity) && quantity > 0) {
                items.push({ ...product, cantidad: quantity });
            }
            return items;
        }, []);
    } catch {
        return [];
    }
}

let carrito = cargarCarrito();

function guardarCarrito() {
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch {
        // El catálogo sigue funcionando si el navegador no permite guardar datos.
    }
}

function actualizarCarrito() {
    if (!modalBody) return;
    modalBody.replaceChildren();

    if (carrito.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'text-center text-primary parrafo';
        emptyMessage.textContent = 'Todavía no agregaste productos.';
        modalBody.appendChild(emptyMessage);
    } else {
        carrito.forEach(product => {
            const item = document.createElement('div');
            item.className = 'modal-contenedor';
            item.innerHTML = `
                <img src="${product.img}" alt="">
                <div>
                    <p class="nombreItem">${product.nombre}</p>
                    <p>Precio: $${product.precio}</p>
                    <p>Cantidad: ${product.cantidad}</p>
                    <button class="btn btn-danger" type="button" data-remove="${product.id}">
                        Eliminar producto
                    </button>
                </div>
            `;
            modalBody.appendChild(item);
        });
    }

    modalBody.querySelectorAll('[data-remove]').forEach(button => {
        button.addEventListener('click', () => {
            carrito = carrito.filter(product => product.id !== Number(button.dataset.remove));
            actualizarCarrito();
        });
    });

    const totalItems = carrito.reduce((total, product) => total + product.cantidad, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (precioTotal) {
        precioTotal.textContent = carrito.reduce(
            (total, product) => total + product.cantidad * product.precio,
            0
        ).toLocaleString('es-AR');
    }
    guardarCarrito();
}

function renderizarProductos() {
    if (!contenedor) return;
    contenedor.replaceChildren();

    stockProductos.forEach(product => {
        const card = document.createElement('article');
        card.className = 'box';
        card.innerHTML = `
            <img src="${product.img}" alt="Diseño de uñas ${product.nombre}" loading="lazy">
            <h3>${product.nombre}</h3>
            <div class="price">$${product.precio}</div>
            <button class="btn btn-add-cart" type="button">Añadir al carrito</button>
        `;
        card.querySelector('button').addEventListener('click', () => agregarProducto(product.id));
        contenedor.appendChild(card);
    });
}

function agregarProducto(id) {
    const product = stockProductos.find(item => item.id === id);
    if (!product) return;

    const existing = carrito.find(item => item.id === id);
    if (existing) {
        existing.cantidad += 1;
    } else {
        carrito.push({ ...product, cantidad: 1 });
    }
    actualizarCarrito();
}

vaciarCarrito?.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

procesarCompra?.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Tu carrito está vacío',
            text: 'Agregá un producto para continuar.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    Swal.fire({
        title: 'Compra de prueba',
        text: 'La compra se simuló correctamente. No se realizó ningún pago.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
    carrito = [];
    actualizarCarrito();
});

renderizarProductos();
actualizarCarrito();
