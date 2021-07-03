let cart = [];

function getProductsDb() {
  const url = "./data/dbProducts.json";

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

//PARA REALIZAR EL METODO POST POR API
// const APIURL = 'https://jsonplaceholder.typicode.com/posts' ;
const APIURL = './data/formulario.php';
const infoPost =  { userId: 1, title: "Sebastian Rojas", body: "Este es un mensaje de prueba realizando un POST por API" }

// variables
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const mensaje = document.querySelector('#mensaje');


const btnEnviar = document.querySelector('#enviar');
const formularioEnviar = document.querySelector('#enviar-mail');
const resetBtn = document.querySelector('#resetBtn');

const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// event Listener

eventListeners();

function eventListeners() {

    document.addEventListener('DOMContentLoaded', () => {
      cart = localStorage.getItem('cartProductsId');      
    })

     // Inicio de la aplicación y deshabilitar submit
     document.addEventListener('DOMContentLoaded', inicioApp);

     // Campos del formulario
     name.addEventListener('blur', validarFormulario);
     email.addEventListener('blur', validarFormulario);
     telefono.addEventListener('blur', validarFormulario);
     direccion.addEventListener('blur', validarFormulario);
     mensaje.addEventListener('blur', validarFormulario);

     // Boton de enviar en el submit
     formularioEnviar.addEventListener('submit', enviarEmail);

     // Boton de reset
     resetBtn.addEventListener('click', resetFormulario);
}


$(document).ready(function () {  
  carritoCarrito();
});


async function carritoCarrito() {

  const products = await getProductsDb();

  const idProductsSplit = cart.split(",");

  // Eliminamos los IDs duplicaos
  const idProductsCart = Array.from(new Set(idProductsSplit));

  let html = "";
  
  idProductsCart.forEach(id => {
    products.forEach(product => {
      if (id == product.id) {
        const quantity = countDuplicatesId(id, idProductsSplit);
        const totalPrice = product.price * quantity;        

        html += `
          
              <tr>
               <td style="padding:25px">  
                    <img src="${product.image}" alt="${product.name}" style="width:80px"/>
               </td>
               <td style="padding:25px">${product.name}</td>
               <td style="padding:25px">${quantity} </td>
               <td style="padding:25px">${totalPrice.toFixed(2)}</td>     
              </tr>                               
        `;
      }
    });
  });

  document.getElementsByClassName("cart-products")[0].innerHTML = html; 

  totalFinalPrice();

};

async function totalFinalPrice()
{
  const products = await getProductsDb();

  const idProductsSplit = cart.split(",");

  // Eliminamos los IDs duplicaos
  const idProductsCart = Array.from(new Set(idProductsSplit));

  let total = 0;
  
  idProductsCart.forEach(id => {
    products.forEach(product => {
      if (id == product.id) {
        const quantity = countDuplicatesId(id, idProductsSplit);
        const totalPrice = product.price * quantity; 

        total += totalPrice;
      }
    });
  });

  document.getElementsByClassName("cart-total")[0].innerHTML = total;

}

function countDuplicatesId(value, arrayIds) {
  let count = 0;
  arrayIds.forEach(id => {
    if (value == id) {
      count++;
    }
  });
  return count;
}

function deleteAllIds(id, arrayIds) {
  return arrayIds.filter(itemId => {
    return itemId != id;
  });
}

// funciones
function inicioApp() {
     // deshabilitar el envio
     btnEnviar.disabled = true;
     btnEnviar.classList.add('cursor-not-allowed', 'opacity-50')
}


// Valida que el campo tengo algo escrito
function validarFormulario(e) {
    
     if(e.target.value.length > 0 ) {
          //elimina los errores
          const error = document.querySelector('p.error');
          if(error){
            error.remove();
          }          

          e.target.classList.remove('border','border-red-500');
          e.target.classList.add('border','border-green-500');

     } else {
          e.target.classList.remove('border','border-green-500');
          e.target.classList.add('border', 'border-red-500');
          mostrarError('Todos los campos son obligatorios');
     }

     // Validar unicamente el email
     if(e.target.type === 'email') {          
     
          if(er.test(e.target.value)){
            // console.log('Email valido');
            const error = document.querySelector('p.error');
            if(error){
              error.remove();
            }

            e.target.classList.remove('border','border-red-500');
            e.target.classList.add('border','border-green-500');
          } else{
              e.target.classList.remove('border','border-green-500');
              e.target.classList.add('border','border-red-500');
              mostrarError('El email no es valido');
          }

     }
     if( er.test(email.value) && name.value !== '' && telefono.value !== '' && direccion.value !== '' && mensaje.value !== '' ) {
        btnEnviar.disabled = false;        
        btnEnviar.classList.remove('cursor-not-allowed','opacity-50');
        // console.log("pasaste la validacion");
     } 
}

function mostrarError(mensaje)
{
  const mensajeError = document.createElement('p');
  mensajeError.textContent = mensaje;
  mensajeError.classList.add('border','border-red-500', 'background-red-100','text-red-500','p-3','mt-5','text-center','error');

  const errores = document.querySelectorAll('.error');
  if(errores.length === 0){
    formularioEnviar.appendChild(mensajeError);
  }
}

// Cuando se envia el correo
function enviarEmail(e) {

    e.preventDefault();
    // console.log("ejecutado");

    // Spinner al presionar Enviar
     const spinner = document.querySelector('#spinner');
     spinner.style.display = 'flex';

     var datos = $("#enviar-mail").serialize();

     console.log();

     $.ajax({
        method: "POST",
        url:  APIURL,
        data: infoPost,
        success: function(respuesta){
            // Ocultar Spinner y mostrar mensaje
            console.log(respuesta);
           setTimeout( () => {
                spinner.style.display = 'none';

                const parrafo = document.createElement('p');
                parrafo.textContent = 'Pedido generado, se podran en contacto para coordinar entrega';
                parrafo.classList.add('text-center','my-10','p-2','bg-green-500','text-white','font-bold','uppercase')
                
                formularioEnviar.insertBefore(parrafo,spinner);

                setTimeout(() =>  {
                     parrafo.remove();
                     resetearFormulario();               
                }, 5000);
           }, 3000);
        }
    });     
     
}

// Resetear el formulario 
function resetFormulario(e) {
     formularioEnviar.reset();
     btnEnviar.disabled = true;
     btnEnviar.classList.add('cursor-not-allowed', 'opacity-50')
     e.preventDefault();
}

function resetearFormulario(){
  formularioEnviar.reset();
  inicioApp();
}

//ENVIO DEL FORMULARIO
// $("#enviar-mail").submit(function(event){
//     event.preventDefault(); //almacena los datos sin refrescar el sitio web.
//     enviarEmail();
// });

// function enviar(){
//     console.log("ejecutado");
//     var datos = $("#enviar-mail").serialize(); 
//     $.ajax({
//         type: "post",
//         url:"formulario.php",
//         data: datos,
//         success: function(texto){
//             if(texto=="exito"){
//                 correcto();
//                 redirec();
//             }else{
//                 phperror(texto);
//             }
//         }
//     })
// }