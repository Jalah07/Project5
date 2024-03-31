let productData = [];
let cartData = [];
let sumOfCart = 0;
let cartPriceArray = [];
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");
let totalQuantity = parseInt(totalQuantityElement.textContent || "0");
let totalPrice = parseInt(totalPriceElement.textContent || "0");
const productCache = new Set();

/**
 *
 *
 * @param {*} productID ID of product
 * @return {*} cartData of specific product by ID
 */
async function getProductById(productID) {
  const response = await fetch(
    `http://localhost:3000/api/products/${productID}`
  );
  cartData = await response.json();
  return cartData;
}
/**
 * displays all the product info in the cart
 *
 */
async function displayProductInfo() {
  let myCart = JSON.parse(localStorage.getItem("cart")) || [];
  let imgURL = "";

  for (const cartItem of myCart) {
    const cartData = await getProductById(cartItem._id);
    productCache.add(cartData);

    totalQuantity += cartItem.quantity;
    totalQuantityElement.textContent = totalQuantity;

    totalPrice += cartData.price * cartItem.quantity;
    totalPriceElement.textContent = totalPrice;

    imgURL += cartData.imageUrl;

    itemColor = cartData.colors;
    const articleElement = document.createElement("article");
    articleElement.classList.add("cart__item");
    articleElement.dataset.id = cartData._id;
    articleElement.dataset.color = cartItem.color;

    const displayToCart = `<div class="cart__item__img">
          <img src="${cartData.imageUrl}" alt="${cartData.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${cartData.name}</h2>
            <p>${cartItem.color}</p>
            <p>${cartData.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Quantity : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Delete</p>
            </div>
          </div>
        </div>`;
    articleElement.innerHTML = displayToCart;
    const cartItems = document.getElementById("cart__items");
    cartItems.appendChild(articleElement);
    const deleteItem = articleElement.querySelector(".deleteItem");

    deleteItem.addEventListener("click", $event => {
      let myCart = JSON.parse(localStorage.getItem("cart")) || [];
      const cartItemElement = $event.target.closest("article");
      const id = cartItemElement.dataset.id;
      const color = cartItemElement.dataset.color;
      console.log(id, color);

      const filtered = myCart.filter(
        item => item._id !== id && item.color !== color
      );
      localStorage.setItem("cart", JSON.stringify(filtered));
      console.log(filtered);
      cartItemElement.remove();


      const updatedQty = totalQuantity - cartItem.quantity;
      totalQuantityElement.textContent = updatedQty;

      console.log(updatedQty);

      const updatedPrice = totalPrice - cartData.price;
      totalPriceElement.textContent = updatedPrice;

      console.log(updatedPrice);

      location.reload()

    });

    const qtyItemElement = articleElement.querySelector(".itemQuantity");
    qtyItemElement.addEventListener("change", $event => {


      let totalQuantity = parseInt(totalQuantityElement.textContent || "0");
      let totalPrice = parseInt(totalPriceElement.textContent || "0");

      const changedQty = parseInt($event.target.value);

      const cartItemElement = $event.target.closest("article");
      const id = cartItemElement.dataset.id;
      const color = cartItemElement.dataset.color;
      const foundItem = myCart.find(
        item => item._id === id && item.color === color
      );
      const quantityDelta = changedQty - foundItem.quantity;
      foundItem.quantity = changedQty;
      console.log(quantityDelta);
      localStorage.setItem("cart", JSON.stringify(myCart));
      console.log(foundItem);


      totalQuantityElement.textContent = totalQuantity + quantityDelta;


      console.log(productCache);
      let price;
      productCache.forEach(product => {
        if (product._id === id) {
          price = product.price
        }
      })

      totalPriceElement.textContent = totalPrice + quantityDelta * price;


    });
  }

  const firstNameItemElement = document.querySelector("#firstName");
  const lastNameItemElement = document.querySelector("#lastName");
  const addressItemElement = document.querySelector("#address");
  const cityItemElement = document.querySelector("#city");
  const emailItemElement = document.querySelector("#email");
  const orderItemElement = document.querySelector("#order");


  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const emailErrorMsg = document.getElementById("emailErrorMsg");

  let contact = {
    firstName,
    lastName,
    address,
    city,
    email
  };

  let products = [];

  firstNameItemElement.addEventListener("change", (event) => {
    vaildateAlphaField(event, firstNameErrorMsg, contact, firstNameItemElement, "firstName");
  })

  lastNameItemElement.addEventListener("change", (event) => {
    vaildateAlphaField(event, lastNameErrorMsg, contact, lastNameItemElement, "lastName");
  })

  addressItemElement.addEventListener("change", (event) => {
    // if empty err, if not valid length err, if not valid regex err,
    if (event.target.value.length == 0) {
      addressErrorMsg.innerHTML = '';
    }
    if (event.target.value.match(/^[0-9]{1,6} [a-z A-Z]{3,25}$/)) {
      addressErrorMsg.innerHTML = '';
      contact.address = addressItemElement.value;

    }
    if (!event.target.value.match(/^[0-9]{1,6} [a-z A-Z]{3,25}$/)) {
      addressErrorMsg.innerHTML = "Address must contain street number and street name";
    }
  })

  cityItemElement.addEventListener("change", (event) => {
    vaildateAlphaField(event, cityErrorMsg, contact, cityItemElement, "city");
  })

  emailItemElement.addEventListener("input", (event) => {
    // if empty err, if not valid length err, if not valid regex err,
    if (event.target.value.length == 0) {
      emailErrorMsg.innerHTML = '';
    } else if (event.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      emailErrorMsg.innerHTML = "";
      contact.email = emailItemElement.value;

    }
    if (!event.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      emailErrorMsg.innerHTML = "Email must written in this format kanap@gmail.com";
    }
  })

  let postOrder = {};

  orderItemElement.addEventListener("click", async (event) => {
    event.preventDefault();
    let myCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (firstNameErrorMsg.innerHTML.trim().length == 0 && lastNameErrorMsg.innerHTML.trim().length == 0 && addressErrorMsg.innerHTML.trim().length == 0 && cityErrorMsg.innerHTML.trim().length == 0 && emailErrorMsg.innerHTML.trim().length == 0) {

      for (const cartItem of myCart) {
        products.push(cartItem._id);
      }

      postOrder = { contact, products };

    } else {
      return false
    }
    const response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postOrder),
    }).then(
      response => { return response.json(); }
    ).then(data => {
      const orderId = data.orderId;
      window.location.assign(`/front/html/confirmation.html?order-id=${orderId}`)
      localStorage.clear();

    })
  }
  )

}
displayProductInfo();

/**
 *
 *
 * @param {*} event
 * @param {*} nameErrorMsg - generalized error message
 * @param {*} contactInfo - contact information
 * @param {*} nameItemElement - element of specfic item
 * @param {*} fieldName - field name
 */
function vaildateAlphaField(event, nameErrorMsg, contactInfo, nameItemElement, fieldName) {
  // if empty err, if not valid length err, if not valid regex err
  if (event.target.value.length == 0) {
    nameErrorMsg.innerHTML = '';
  } else if (event.target.value.length < 3 && event.target.value.length > 25) {
    nameErrorMsg.innerHTML = "Name must be between 3 and 25 characters";
  } else if (event.target.value.match(/^[a-z A-Z]{3,25}$/)) {
    nameErrorMsg.innerHTML = "";
    contactInfo[fieldName] = nameItemElement.value;
  } else if (!event.target.value.match(/^[a-z A-Z]{3,25}$/)) {
    nameErrorMsg.innerHTML = "Name must be between 3 and 25 characters and alpha";
  }
}