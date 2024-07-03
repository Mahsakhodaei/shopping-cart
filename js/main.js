// ------------- variables ------------

// ------------- selecting ------------
const cartBtn = document.querySelector(".cart-btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");

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
