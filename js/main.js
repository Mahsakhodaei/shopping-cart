// ------------- variables ------------
let cart = [];

// ------------- selecting ------------
import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const productDOM = document.querySelector(".products-center");

// console.log(addToCardBtn);
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
  getAddToCardBtns() {
    const addToCardBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCardBtn];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      //check if this product id is in cart or not !
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // ّget product from local storage
        const addedproduct = Storage.getproduct(id);
        // add to cart
        cart = [...cart, { ...addedproduct, quantity: 1 }];
        // save cart to local storage
        Storage.saveCart(cart);
        // update cart value
        // add to cart item
      });
    });
  }
}

// 3.storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getproduct(id) {
    const _product = JSON.parse(localStorage.getItem("products"));
    return _product.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productData = products.getproducts();
  const ui = new UI();
  ui.displayProducts(productData);
  ui.getAddToCardBtns();
  Storage.saveProducts(productData);
});
