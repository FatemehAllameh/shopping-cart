// ELEMENTS
const toggleButton = document.querySelector(".toggle-btn");
const toggleIcon = document.querySelector(".toggle-icon");
const productsSection = document.querySelector(".products-section");
const shoppingCartSection = document.querySelector(".shopping-cart-section");
const headerQuantityText = document.querySelector(".quantity-text");
const headerTitle = document.querySelector(".header-title");
const productsList = document.querySelector(".products-list");
const conditionText = document.querySelector(".condition-text");
const itemsList = document.querySelector(".items-list");
const emptyTexts = document.querySelector(".empty-texts");
const checkoutBox = document.querySelector(".checkout-box");
const quantityText = document.querySelector(".quantity-text");
const totalPriceText = document.querySelector(".total-price-text");
const clearAllButton = document.querySelector(".clear-all-btn");
const checkoutProceedButton = document.querySelector(".checkout-proceed-btn");
const productCategoriesWrapper = document.querySelector(".product-categories");
const categoryButtonContainer = document.querySelector(".category-buttons");
const searchInput = document.querySelector(".search-input");

// GET CART DATA FROM LOCALSTORAGE OR SET EMPTY ARRAY
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// FLAG TO CHECK IF USER IS IN PRODUCT SECTION
let inProductSection = true;
// FLAG TO TRACK FETCH ERRORS
let hasError = false;
// FLAG TO TRACK SEARCH ERRORS
let isSearchError = false;
// VARIABLE TO STORE ALL PRODUCTS 

let allProducts = null;

// TOGGLE BETWEEN PRODUCTS SECTION AND SHOPPING CART
toggleButton.addEventListener("click", () => {
  if (inProductSection) {
    // HIDE CONDITION TEXT
    conditionText.style.display = "none";
    // SHOW SHOPPING CART
    productsSection.style.display = "none";
    shoppingCartSection.style.display = "flex";
    // CHANGE ICON FROM SHOPPING-BAG TO T-SHIRT
    toggleIcon.classList.replace("fa-shopping-bag", "fa-tshirt");
    // HIDE HEADER QUANTITY TEXT
    headerQuantityText.style.display = "none";
    // ADJUST ICON POSITION
    toggleIcon.style.left = "0.8rem";
    // SET FLAG: NOW USER IS IN SHOPPING CART SECTION
    headerTitle.textContent = "Shopping Cart";
    inProductSection = false;
  } else {
    goToProductsSection();
  }
});

// API CALL: GET PRODUCTS
const getProducts = async () => {
  try {
    // FETCH PRODUCTS DATA FROM API
    const responsse = await axios.get("https://fakestoreapi.com/products");
    const data = await responsse.data;
    allProducts = data;
    // HIDE LOADING TEXT
    if (!hasError) {
      conditionText.style.display = "none";
    }

    // GET ALL PRODUCTS CATEGORY TO CREATE CATEGORY BUTTONS
    const categories = data.reduce(
      (acc, item) => {
        if (!acc.includes(item.category)) {
          acc.push(item.category);
        }
        return acc;
      },
      ["all"]
    );

    // RENDER CATEGORY BUTTONS
    renderCategoryButtons(categories);

    // RENDER ALL PRODUCTS
    renderProducts(data);

    productCategoriesWrapper.style.display = "flex";
  } catch (err) {
    hasError = true;
    conditionText.textContent = err.message;
  }
};

// RENDER CATEGORY BUTTONS
const renderCategoryButtons = (categories) => {
  categoryButtonContainer.innerHTML = "";
  categories.map((category) => {
    const categoryButton = `
      <button type="button" class="category-btn ${
        category === "all" ? "active" : ""
      }"
      data-category="${category}"
      onclick="searchProductByCategory(this)">
      ${capitalizeFirstLetter(category)}</button>
    `;
    categoryButtonContainer.innerHTML += categoryButton;
  });
};

