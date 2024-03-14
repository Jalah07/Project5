fetch('http://localhost:3000/api/products')
    .then(response => { return response.json(); })

    .then(data => data.forEach(product => {

        let products = `<a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}.</p>
        </article>
      </a>`;

        let itemsClass = document.querySelector(".items");

        itemsClass.innerHTML += products;


    }));