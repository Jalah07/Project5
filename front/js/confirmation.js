let orderId = window.location.search.split("?order-id=").join("");

let orderIdElement = document.getElementById("orderId");
orderIdElement.innerHTML = orderId;