// FILTERING PRODUCTS BY CATEGORY
const searchProductByCategory = (btn) => {
  searchInput.value = "";
  handleSearch();
  // REMOVE ACTIVE CLASS FROM ALL CATEGORY BUTTONS
  const allButtons = document.querySelectorAll(".category-btn");
  allButtons.forEach((button) => {
    button.classList.remove("active");
  });
  // ADD ACTIVE CLASS TO THE CLICKED CATEGORY BUTTON
  btn.classList.add("active");

  const buttonCategory = btn.dataset.category;
  if (buttonCategory === "all") {
    renderProducts(allProducts);
  } else {
    const filteredProducts = allProducts.filter(
      (item) => item.category === buttonCategory
    );
    renderProducts(filteredProducts);
  }
};

// CAPITALIZE THE FIRST LETTER OF CATEGORY NAMES
const capitalizeFirstLetter = (categoryName) => {
  const firsLetter = categoryName.charAt(0);
  const newCategoryName = `${firsLetter.toUpperCase()}${categoryName.slice(1)}`;
  return newCategoryName;
};

// FILTERING PRODUCTS BY SEARCH

const handleSearch = () => {
  const inputValue = searchInput.value.toLocaleLowerCase().trim();
  const searchedProducts = allProducts.filter((item) => {
    return shortenTitle(item.title).toLocaleLowerCase().includes(inputValue);
  });
  if (searchedProducts.length > 0) {
    conditionText.style.display = "none";
    isSearchError = false;
    renderProducts(searchedProducts);
  } else {
    isSearchError = true;
    conditionText.style.display = "block";
    conditionText.textContent = "Product Doesn't Exist!";
    renderProducts([]);
  }
  if (!inProductSection) {
    goToProductsSection();
  }
};
searchInput.addEventListener("input", handleSearch);

// RENDER PRODUCTS
const renderProducts = (products) => {
  if (inProductSection) {
    productsList.innerHTML = "";
    productsSection.style.display = "flex";
    products.map((product) => {
      const { id, description, image, price, title } = product;
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
              <button class="add-to-cart-btn" data-id="${id}">Add to cart</button>
            </div>
    `;
      const addToCartButton = productCard.querySelector(".add-to-cart-btn");
      // ADD SELECTED PRODUCT TO CART WHEN BUTTON IS CLICKED
      addToCartButton.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        const selectedProduct = products.find((product) => {
          return product.id == productId;
        });
        addToCart(selectedProduct);
      });

      // APPEND TO PRODUCT LIST
      productsList.appendChild(productCard);
    });
  }
};

// FINCTION TO ADD PRODUCT INTO SHOPPING CART
const addToCart = (selectedProduct) => {
  // SEE IF PRODUCT EXIST IN CART OR ITS NEW PRODUCT
  const cartItem = cartData.find((product) => {
    return product.id == selectedProduct.id;
  });
  if (!cartItem) {
    cartData.push({ ...selectedProduct, quantity: 1 });
  } else {
    cartItem.quantity++;
  }

  // SAVE CART ITEMS IN LOCAL STORAGE
  savrToLocalStorage();
  renderCart();
};

// RENDER SHOPPING CART
const renderCart = () => {
  itemsList.innerHTML = "";
  if (cartData.length !== 0) {
    checkoutBox.style.display = "flex";
    emptyTexts.style.display = "none";
    cartData.map((item) => {
      const { image, price, title, quantity } = item;
      // CREATE CART ITEM
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
          <img src="${image}" alt="${title}" class="item-img" />
          <h3 class="item-name">${shortenTitle(title)}</h3>
           <p class="item-price">$${price}</p>
          <div class="quantity-control">
            <button class="quantity-control-btn increase-btn">
              <i class="fa fa-plus"></i>
            </button>
            <p class="quantity-control-text">${quantity}</p>
            <button class="quantity-control-btn decrease-btn">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <button class="remove-btn">
            <i class="fa fa-times"></i>
          </button>
    `;

      // EVENT LISTENER TO INCREASE ITEM
      const increaseButton = cartItem.querySelector(".increase-btn");
      increaseButton.addEventListener("click", () => increaseQuantity(item));
      // EVENT LISTENER TO DECREASE ITEM
      const decreaseButton = cartItem.querySelector(".decrease-btn");
      decreaseButton.addEventListener("click", () => decreaseQuantity(item));
      // EVENT LISTENER TO REMOVE ITEM
      const removeButton = cartItem.querySelector(".remove-btn");
      removeButton.addEventListener("click", () => removeItem(item));
      // APPEND TO CART ITEMS LIST
      itemsList.appendChild(cartItem);
    });
  } else {
    checkoutBox.style.display = "none";
    emptyTexts.style.display = "block";
    const backToShop = document.querySelector(".back-to-shop");
    backToShop.addEventListener("click", () => {
      goToProductsSection();
    });
  }
  // DISPLAY THE NUMBER OF PRODUCTS IN THE CART
  quantityText.textContent = cartData.length;

  // CALCULATE AND DISPLAY THE TOTAL PRICE OF PRODUCTS IN THE CART
  const totalPrice = cartData.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);
  totalPriceText.textContent = totalPrice.toLocaleString();
};

