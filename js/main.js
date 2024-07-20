// ------------- variables ------------

// ------------- selecting ------------
import { productsData } from "./products.js";
const cartBtn = document.querySelector(".cart-btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const productDOM = document.querySelector(".products-center");

// ------------- event ------------
cartBtn.addEventListener("click", showModal);
backdrop.addEventListener("click", closeModal);

// ------------- function ------------
function showModal() {
  backdrop.style.display = "block";
  modal.style.opacity = "1";
  modal.style.top = "20%";
}
function closeModal() {
  backdrop.style.display = "none";
  modal.style.opacity = "0";
  modal.style.top = "-100%";
}
// OOP
// 1.get products
class Products {
  // get from api end point !
  getproducts() {
    return productsData;
  }
}

// 2.display products
class UI {
  displayProducts(product) {
    let result = "";
    product.forEach((item) => {
      result += `<div class="product">
      <div class="img-container">
        <img src=${item.imageUrl} class="product-img" />
      </div>
      <div class="desc-container">
        <div class="product-desc">
          <p class="product-price">$ ${item.price}</p>
          <p class="product-title">${item.title}</p>
        </div>
        <button class="btn add-to-cart" data-id=${item.id}>
          <i class="fas fa-shopping-cart"></i>
          add to cart
        </button>
      </div>
    </div>`;
      productDOM.innerHTML = result;
    });
  }
}

// 3.storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productData = products.getproducts();
  const ui = new UI();
  ui.displayProducts(productData);
  Storage.saveProducts(productData);
});
