// ELEMENTS
const toggleButton = document.querySelector(".toggle-btn");
const toggleIcon = document.querySelector(".toggle-icon");
const productsSection = document.querySelector(".products-section");
const shoppingCartSection = document.querySelector(".shopping-cart-section");
const headerQuantityText = document.querySelector(".quantity-text");
const headerTitle = document.querySelector(".header-title");
const productsList = document.querySelector(".products-list");
const conditionText = document.querySelector(".condition-text");

let inProductSection = true;

// EVENTS
toggleButton.addEventListener("click", () => {
  if (inProductSection) {
    // SHOW SHOPPING CART
    productsSection.style.display = "none";
    shoppingCartSection.style.display = "flex";
    toggleIcon.classList.replace("fa-shopping-bag", "fa-tshirt");
    headerQuantityText.style.display = "none";
    toggleIcon.style.left = "0.8rem";
    headerTitle.textContent = "Shopping Cart";
    inProductSection = false;
  } else {
    // SHOW PRODUCTS
    productsSection.style.display = "flex";
    shoppingCartSection.style.display = "none";
    toggleIcon.classList.replace("fa-tshirt", "fa-shopping-bag");
    headerQuantityText.style.display = "flex";
    toggleIcon.style.left = "1rem";
    headerTitle.textContent = "Products";
    inProductSection = true;
  }
});

// API CALL: GET PRODUCTS
const getProducts = async () => {
  try {
    const responsse = await axios.get("https://fakestoreapi.com/products");
  const data = await responsse.data;
  console.log(data);
  conditionText.style.display="none";
  renderProducts(data);
  }
  catch(err) {
    conditionText.textContent=err.message;
  }
  
};

// RENDER PRODUCTS
const renderProducts = (products) => {
  productsSection.style.display="flex";
  products.map((product) => {
    const { description, image, price, title } = product;
    // CREATE PRODUCT CARD
    const productCard = document.createElement("div");
    productCard.className = "product";
    // PRODUCT CARD HTML
    productCard.innerHTML = `
    <div class="product-img-description">
              <img
                src="${image}"
                alt="${shortenTitle(title)}"
                class="product-img"
              />
              <p class="product-description">
                ${description}
              </p>
            </div>
            <h3 class="product-name">${shortenTitle(title)}</h3>
            <div class="product-information">
              <p class="product-price">$${price}</p>
              <button class="add-to-cart-btn">Add to cart</button>
            </div>
    `;
    // APPEND TO PRODUCT LIST
    productsList.appendChild(productCard);
  });
};

// SHORTEN TITLE
const shortenTitle = (title) => {
  const splitedTitle = title.split(" ");
  let newTitle = null;
  if (splitedTitle[1] === "-") {
    newTitle = `${splitedTitle[0]} ${splitedTitle[1]} ${splitedTitle[2]}`;
  }
  else {
    newTitle = `${splitedTitle[0]} ${splitedTitle[1]}`;
  }
  return newTitle;
};

// INITIAL CALL
getProducts();