// FUNCTION TO INCREASE ITEM QUANTITY
const increaseQuantity = (item) => {
  const cartItem = cartData.find((product) => product.id === item.id);
  if (cartItem) {
    cartItem.quantity++;
    renderCart();
    savrToLocalStorage();
  }
};

// FUNCTION TO DECREASE ITEM QUANTITY
const decreaseQuantity = (item) => {
  const cartItem = cartData.find((product) => product.id === item.id);
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--;
    renderCart();
    savrToLocalStorage();
  }
};

// FUNCTION TO REMOVE ITEM FROM SHOPPING CART
const removeItem = (item) => {
  const index = cartData.findIndex((product) => product.id === item.id);
  if (index !== -1) {
    cartData.splice(index, 1);
    renderCart();
    savrToLocalStorage();
  }
};

// CLEAR CART WHEN THE CLEAR BUTTON IS CLICKED
clearAllButton.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure to clear shopping cart?",
    showDenyButton: true,
    confirmButtonText: "Clear",
    denyButtonText: `Cancel`,
    customClass: {
      popup: "swal-popup",
      title: "swal-title",
      confirmButton: "swal-confirm",
      denyButton: "swal-deny",
      actions: "swal-actions",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      cartData = [];
      renderCart();
      savrToLocalStorage();
    }
  });
});

// CHECKOUT SHOPPING CART
checkoutProceedButton.addEventListener("click", () => {
  Swal.fire({
    title: "Checkout Successfuly Done!",
    position: "center",
    icon: "success",
    showConfirmButton: false,
    timer: 2000,
  });
  cartData = [];
  renderCart();
  savrToLocalStorage();
});

// FUNCTION TO SAVE CART PRODUCT IN LOCAL STORAGE
const savrToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cartData));
};

// SHORTEN TITLE
const shortenTitle = (title) => {
  const splitedTitle = title.split(" ");
  let newTitle = null;
  if (splitedTitle[1] === "-") {
    newTitle = `${splitedTitle[0]} ${splitedTitle[1]} ${splitedTitle[2]}`;
  } else {
    newTitle = `${splitedTitle[0]} ${splitedTitle[1]}`;
  }
  return newTitle;
};

// GO TO PRODUCT SECTION
const goToProductsSection = () => {
  if (conditionText.textContent === "Product Doesn't Exist!") {
    conditionText.style.display = "block";
  } else {
    conditionText.style.display = "none";
  }

  if (hasError) {
    conditionText.style.display = "block";
  } else {
    conditionText.style.display = "none";
  }
  // SHOW PRODUCTS
  productsSection.style.display = "flex";
  shoppingCartSection.style.display = "none";
  toggleIcon.classList.replace("fa-tshirt", "fa-shopping-bag");
  headerQuantityText.style.display = "flex";
  toggleIcon.style.left = "1rem";
  headerTitle.textContent = "Products";
  inProductSection = true;
  if (isSearchError) {
    conditionText.style.display = "block";
    conditionText.textContent = "Product Doesn't Exist!";
    renderProducts([]);
  }
};

renderCart();
// INITIAL CALL
getProducts();
