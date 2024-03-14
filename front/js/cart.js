let productData = [];
let cartData = [];
let sumOfCart = 0;
let cartPriceArray = [];
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");
let totalQuantity = parseInt(totalQuantityElement.textContent || "0");
let totalPrice = parseInt(totalPriceElement.textContent || "0");
const productCache = new Set();


async function getProductById(productID) {
  const response = await fetch(
    `http://localhost:3000/api/products/${productID}`
  );
  cartData = await response.json();
  return cartData;
}

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



      // DONE
      const updatedQty = totalQuantity - cartItem.quantity;
      totalQuantityElement.textContent = updatedQty;

      console.log(updatedQty);

      const updatedPrice = totalPrice - cartData.price;
      totalPriceElement.textContent = updatedPrice;

      console.log(updatedPrice);

      location.reload()

    });

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

    const qtyItemElement = articleElement.querySelector(".itemQuantity");
    qtyItemElement.addEventListener("change", $event => {


      let totalQuantity = parseInt(totalQuantityElement.textContent || "0");
      let totalPrice = parseInt(totalPriceElement.textContent || "0");

      //console.log($event.target.value);
      //const changedQty = document.querySelector(".itemQuantity").value;
      const changedQty = parseInt($event.target.value);


      //console.log(document.querySelector(".itemQuantity").value = $event.target.value);

      /// localStorage update it first
      //localStorage.setItem("key", JSON.stringify(changedQty));
      //JSON.parse(localStorage.getItem('key'));

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
}
displayProductInfo();


