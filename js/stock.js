const stockProductos =[
    {
        id: 1,
        nombre: "Elegante",
        cantidad: 1,
        precio:450,
        img:"/css/blaco y negro.jpg"
    },
    {
        id: 2,
        nombre: "Primavera",
        cantidad: 1,
        precio:300,
        img:"/css/elegante.jpg"
    },
    {
        id: 3,
        nombre: "Relieve",
        cantidad: 1,
        precio:840,
        img:"/css/le.jpg"
    },
    {
        id: 4,
        nombre: "Con Formas",
        cantidad: 1,
        precio:380,
        img:"/css/cara.jpg"
    },
    {
        id: 5,
        nombre: "Print B&N",
        cantidad: 1,
        precio:240,
        img:"/css/rayas.jpg"
    },
    {
        id: 6,
        nombre: "Jade",
        cantidad: 1,
        precio:900,
        img:"/css/uñas-estructurales-11.webp"
    },

];
let carrito = []

const contenedor = document.querySelector('#contenedor')
const carritoContenedor = document.querySelector('#cart-btn')
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector('#precioTotal')
const procesarCompra = document.querySelector("#procesarCompra");




document.addEventListener('DOMContentLoaded', () =>{
    carrito = JSON.parse(localStorage.getItem('carrito')) || []
    mostrarCarrito()
})

stockProductos.forEach((prod)=>{
    const {id, nombre, precio,img,cantidad} = prod 
    contenedor.innerHTML += `
    
    <div class="box">
                <img src="${img}" alt="">
                <h3>${nombre}</h3>
                <div class="price">$${precio}</div>
                 
                <button class="btn btn-add-cart" onclick="agregarProducto(${id})" >Añadir al carrito</button>
            </div>`
})

vaciarCarrito.addEventListener("click", () => {
  carrito.length = [];
  mostrarCarrito();
}); 

if (procesarCompra) {
  procesarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "¡Tu carrito está vacio!",
        text: "Compra algo para continuar con la compra",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } 
  });
}

const agregarProducto = (id) => {
  const existe = carrito.some(prod => prod.id === id)

  if(existe){
    const prod = carrito.map(prod => {
      if(prod.id === id){
        prod.cantidad++
      }
    })
  } else {
    const item = stockProductos.find((prod) => prod.id === id)
    carrito.push(item)
  }
  mostrarCarrito()

};

const mostrarCarrito = () => {
  const modalBody = document.querySelector(".cart-items-container .modal-body");
  if (modalBody) {
    modalBody.innerHTML = "";
    carrito.forEach((prod) => {
      const { id, nombre, precio, desc, img, cantidad } = prod;
      console.log(modalBody);
      modalBody.innerHTML += `
      <div class="modal-contenedor">
      
        <div>
        <img src="${img}"/>
        </div>
        <div>
        <p class="nombreItem">${nombre}</p>
      <p>Precio: ${precio}</p>
      <p>Cantidad :${cantidad}</p>
      <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
        </div>
      </div>
      
  
      `;
    });
  }


if (carrito.length === 0) {
    console.log("Nada");
    modalBody.innerHTML = `
    <p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
    `;
  } else {
    console.log("Algo");
  }
  carritoContenedor.textContent = carrito.length;

  if (precioTotal) {
    precioTotal.innerText = carrito.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,
      0
    );
  }

  guardarStorage();
};

function guardarStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(id) {
  const juegoId = id;
  carrito = carrito.filter((juego) => juego.id !== juegoId);
  mostrarCarrito();

  localStorage.clear()
}