var productData = [];

// TODO add documentation - https://blog.shhdharmen.me/comments-usage-and-best-practices-in-javascript

// var productIDs = []
// async function getProducts() {
//     await fetch('http://localhost:3000/api/products')
//     .then(response => { return response.json(); })
//     .then((promise => promise.forEach(i => {
//         productData = promise;
//         productIDs = i._id

//         //console.log(productIDs)

//     })))}

//     console.log(productData)
// getProducts()
let product = window.location.search.split("?id=").join("");


async function getProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${product}`);
    productData = await response.json();
}

/**
 * Displays th
 */
async function displayProduct() {
    await getProduct()

    let img = document.querySelector(".item__img");
    img.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
console.log(img.innerHTML)
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


function addToCart() {
    let addToCart = document.getElementById("addToCart");

    addToCart.addEventListener("click", () => {
        //Use LocalStorage
        // Need to remember productID and color, and qty
        // find method if the same prod is in the cart

        let localStorage = JSON.parse(localStorage.getItem);
    })


}

//console.log(productID)

/*fetch('http://localhost:3000/api/products')
    .then(response => { return response.json(); })

    .then(data => data.forEach(ids => {
        let productID = ids._id;
    })
        .then(data => data.forEach(imgs => {
            // let img = `<img src="${imgs.imageUrl}" alt="${imgs.altTxt}">`
            //console.log(imgs)
            const keysArray = Object.keys(imgs);
            const count = keysArray.length

            //console.log(count)
            // let itemsClass = document.querySelector(".item__img")

            // itemsClass.innerHTML = img
            for (var i = 0; i <= count; i++) {
                let img = `<img src="${imgs.imageUrl}" alt="${imgs.altTxt}">`
                //console.log(img)

                //let itemsClass = document.querySelector(".item__img")

                document.querySelector(".item__img").innerHTML = img

                //console.log(img)
            }

        })));


fetch('http://localhost:3000/api/products')
    .then(response => { return response.json(); })

    .then(data => data.forEach(title => {
        let titleName = title.name

        document.querySelector("#title").innerHTML = titleName
    }));

fetch('http://localhost:3000/api/products')
    .then(response => { return response.json(); })

    .then(data => data.forEach(price => {
        let itemPrice = price.price

        document.querySelector("#price").innerHTML = itemPrice
    }));



fetch('http://localhost:3000/api/products')
    .then(response => { return response.json(); })

    //.then(console.log(response.id))

    .then(data => data.forEach(des => {
        let itemDescription = des.description

        document.querySelector("#description").innerHTML = itemDescription
    }));

fetch('http://localhost:3000/api/products')
    .then(response => { return response.json(); })

    .then(data => data.forEach(color => {


        for (let i = 0; i <= color.length; i++) {
            let itemColor = `<option value="">${color.colors[i]}</option>`


            console.log(document.querySelector("#colors").innerHTML = itemColor)
        }


    }));*/