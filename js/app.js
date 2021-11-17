const capacitaciones = document.querySelector('#listaCapacitaciones');
const products = document.querySelector('#listaProductos');
const tableCarrito = document.querySelector('#lista-carrito tbody');
const tableTotal = document.querySelector('#lista-carrito tfoot');
let usuarios = [];
let usuariosLS = JSON.parse(localStorage.getItem('usuarios'));
if (usuariosLS !== null) {
    usuarios = JSON.parse(localStorage.getItem('usuarios'));
}
let carrito;
let total;
let sesion = false;

document.addEventListener('DOMContentLoaded', () => {

    const carritoStorage = JSON.parse(localStorage.getItem('carrito'));

    carrito = carritoStorage || [];
    actualizarCarritoHTML();
    $.ajax({
        url: 'js/capacitaciones.json',
        success: function(caps, textStatus, xhr) {
            renderCapacitaciones(caps);
        },
        error: function(xhr, textStatus, error) {
            console.log(xhr);
            console.log(textStatus);
            console.log(error);
        }
    });
    $.ajax({
        url: 'js/productos.json',
        success: function(productos, textStatus, xhr) {
            renderProducts(productos);
        },
        error: function(xhr, textStatus, error) {
            console.log(xhr);
            console.log(textStatus);
            console.log(error);
        }
    });

});


capacitaciones.addEventListener('click', agregarProducto);


//Jquery
$('#cerrar-sesion').hide();
$('#vaciar-carrito').click(vaciarCarrito);
$('#listaProductos').click(agregarProducto);
$('#ingresar').click(ingresar);
$('#registrar').click(registro);
$('#cerrar-sesion').click(sesionCerrada);
$('#comprar-carrito').click(comprarCarrito);



function vaciarCarrito(e) {
    e.preventDefault();
    if (carrito.length != 0) {
        swal({
                title: "¿Estas seguro que queres vaciar el carrito?",
                text: "Una vez borrado podes volver a cargar los productos necesarios!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Carrito de compras vacio!", {
                        icon: "success",
                    });
                    carrito = [];
                    actualizarCarritoHTML();
                    actualizarStorage();
                } else {
                    swal("Podes seguir agregando productos o terminar tu compra!");
                }
            });
    }
}

function actualizarCarritoHTML() {
    tableCarrito.innerHTML = '';
    tableTotal.innerHTML = '';

    carrito.forEach(capacitacion => {
        const { img, nombre, precio, cantidad, id } = capacitacion;
        const row = document.createElement('tr');
        row.innerHTML = `
           
            <td>
                ${nombre}
            </td>
            <td class="centrado">
               $${precio}
            </td>
            <td class="centrado">
            ${cantidad}
            </td>            
            <td class="centrado">
                <a href="#" class="borrarProducto fas fa-trash" data-id="${id}"></a>
            </td>
            `
        tableCarrito.appendChild(row);
    });

    $(".borrarProducto").click(function(e) {
        e.preventDefault();
        const id = e.target.dataset.id;
        console.log(id);
        const index = carrito.findIndex(prod => prod.id == id);
        carrito.splice(index, 1);
        actualizarCarritoHTML();
        actualizarStorage();
    })


    const tot = document.createElement('tr');
    tot.innerHTML = `
        <td>
            TOTAL
        </td>
        <td rowspan="2">
            $${sumar(carrito)}
        </td>
    `
    tableTotal.appendChild(tot);


}

function sumar(lista) {
    let tot = 0;
    const precios = lista.map(function(ele) {
        return ele.precio * ele.cantidad;
    })


    precios.forEach(num => {
        let a = Number(num);
        tot += a;
    })
    console.log(tot);
    console.log(carrito);
    return tot;

}

function agregarProducto(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregarCarrito")) {
        const productCard = e.target.parentElement.parentElement;
        console.log(e.target.parentElement);
        console.log(e.target.parentElement.parentElement);
        const productoAgregado = {
            nombre: productCard.querySelector('h5').textContent,
            precio: productCard.querySelector('p').textContent,
            cantidad: Number(productCard.querySelector('.form-select').value),
            id: productCard.querySelector('a').dataset.id
        }
        console.log(productoAgregado.cantidad);
        const existe = carrito.some(producto => producto.id === productoAgregado.id);
        if (existe && productoAgregado.id >= 20) {
            const nuevoCarrito = carrito.map(producto => {
                if (producto.id === productoAgregado.id) {
                    producto.cantidad += productoAgregado.cantidad;
                }
                return producto;
            });
            carrito = [...nuevoCarrito];
        } else if (existe && productoAgregado.id <= 19) {
            swal(productoAgregado.nombre, "...ya se encuentra en el carrito!");
        } else {
            carrito.push(productoAgregado);
        }
    }

    actualizarCarritoHTML();
    actualizarStorage();
}


function actualizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function existeProducto(lista, prod) {
    return lista.some(producto => producto.id == prod.id);
}

function renderCapacitaciones(caps) {
    caps.innerHTML = ''

    caps.forEach(capacitacion => {
        const html = `
        <div class="col">
        <div class="card cardCap">
            <img src="${capacitacion.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title tituloCard">${capacitacion.nombre}</h5>
                <p class="card-text textoCard">${capacitacion.precio}</p>
                <div class="row">
                <select class="form-select selectFont col" aria-label="Default select example">
                <option value="1">Curso Normal</option>
                <option value="1">Curso Acelerado</option>
                </select>
                
                <a href="#" class="btn btn-outline-primary agregarCarrito btn-lg col" data-id="${capacitacion.id}">Agregar al carrito</a>
                </div>
                </div>
        </div>
    </div>
		`
        capacitaciones.innerHTML += html;
    });
}

function renderProducts(productos) {
    productos.innerHTML = ''

    productos.forEach(producto => {
        const html = `
        <div class="col">
        <div class="card cardCap">
            <img src="${producto.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title tituloCard">${producto.nombre}</h5>
                <p class="card-text textoCard">${producto.precio}</p>
                <div class="row">
                     <select class="form-select col selectFont" aria-label="Default select example">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                     </select>
                    <a href="#" class="btn btn-outline-primary agregarCarrito btn-lg col" data-id="${producto.id}">Agregar al carrito</a>
                </div>
                </div>
        </div>
    </div>
		`
        products.innerHTML += html;
    });
}





function registro() {

    const user = document.querySelector('#user').value;
    const pass = document.querySelector('#pass').value;
    const usuario = {
        user: user,
        pass: pass
    }
    const usuariosLS = JSON.parse(localStorage.getItem('usuarios'));

    const resultado = usuariosLS.find((usuario) => usuario.user === user);
    if (resultado) {
        swal("El nombre de usuario ya existe");;
    } else {

        usuarios.push(usuario);

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        swal("Usuario agregado exitosamente!");
        sesionIniciada();
    }
}

function sesionIniciada() {
    const bingresar = document.querySelector("#ingresar");
    bingresar.style.display = "none";
    const bregistrar = document.querySelector("#registrar");
    bregistrar.style.display = "none";
    const bcerrar = document.querySelector("#cerrar-sesion");
    bcerrar.style.display = "block";
    const tuser = document.querySelector("#user");
    tuser.style.display = "none";
    const tpass = document.querySelector("#pass");
    tpass.style.display = "none";
    sesion = true;
}

function sesionCerrada() {
    const bingresar = document.querySelector("#ingresar");
    bingresar.style.display = "inline-block";
    const bregistrar = document.querySelector("#registrar");
    bregistrar.style.display = "inline-block";
    const bcerrar = document.querySelector("#cerrar-sesion");
    bcerrar.style.display = "none";
    const tuser = document.querySelector("#user");
    tuser.style.display = "block";
    const tpass = document.querySelector("#pass");
    tpass.style.display = "block";
    sesion = false;
}

function ingresar() {

    const user = document.querySelector('#user').value;
    const pass = document.querySelector('#pass').value;

    const usuario = {
        user: user,
        pass: pass
    }

    const usuariosLS = JSON.parse(localStorage.getItem('usuarios'));

    const resultado = usuariosLS.find((usuario) => usuario.user === user && usuario.pass === pass);

    if (resultado) {
        swal("Bienvenido " + usuario.user + "!");

        sesionIniciada();

        /* $('#ingresar').toggle(500, swing);
         $('#registrar').toggle(500, swing);
         $('#cerrar-sesion').toggle(500, swing);*/
    } else {
        swal("Alguno de los datos son incorrectos");
    }

}

function comprarCarrito() {

    const totalCompra = sumar(carrito);
    if (totalCompra != 0) {
        swal({
                title: "Su compra por $" + totalCompra + " ha sido iniciada",
                text: "Una vez realizada la compra, le llegara un email con su factura y numero de seguimiento.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (sesion) {
                    if (willDelete) {
                        swal("Compra realizada con exito!", {
                            icon: "success",

                        });
                        carrito = []
                        actualizarCarritoHTML();
                        actualizarStorage();
                    } else {
                        swal("Puede seguir agregando productos al carrito!");
                    }
                } else {
                    swal("Antes de finalizar la compra inicie sesion o registrese");
                }
            });
    } else {
        swal("No tienes productos agregados al carrito.")
    }
}