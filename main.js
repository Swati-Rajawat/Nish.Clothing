// ===== CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animateRing);
}
animateRing();

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('nish_cart') || '[]');

const products = [
  { id: 1, name: 'Obsidian Overcoat', price: 4999, originalPrice: null, tag: 'new', emoji: '🧥', sizes: ['XS','S','M','L','XL'], category: 'outerwear' },
  { id: 2, name: 'Raw Denim Selvedge', price: 2199, originalPrice: 2999, tag: 'sale', emoji: '👖', sizes: ['28','30','32','34','36'], category: 'bottoms' },
  { id: 3, name: 'Silk Revere Shirt', price: 1899, originalPrice: null, tag: 'limited', emoji: '👔', sizes: ['XS','S','M','L','XL'], category: 'tops' },
  { id: 4, name: 'Merino Turtleneck', price: 2499, originalPrice: null, tag: 'new', emoji: '🧣', sizes: ['S','M','L','XL'], category: 'tops' },
  { id: 5, name: 'Wide Leg Trousers', price: 1699, originalPrice: null, tag: null, emoji: '👗', sizes: ['XS','S','M','L'], category: 'bottoms' },
  { id: 6, name: 'Leather Bomber Jacket', price: 5999, originalPrice: null, tag: 'limited', emoji: '🥼', sizes: ['S','M','L','XL'], category: 'outerwear' },
  { id: 7, name: 'Linen Blazer', price: 3299, originalPrice: 4200, tag: 'sale', emoji: '🎩', sizes: ['S','M','L','XL','XXL'], category: 'outerwear' },
  { id: 8, name: 'Organic Cotton Tee', price: 899, originalPrice: null, tag: 'new', emoji: '👕', sizes: ['XS','S','M','L','XL','XXL'], category: 'tops' },
];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(productId, size = 'M') {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, size, qty: 1 }); }
  localStorage.setItem('nish_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
  showToast(`${product.name} added to cart ✦`);
}

function removeFromCart(productId, size) {
  cart = cart.filter(item => !(item.id === productId && item.size === size));
  localStorage.setItem('nish_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function changeQty(productId, size, delta) {
  const item = cart.find(i => i.id === productId && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId, size);
  else {
    localStorage.setItem('nish_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!itemsEl) return;
  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛍️</div><p>Your cart is empty</p></div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">Size: ${item.size}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${item.id},'${item.size}',-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},'${item.size}',1)">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
          <button onclick="removeFromCart(${item.id},'${item.size}')" style="background:none;border:none;color:var(--text-muted);cursor:none;font-size:1rem;margin-top:8px;display:block;transition:color 0.3s;" onmouseover="this.style.color='var(--rust)'" onmouseout="this.style.color='var(--text-muted)'">✕</button>
        </div>
      </div>
    `).join('');
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  updateCheckoutSummary();
}

// ===== CART SIDEBAR =====
function openCart() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== NAVIGATION =====
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  closeCart();
  updateNavLinks(pageId);
}

function updateNavLinks(active) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.dataset.page === active ? 'var(--gold)' : '';
    a.style.opacity = a.dataset.page === active ? '1' : '';
  });
}

// ===== CHECKOUT SUMMARY =====
function updateCheckoutSummary() {
  const summaryItemsEl = document.getElementById('checkout-summary-items');
  if (!summaryItemsEl) return;
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 3000 ? 0 : 199;
  const total = subtotal + shipping;
  summaryItemsEl.innerHTML = cart.map(i => `
    <div class="summary-item">
      <div class="summary-item-img">${i.emoji}</div>
      <div class="summary-item-details">
        <div class="summary-item-name">${i.name}</div>
        <div class="summary-item-meta">Size: ${i.size} · Qty: ${i.qty}</div>
      </div>
      <div class="summary-item-price">₹${(i.price * i.qty).toLocaleString('en-IN')}</div>
    </div>
  `).join('') + `
    <div class="summary-totals">
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
      <div class="summary-row total"><span>Total</span><span class="price">₹${total.toLocaleString('en-IN')}</span></div>
    </div>
  `;
}

// ===== PRODUCTS RENDER =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('all-products-grid');
  if (!grid) return;
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img">
        <div class="product-img-placeholder">${p.emoji}</div>
        <div class="product-overlay">
          <button class="product-quick-add" onclick="quickAddHandler(event, ${p.id})">Quick Add</button>
        </div>
        ${p.tag ? `<div class="product-tag tag-${p.tag}">${p.tag}</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">
          ${p.originalPrice ? `<span class="original">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          ₹${p.price.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  `).join('');
}

function quickAddHandler(e, id) {
  e.stopPropagation();
  addToCart(id);
}

// ===== FILTERS =====
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

// ===== AUTH TABS =====
function setupAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-form-panel').forEach(p => {
        p.style.display = p.id === target + '-form' ? 'block' : 'none';
      });
    });
  });
}

// ===== PAYMENT METHOD SELECT =====
function setupPaymentMethods() {
  document.querySelectorAll('.payment-method').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

// ===== PLACE ORDER =====
function placeOrder() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  const name = document.getElementById('checkout-name')?.value;
  const email = document.getElementById('checkout-email')?.value;
  const address = document.getElementById('checkout-address')?.value;
  if (!name || !email || !address) { showToast('Please fill all required fields'); return; }
  cart = [];
  localStorage.removeItem('nish_cart');
  updateCartCount();
  renderCart();
  showToast('Order placed successfully! 🎉');
  document.getElementById('order-success').style.display = 'block';
  document.getElementById('checkout-form-content').style.display = 'none';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
  renderProducts();
  setupFilters();
  setupAuthTabs();
  setupPaymentMethods();
  updateCheckoutSummary();

  // Default page
  navigateTo('home');

  // Nav links
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });

  // Cart toggle
  document.querySelectorAll('[data-open-cart]').forEach(el => {
    el.addEventListener('click', openCart);
  });
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCart();
  });

  // Checkout go-to
  document.querySelectorAll('[data-checkout]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      closeCart();
      navigateTo('checkout');
    });
  });
});
