const CART_PRODUCTOS = "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadProductCart();
});

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

async function loadProducts() {
  const products = await getProductsDb();

  let html = "";
  products.forEach(product => {
    html += `
        <div class="col-6 col-md-3 col-12 product-container">
            <div class="card product">
                <img
                    src="${product.image}"
                    class="card-img-top"
                    alt="${product.name}"
                />
                <div class="card-body" align="center">
                    <p class="card-text" style="color:grey">${product.extraInfo}</p>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$ ${product.price}</p>
                    <button type="button" class="btn btn-primary btn-cart" onClick=(addProductCart(${product.id}))>Agregar</button>
                </div>
            </div>
        </div>
      `;
  });

  document.getElementsByClassName("products")[0].innerHTML = html;
}

function openCloseCart() {
  const containerCart = document.getElementsByClassName("cart-products")[0];

  containerCart.classList.forEach(item => {
    if (item === "hidden") {
      containerCart.classList.remove("hidden");
      containerCart.classList.add("active");
    }

    if (item === "active") {
      containerCart.classList.remove("active");
      containerCart.classList.add("hidden");
    }
  });
}

function addProductCart(idProduct) {  

  let arrayProductsId = [];

  let localStorageItems = localStorage.getItem(CART_PRODUCTOS);

  if (localStorageItems === null) {
    arrayProductsId.push(idProduct);
    localStorage.setItem(CART_PRODUCTOS, arrayProductsId);
  } else {
    let productsId = localStorage.getItem(CART_PRODUCTOS);
    if (productsId.length > 0) {
      productsId += "," + idProduct;
    } else {
      productsId = productId;
    }
    localStorage.setItem(CART_PRODUCTOS, productsId);
  }

  //toastr notificaciones
  // alert("agregado!");
  toastr["success"]("Producto agregado al carrito", "Agregado");

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    // "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "showDuration": "150",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  loadProductCart();

}

async function loadProductCart() {
  const products = await getProductsDb();

  // Convertimos el resultado del localStorage en un array
  const localStorageItems = localStorage.getItem(CART_PRODUCTOS);

  let html = "";

  let x = document.getElementsByClassName("cantItems")[0];

  if (!localStorageItems) {

    x.style.display = "none";

    html = `
        <div class="cart-product empty">
            <p>Carrito vacio.</p>
        </div>
      `;
  } else {

    
    x.style.display = "block";

    const idProductsSplit = localStorageItems.split(",");

    // Eliminamos los IDs duplicaos
    const idProductsCart = Array.from(new Set(idProductsSplit));

    var totalCantProducts = 0;
    var subTotal = 0;    

    idProductsCart.forEach(id => {
      products.forEach(product => {
        if (id == product.id) {
          const quantity = countDuplicatesId(id, idProductsSplit);
          const totalPrice = product.price * quantity;

          totalCantProducts+=quantity;
          subTotal+=totalPrice;

          html += `
            <div class="cart-product">
                <img src="${product.image}" alt="${product.name}" />
                <div class="cart-product-info">
                    <span class="quantity">${quantity}</span>
                    <p>${product.name}</p>
                    <p>${totalPrice.toFixed(2)}</p>
                    
                    <p class="cart-product-delete">
                        <button onClick=(deleteProductCart(${
                          product.id
                        }))>Quitar</button>
                    </p>
                </div>
            </div>  
            <hr style="color:black;width:95%">                     
        `;
        }
      });
    });

    html += `
      <div class="cart-product empty">  
          <p style="color:black;font-size:14px;font-weight:bold">Subtotal: $${subTotal}</p>         
      </div>
      <div class="cart-product empty">  
          <button type="button" class="btn btn-primary btn-cart2">Finalizar compra</button>          
      </div>
      <div class="cart-product empty">  
        <p style="color:grey;font-size:14px">Seguir comprando</p>
      </div>
      

    `;

    totalItems(totalCantProducts);

  }

  document.getElementsByClassName("cart-products")[0].innerHTML = html;
}

function totalItems(cant) {

    let html = "";

    html += `<span style="display:block;" class="badge badge-light itemCount">${cant}</span>`;

    document.getElementsByClassName("cantItems")[0].innerHTML = html;
}

function deleteProductCart(idProduct) {
  const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
  const arrayIdProductsCart = idProductsCart.split(",");
  const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);

  if (resultIdDelete) {
    let count = 0;
    let idsString = "";

    resultIdDelete.forEach(id => {
      count++;
      if (count < resultIdDelete.length) {
        idsString += id + ",";
      } else {
        idsString += id;
      }
    });
    localStorage.setItem(CART_PRODUCTOS, idsString);
  }

  const idsLocalStorage = localStorage.getItem(CART_PRODUCTOS);
  if (!idsLocalStorage) {
    localStorage.removeItem(CART_PRODUCTOS);
  }

  loadProductCart();
}

function increaseQuantity(idProduct) {
  const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
  const arrayIdProductsCart = idProductsCart.split(",");
  arrayIdProductsCart.push(idProduct);

  let count = 0;
  let idsString = "";
  arrayIdProductsCart.forEach(id => {
    count++;
    if (count < arrayIdProductsCart.length) {
      idsString += id + ",";
    } else {
      idsString += id;
    }
  });
  localStorage.setItem(CART_PRODUCTOS, idsString);
  loadProductCart();
}

function decreaseQuantity(idProduct) {
  const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
  const arrayIdProductsCart = idProductsCart.split(",");

  const deleteItem = idProduct.toString();
  let index = arrayIdProductsCart.indexOf(deleteItem);
  if (index > -1) {
    arrayIdProductsCart.splice(index, 1);
  }

  let count = 0;
  let idsString = "";
  arrayIdProductsCart.forEach(id => {
    count++;
    if (count < arrayIdProductsCart.length) {
      idsString += id + ",";
    } else {
      idsString += id;
    }
  });
  localStorage.setItem(CART_PRODUCTOS, idsString);
  loadProductCart();
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
