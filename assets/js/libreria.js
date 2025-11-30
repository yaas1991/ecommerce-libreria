const products = [
  { id: 1, title: "Cien años de soledad", author: "Gabriel García Márquez", price: 18.50, 
    description: "La obra maestra del realismo mágico que narra siete generaciones de la familia Buendía en el mítico pueblo de Macondo. Una reflexión profunda sobre el destino, la memoria y la soledad.", 
    image: "/assets/img/Cien años de soledad.jpg" },
  { id: 2, title: "1984", author: "George Orwell", price: 14.99, 
    description: "Una distopía aterradora sobre totalitarismo, vigilancia masiva y la manipulación de la verdad. «El Gran Hermano te vigila».", 
    image: "/assets/img/1984.jpg" },
  { id: 3, title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", price: 22.00, 
    description: "La mayor obra de la literatura española. Las aventuras del ingenioso hidalgo que perdió el juicio por leer libros de caballerías.", 
    image: "/assets/img/Don Quijote.jpg" },
  { id: 4, title: "Harry Potter y la piedra filosofal", author: "J.K. Rowling", price: 19.99, 
    description: "El comienzo de la saga mágica más vendida de la historia. Un niño descubre que es mago y entra en Hogwarts.", 
    image: "/assets/img/Harry Potter.jpg" },
  { id: 5, title: "El Hobbit", author: "J.R.R. Tolkien", price: 16.75, 
    description: "La aventura de Bilbo Bolsón que dio origen a la Tierra Media. Un viaje épico lleno de dragones, anillos y tesoros.", 
    image: "/assets/img/El Hobbit.jpg" },
  { id: 6, title: "Orgullo y prejuicio", author: "Jane Austen", price: 12.50, 
    description: "El clásico romántico por excelencia. Elizabeth Bennet y el señor Darcy en una crítica brillante a la sociedad victoriana.", 
    image: "/assets/img/Orgullo y prejuicio.jpg" },
  { id: 7, title: "El señor de los anillos", author: "J.R.R. Tolkien", price: 34.99, 
    description: "La epopeya completa de la Comunidad del Anillo. La lucha entre el bien y el mal en la Tierra Media (edición única).", 
    image: "/assets/img/El señor de los anillos.jpg" },
  { id: 8, title: "Crimen y castigo", author: "Fiódor Dostoyevski", price: 17.00, 
    description: "Una de las novelas psicológicas más profundas de la historia. Raskólnikov y la culpa que lo consume.", 
    image: "/assets/img/Crimen y castigo.jpg" }
];

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  let cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCounter();
}

function updateQuantity(productId, delta) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart.splice(index, 1);
    saveCart(cart);
    renderCart();        // solo si estamos en la página del carrito
    updateCartCounter();
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartCounter();
}

function updateCartCounter() {
  const badge = document.getElementById('cart-counter');
  if (!badge) return;
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
}

// Renderizado de páginas
function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0">
        <img src="${product.image}" class="card-img-top" style="height: 350px; object-fit: cover;" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-muted mb-2">${product.author}</p>
          <p class="card-text fw-bold fs-4 text-primary">$${product.price.toFixed(2)}</p>
          <div class="mt-auto">
            <a href="detalle.html?id=${product.id}" class="btn btn-outline-secondary btn-sm me-2">Ver detalle</a>
            <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  // Event listeners para botones agregar (dinámicos)
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      addToCart(parseInt(e.currentTarget.dataset.id));
    });
  });
}

function renderDetail() {
  const detailContainer = document.getElementById('detail-product');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const product = products.find(p => p.id === productId);

  if (!product) {
    detailContainer.innerHTML = '<div class="alert alert-danger">Producto no encontrado</div>';
    return;
  }

  document.getElementById('product-image').src = product.image;
  document.getElementById('product-image').alt = product.title;
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-author').textContent = product.author;
  document.getElementById('product-price').textContent = '$' + product.price.toFixed(2);
  document.getElementById('product-description').innerHTML = '<p class="lead">' + product.description + '</p>';

  // Botón agregar en detalle
  const addBtn = document.getElementById('add-to-cart-detail');
  addBtn.dataset.id = productId;
  addBtn.addEventListener('click', () => addToCart(productId));
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  if (!container || !totalElement) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center fs-4 text-muted">Tu carrito está vacío</p>';
    totalElement.textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'row align-items-center mb-4 border-bottom pb-3';
    div.innerHTML = `
      <div class="col-3 col-md-2">
        <img src="${item.image}" class="img-fluid rounded shadow-sm" style="height: 100px; object-fit: cover;" alt="${item.title}">
      </div>
      <div class="col-5 col-md-6">
        <h6 class="mb-0">${item.title}</h6>
        <small class="text-muted">${item.author}</small>
      </div>
      <div class="col-3 col-md-2">
        <div class="input-group input-group-sm">
          <button class="btn btn-outline-secondary minus" data-id="${item.id}">−</button>
          <input type="text" class="text-center form-control" value="${item.quantity}" readonly>
          <button class="btn btn-outline-secondary plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="col-3 col-md-1 text-end fw-bold">
        $${subtotal.toFixed(2)}
      </div>
      <div class="col-1">
        <button class="btn btn-danger btn-sm remove" data-id="${item.id}">×</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalElement.textContent = total.toFixed(2);
}

// Delegación de eventos para botones del carrito (dinámicos)
document.getElementById('cart-items')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('plus')) {
    updateQuantity(parseInt(e.target.dataset.id), 1);
  } else if (e.target.classList.contains('minus')) {
    updateQuantity(parseInt(e.target.dataset.id), -1);
  } else if (e.target.classList.contains('remove')) {
    removeFromCart(parseInt(e.target.dataset.id));
  }
});

// Inicio de la app
document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();
  renderProducts();
  renderDetail();
  renderCart();

  // Botón vaciar carrito (estático)
  document.getElementById('clear-cart')?.addEventListener('click', () => {
    localStorage.removeItem('cart');
    renderCart();
    updateCartCounter();
  });

  // Botones "Agregar al carrito" estáticos en detalle y dinámicos en home
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      addToCart(parseInt(e.currentTarget.dataset.id));
    });
  });
});
