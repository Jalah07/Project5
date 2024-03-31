var productData = [];
let product = window.location.search.split("?id=").join("");
/**
 *
 * Return json response of the product
 */
async function getProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${product}`);
    productData = await response.json();
}
/**
 * Displays the image, price, description, color of a product
 *
 */
async function displayProduct() {
    await getProduct()

    let img = document.querySelector(".item__img");
    img.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
    let titleName = document.getElementById("title");
    titleName.innerHTML = productData.name;

    let price = document.getElementById("price");
    price.innerHTML = productData.price;

    let description = document.getElementById("description");
    description.innerHTML = productData.description;

    productData.colors.forEach(productColor => {
        let color = document.getElementById("colors");
        let option = document.createElement("option");
        option.innerHTML = `${productColor}`;
        option.value = `${productColor}`;

        color.appendChild(option);


    });
}
displayProduct()


let addToCart = document.getElementById("addToCart");

addToCart.addEventListener("click", ($event) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let productColor = document.getElementById("colors").value;
    let productQuantity = parseInt(document.getElementById("quantity").value);
    const newCartItem = {
        _id: productData._id,
        color: productColor,
        quantity: productQuantity
    }

    if (cart.length > 0) {
        let inCart = false;
        // Check if item is already in the cart
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].color === productColor && cart[i]._id === productData._id) {
                cart[i].quantity = cart[i].quantity + productQuantity
                inCart = true
            }
        }
        if (!inCart) {
            cart.push(newCartItem);
        }

    } else {
        cart.push(newCartItem);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("added to cart");
})