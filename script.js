console.clear();

// Easily modifiable products list
let productsList = [
  {
    id: 'bottle',
    name: 'Bottle',
    price: 20,
    img: 'https://aaryhash.github.io/simple-js-cart/images/bottle.jpg',
  },
  {
    id: 'coasters',
    name: 'Coasters',
    price: 27,
    img: 'https://aaryhash.github.io/simple-js-cart/images/coasters.jpg',
  },
  {
    id: 'tumbler',
    name: 'Tumbler',
    price: 16,
    img: 'https://aaryhash.github.io/simple-js-cart/images/tumbler.jpg',
  },
  {
    id: 'tote-bag',
    name: 'Tote Bag',
    price: 14,
    img: 'https://aaryhash.github.io/simple-js-cart/images/tote-bag.jpg',
  },
];
// For localStorage functionality
let savedCart = [
  // {
  //   productId: 'bottle',
  //   price: 20,
  //   quantity: 1,
  // },
  // {
  //   productId: 'coasters',
  //   price: 27,
  //   quantity: 2,
  // },
];

// Initialization
let productTarget = document.querySelector('#product-container');
let cartTarget = document.querySelector('#cart');
let summaryTarget = document.querySelector('#summary');
let itemTotal = createEl('p', 'item-total');
let priceTotal = createEl('p', 'price-total');
summaryTarget.append(itemTotal);
summaryTarget.append(priceTotal);
let itemTotalTarget = document.querySelector('#item-total');
let priceTotalTarget = document.querySelector('#price-total');

productsList.forEach(addProduct);

try {
  let data = JSON.parse(localStorage.getItem('saved-cart'));
  if (data) {
    savedCart = [...data];
  }
  savedCart.forEach(function (item) {
    if (!item.deletedAt) addCartItem(item.productId, item.quantity, true);
  });
} catch (err) {
  console.error(err);
}

updateSummary();

/*
 * Functions Below
 */

// Creates product elements
function addProduct(productObj) {
  let container = createEl('div', '', ['product']);
  let image = createEl('img');
  image.src = productObj.img;
  let name = createEl('h3');
  name.innerText = productObj.name;
  let price = createEl('h4');
  price.innerText = `$${productObj.price.toFixed(2)}`;
  let btn = createEl('button', productObj.id, 'product-btn');
  btn.innerText = 'Add to Cart';
  btn.addEventListener('click', function (event) {
    addCartItem(event.target.id);
  });

  container.append(image);
  container.append(name);
  container.append(price);
  container.append(btn);
  productTarget.append(container);
}

// Creates items for cart
function addCartItem(productId, amt = 1, isSaved = false) {
  let exists = false;
  if (!isSaved) {
    let cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(function (item) {
      if (item.dataset.item === productId) {
        let quantity = item.querySelector('.quantity');
        quantity.stepUp();
        quantity.dispatchEvent(new Event('change'));
        exists = true;
      }
    });
  }
  if (!exists) {
    productsList.forEach(function (product) {
      if (product.id === productId) {
        let container = createEl('div', '', ['cart-item']);
        container.dataset.item = product.id;
        let name = createEl('p');
        name.innerText = `${product.name}
      `;

        let btn = createEl('button', '', ['remove-btn']);
        btn.innerText = 'Remove';
        btn.dataset.item = product.id;
        btn.addEventListener('click', function (event) {
          removeCartItem(event.target.dataset.item);
        });
        name.append(btn);

        let price = createEl('p', '', ['price']);
        price.innerText = `$${product.price.toFixed(2)}`;

        let quantity = createEl('input', '', ['quantity']);
        quantity.type = 'number';
        quantity.min = '1';
        quantity.value = amt;
        quantity.dataset.item = product.id;
        quantity.addEventListener('change', updateSubtotal);

        let subtotal = createEl('p', '', ['subtotal']);
        subtotal.innerText = `$${(product.price * amt).toFixed(2)}`;
        subtotal.dataset.item = product.id;

        container.append(name);
        container.append(price);
        container.append(quantity);
        container.append(subtotal);
        cartTarget.append(container);
        if (!isSaved) {
          savedCart.push({
            productId: product.id,
            price: product.price,
            quantity: amt,
          });
        }
        updateSummary();
      }
    });
  }
}

// Removes item from cart and storage
function removeCartItem(id) {
  let cartItems = document.querySelectorAll('.cart-item');
  cartItems.forEach(function (item) {
    if (item.dataset.item === id) item.remove();
  });

  let tempArr = [];
  savedCart.forEach(function (item) {
    if (item.productId !== id) {
      tempArr.push(item);
    }
  });
  savedCart = JSON.parse(JSON.stringify(tempArr));

  updateSummary();
}

// Updates subtotal using quantity
function updateSubtotal(event) {
  let quantity = event.target;
  let value = +quantity.value;
  let subtotal = quantity.parentElement.querySelector('.subtotal');

  savedCart.forEach(function (item) {
    if (item.productId === quantity.dataset.item) {
      if (value < 1 || isNaN(value)) {
        quantity.value = 1;
        item.quantity = 1;
      } else {
        item.quantity = value;
      }
      subtotal.innerText = `$${(item.price * item.quantity).toFixed(2)}`;
    }
  });

  updateSummary();
}

// Updates the final cart summary
function updateSummary() {
  let items = 0;
  let total = 0;

  savedCart.forEach(function (item) {
    total += item.price * item.quantity;
    items += item.quantity;
  });

  if (items === 1) {
    itemTotalTarget.innerText = `1 item in your cart`;
  } else {
    itemTotalTarget.innerText = `${items} items in your cart`;
  }

  if (total === 0) {
    priceTotalTarget.innerText = `Total: $0`;
  } else {
    priceTotalTarget.innerText = `Total: $${total.toFixed(2)}`;
  }

  localStorage.setItem('saved-cart', JSON.stringify(savedCart));
}

// Simplifies HTML element creation
function createEl(type = 'div', id = '', classes = []) {
  let el = document.createElement(type);
  if (id && id !== '') el.id = id;
  if (classes && classes.length > 0) {
    el.classList.add(...classes);
  }
  return el;
}
