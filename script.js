// ELEMENTS
const toggleButton = document.querySelector(".toggle-btn");
const toggleIcon = document.querySelector(".toggle-icon");
const productsSection = document.querySelector(".products-section");
const shoppingCartSection = document.querySelector(".shopping-cart-section");
const headerQuantityText = document.querySelector(".quantity-text");
const headerTitle = document.querySelector(".header-title");

let inProductSection = true;
// EVENTS
toggleButton.addEventListener("click", () => {
    if (inProductSection) {
        productsSection.style.display="none";
        shoppingCartSection.style.display="flex";
        toggleIcon.classList.replace("fa-shopping-bag","fa-tshirt");
        headerQuantityText.style.display="none";
        toggleIcon.style.left="0.8rem";
        headerTitle.textContent="Shopping Cart";
        inProductSection = false;
    }
    else {
        productsSection.style.display="flex";
        shoppingCartSection.style.display="none";
        toggleIcon.classList.replace("fa-tshirt","fa-shopping-bag");
        headerQuantityText.style.display="flex";
        toggleIcon.style.left="1rem";
        headerTitle.textContent="Products";
        inProductSection = true;
    }
});