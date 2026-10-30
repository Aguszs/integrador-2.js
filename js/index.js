const navbar = document.querySelector('.navbar');
const searchForm = document.querySelector('.search-form');
const cartItem = document.querySelector('.cart-items-container');
const menuButton = document.querySelector('#menu-btn');
const searchButton = document.querySelector('#search-btn');
const cartButton = document.querySelector('#cart-btn');

function closePanels(except) {
    if (except !== navbar) navbar?.classList.remove('active');
    if (except !== searchForm) searchForm?.classList.remove('active');
    if (except !== cartItem) cartItem?.classList.remove('active');
    menuButton?.setAttribute('aria-expanded', 'false');
}

function togglePanel(panel) {
    const isOpening = !panel.classList.contains('active');
    closePanels(isOpening ? panel : null);
    panel.classList.toggle('active', isOpening);
    if (panel === navbar) menuButton?.setAttribute('aria-expanded', String(isOpening));
}

menuButton?.addEventListener('click', () => togglePanel(navbar));
searchButton?.addEventListener('click', () => {
    togglePanel(searchForm);
    if (searchForm.classList.contains('active')) {
        searchForm.querySelector('input')?.focus();
    }
});
cartButton?.addEventListener('click', () => togglePanel(cartItem));

[menuButton, searchButton, cartButton].forEach(button => {
    button?.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            button.click();
        }
    });
});

const searchInput = document.querySelector('#search-box');
searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase('es');
    document.querySelectorAll('#contenedor .box').forEach(card => {
        const name = card.querySelector('h3')?.textContent.toLocaleLowerCase('es') || '';
        card.hidden = !name.includes(query);
    });
});

const readSession = () => {
    try {
        return JSON.parse(localStorage.getItem('login_success')) || null;
    } catch {
        return null;
    }
};

// El catálogo se puede consultar sin iniciar sesión.
const logOutButton = document.querySelector('#logOut');
if (!readSession()) logOutButton?.setAttribute('hidden', '');

logOutButton?.addEventListener('click', () => {
    localStorage.removeItem('login_success');
    window.location.href = 'login.index.html';
});

window.addEventListener('scroll', () => closePanels(null), { passive: true });
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePanels(null);
});


const stockProductos = [
    { id: 1, nombre: 'Elegante', precio: 450, img: '/css/blaco y negro.jpg' },
    { id: 2, nombre: 'Primavera', precio: 300, img: '/css/elegante.jpg' },
    { id: 3, nombre: 'Relieve', precio: 840, img: '/css/le.jpg' },
    { id: 4, nombre: 'Con Formas', precio: 380, img: '/css/cara.jpg' },
    { id: 5, nombre: 'Print B&N', precio: 240, img: '/css/rayas.jpg' },
    { id: 6, nombre: 'Jade', precio: 900, img: '/css/uñas-estructurales-11.webp' }
];

const contenedor = document.querySelector('#contenedor');
// Usa el botón del carrito definido por el script principal.
const cartCount = cartButton?.querySelector('p');
const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector('#precioTotal');
const procesarCompra = document.querySelector('#procesarCompra');
const modalBody = document.querySelector('.cart-items-container .modal-body');
const formatoPrecio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
});

function cargarCarrito() {
    try {
        const saved = JSON.parse(localStorage.getItem('carrito') || '[]');
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
        // El carrito sigue disponible hasta cerrar o recargar la pestaña.
    }
}

function crearBoton(texto, accion, etiqueta) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn cart-action';
    button.textContent = texto;
    button.dataset.action = accion;
    button.setAttribute('aria-label', etiqueta);
    return button;
}

function actualizarCarrito() {
    if (!modalBody) return;
    modalBody.replaceChildren();

    if (carrito.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'cart-empty';
        emptyMessage.textContent = 'Todavía no agregaste productos.';
        modalBody.appendChild(emptyMessage);
    } else {
        carrito.forEach(product => {
            const item = document.createElement('article');
            item.className = 'cart-item';

            const image = document.createElement('img');
            image.src = product.img;
            image.alt = 'Diseño de uñas ' + product.nombre;
            image.loading = 'lazy';

            const details = document.createElement('div');
            details.className = 'cart-item-details';

            const title = document.createElement('h3');
            title.textContent = product.nombre;

            const price = document.createElement('p');
            price.textContent = formatoPrecio.format(product.precio) + ' c/u';

            const quantity = document.createElement('p');
            quantity.className = 'cart-quantity';
            quantity.textContent = 'Cantidad: ' + product.cantidad;

            const controls = document.createElement('div');
            controls.className = 'cart-item-controls';
            controls.append(
                crearBoton('−', 'decrease', 'Quitar una unidad de ' + product.nombre),
                crearBoton('+', 'increase', 'Agregar una unidad de ' + product.nombre),
                crearBoton('Eliminar', 'remove', 'Eliminar ' + product.nombre + ' del carrito')
            );

            details.append(title, price, quantity, controls);
            item.append(image, details);
            modalBody.appendChild(item);
        });
    }

    modalBody.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.cart-item');
            const productName = item?.querySelector('h3')?.textContent;
            const product = carrito.find(entry => entry.nombre === productName);
            if (!product) return;

            if (button.dataset.action === 'increase') product.cantidad += 1;
            if (button.dataset.action === 'decrease') product.cantidad -= 1;
            if (button.dataset.action === 'remove' || product.cantidad <= 0) {
                carrito = carrito.filter(entry => entry.id !== product.id);
            }
            actualizarCarrito();
        });
    });

    const totalItems = carrito.reduce((total, product) => total + product.cantidad, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (precioTotal) {
        precioTotal.textContent = formatoPrecio.format(carrito.reduce(
            (total, product) => total + product.cantidad * product.precio,
            0
        ));
    }
    guardarCarrito();
}

function renderizarProductos() {
    if (!contenedor) return;
    contenedor.replaceChildren();

    stockProductos.forEach(product => {
        const card = document.createElement('article');
        card.className = 'box';

        const image = document.createElement('img');
        image.src = product.img;
        image.alt = 'Diseño de uñas ' + product.nombre;
        image.loading = 'lazy';

        const title = document.createElement('h3');
        title.textContent = product.nombre;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = formatoPrecio.format(product.precio);

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'btn btn-add-cart';
        addButton.textContent = 'Agregar al carrito';
        addButton.addEventListener('click', () => agregarProducto(product.id));

        card.append(image, title, price, addButton);
        contenedor.appendChild(card);
    });
}

function agregarProducto(id) {
    const product = stockProductos.find(item => item.id === id);
    if (!product) return;

    const existing = carrito.find(item => item.id === id);
    if (existing) existing.cantidad += 1;
    else carrito.push({ ...product, cantidad: 1 });

    actualizarCarrito();
}

vaciarCarrito?.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

procesarCompra?.addEventListener('click', () => {
    if (carrito.length === 0) {
        window.alert('Tu carrito está vacío.');
        return;
    }

    carrito = [];
    actualizarCarrito();
    window.alert('¡Compra realizada con éxito!');
});

renderizarProductos();
actualizarCarrito();
