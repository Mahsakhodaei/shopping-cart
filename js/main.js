// ------------- variables ------------
let cart = [];
let buttonsDom = [];

// ------------- selecting ------------
import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const productDOM = document.querySelector(".products-center");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const modalContent = document.querySelector(".modal-content");
const clearCart = document.querySelector(".clear-cart");

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
          add to cart
        </button>
      </div>
    </div>`;
      productDOM.innerHTML = result;
    });
  }

  getAddToCardBtns() {
    const addToCardBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonsDom = addToCardBtn;

    addToCardBtn.forEach((btn) => {
      const id = btn.dataset.id;
      //check if this product id is in cart or not !
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // ّget product from local storage
        const addedproduct = { ...Storage.getproduct(id), quantity: 1 };
        // add to cart
        cart = [...cart, addedproduct];
        // save cart to local storage
        Storage.saveCart(cart);
        // update cart value
        this.setCartValue(cart);
        // add to cart item
        this.addCartItem(addedproduct);
        // get cart from storage!
      });
    });
  }

  setCartValue(cart) {
    let tempCountItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCountItems += curr.quantity;
      return acc + curr.price * curr.quantity;
    }, 0);
    cartTotal.innerText = `Total price : ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCountItems;
  }

  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("modal-item");
    div.innerHTML = `<img
    src=${cartItem.imageUrl}
    class="modal-item-img"
  />
  <div class="modal-item-desc">
    <h4>${cartItem.title}</h4>
    <h5>${cartItem.price} $</h5>
  </div>
  <div class="modal-item-controller">
    <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
    <p>${cartItem.quantity}</p>
    <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
  </div>
  <i class="fas fa-trash-alt remove-item" data-id=${cartItem.id}></i>`;
    modalContent.appendChild(div);
  }

  setupApp() {
    // get cart from storage
    cart = Storage.getCart() || [];
    // add cart item
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    // set value : total parice + items
    this.setCartValue(cart);
  }

  cartLogic() {
    // clear cart :
    clearCart.addEventListener("click", () => this.clearCart());

    // cart functionality:
    modalContent.addEventListener("click", (event) => {
      // console.log(event.target);
      if (event.target.classList.contains("fa-chevron-up")) {
        // console.log(event.target.dataset.id);
        const addedQuontity = event.target;
        // 1. get item from cart
        const addedItem = cart.find(
          (item) => item.id === parseInt(addedQuontity.dataset.id)
        );
        addedItem.quantity++;
        // 2. update cart value
        this.setCartValue(cart);
        // 3. save cart
        Storage.saveCart(cart);
        // 4. update cart item in UI :
        // console.log(addedQuontity.nextElementSibling);
        addedQuontity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-alt")) {
        const removeItem = event.target;
        const _removedItem = cart.find(
          (item) => item.id === parseInt(removeItem.dataset.id)
        );
        // remove from cartItem
        this.removeItem(_removedItem.id);
        // remove item in UI :
        modalContent.removeChild(removeItem.parentElement);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuontity = event.target;
        // 1. get item from cart
        const substractedItem = cart.find(
          (item) => item.id === parseInt(subQuontity.dataset.id)
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          modalContent.removeChild(subQuontity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        // 2. update cart value
        this.setCartValue(cart);
        // 3. save cart
        Storage.saveCart(cart);
        // 4. update cart item in UI :
        subQuontity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }

  clearCart() {
    // remove : (DRY) =>
    cart.forEach((cItem) => this.removeItem(cItem.id));
    //remove cart content children
    while (modalContent.children.length) {
      modalContent.removeChild(modalContent.children[0]);
    }
    closeModal();
  }

  removeItem(id) {
    //update cart
    cart = cart.filter((cartItem) => cartItem.id !== id);
    // update total price + items
    this.setCartValue(cart);
    //update storage
    Storage.saveCart(cart);
    //get add to cart btns => update text and disable
    this.getSingleButton(id);
  }

  getSingleButton(id) {
    const button = buttonsDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
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

  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productData = products.getproducts();
  // set up : get cart and set up app :
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productData);
  ui.getAddToCardBtns();
  ui.cartLogic();
  Storage.saveProducts(productData);
});
