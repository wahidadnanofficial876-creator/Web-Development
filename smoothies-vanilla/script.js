// Smoothies Soda — vanilla JS
const products = [
  { id: 'p1', name: 'Strawberry Bliss', flavor: 'Strawberry',  price: 4.50, image: 'assets/soda-strawberry.jpg', color: '#ff8fb8', glow: '#ffc4d8', tag: 'Best Seller' },
  { id: 'p2', name: 'Lime Sparkle',     flavor: 'Lime',        price: 4.50, image: 'assets/soda-lime.jpg',       color: '#7ed9a4', glow: '#b8ecc9', tag: 'New' },
  { id: 'p3', name: 'Blueberry Dream',  flavor: 'Blueberry',   price: 4.75, image: 'assets/soda-blueberry.jpg',  color: '#7ab4f0', glow: '#b8d6f5', tag: 'Limited' },
  { id: 'p4', name: 'Peach Sunset',     flavor: 'Peach',       price: 4.50, image: 'assets/soda-peach.jpg',      color: '#ffc46e', glow: '#ffdfae', tag: 'Bundle' },
];

/* ---------------- Hero auto-rotating carousel ---------------- */
const heroImage = document.getElementById('hero-image');
const heroDots  = document.getElementById('hero-dots');
const stageGlow = document.querySelector('.stage-glow');
let heroIndex = 0;
let heroTimer;

function renderDots() {
  heroDots.innerHTML = '';
  products.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = i === heroIndex ? 'active' : '';
    b.setAttribute('aria-label', `Show flavor ${i + 1}`);
    b.addEventListener('click', () => setHero(i, true));
    heroDots.appendChild(b);
  });
}
function setHero(i, manual) {
  heroIndex = (i + products.length) % products.length;
  const p = products[heroIndex];
  heroImage.classList.add('fade');
  setTimeout(() => {
    heroImage.src = p.image;
    heroImage.alt = p.name;
    heroImage.classList.remove('fade');
  }, 300);
  stageGlow.style.background = `radial-gradient(circle, ${p.glow}, transparent 70%)`;
  document.documentElement.style.setProperty('--primary', p.color);
  renderDots();
  if (manual) restartHero();
}
function restartHero() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => setHero(heroIndex + 1), 5000);
}
renderDots();
restartHero();

/* 3D tilt on hero stage */
const stage = document.getElementById('hero-stage');
const bottle = document.getElementById('bottle-wrap');
stage.addEventListener('mousemove', (e) => {
  const r = stage.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  bottle.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`;
});
stage.addEventListener('mouseleave', () => { bottle.style.transform = ''; });

/* ---------------- Product grid ---------------- */
const grid = document.getElementById('product-grid');
products.forEach(p => {
  const card = document.createElement('article');
  card.className = 'product-card reveal';
  card.style.setProperty('--card-glow', p.glow);
  card.innerHTML = `
    <span class="tag" style="color:${p.color}">${p.tag}</span>
    <img src="${p.image}" alt="${p.name}" />
    <h3>${p.name}</h3>
    <div class="flavor">${p.flavor} • Sparkling</div>
    <div class="row">
      <span class="price">$${p.price.toFixed(2)}</span>
      <button class="add-btn" data-id="${p.id}">Add +</button>
    </div>
  `;
  grid.appendChild(card);
});

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;
  addToCart(btn.dataset.id);
  // splash
  btn.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
    { duration: 400, easing: 'cubic-bezier(0.68,-0.55,0.265,1.55)' }
  );
});

/* ---------------- Flavor Universe orbit ---------------- */
const orbit = document.getElementById('orbit');
const orbitCenter = document.getElementById('orbit-center');
products.forEach((p, i) => {
  const angle = (i / products.length) * Math.PI * 2 - Math.PI / 2;
  const r = 42; // % radius
  const cx = 50 + Math.cos(angle) * r;
  const cy = 50 + Math.sin(angle) * r;
  const orb = document.createElement('button');
  orb.className = 'orb';
  orb.textContent = p.flavor;
  orb.style.left = `calc(${cx}% - 40px)`;
  orb.style.top  = `calc(${cy}% - 40px)`;
  orb.style.background = `radial-gradient(circle at 30% 30%, ${p.glow}, ${p.color})`;
  orb.style.animationDelay = `${i * 0.4}s`;
  orb.addEventListener('click', () => {
    orbitCenter.textContent = p.flavor;
    orbitCenter.style.background = `linear-gradient(135deg, ${p.color}, ${p.glow})`;
  });
  orbit.appendChild(orb);
});

/* ---------------- Cart ---------------- */
const cart = new Map();
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const drawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('drawer-overlay');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const cur = cart.get(id);
  cart.set(id, { product: p, qty: cur ? cur.qty + 1 : 1 });
  renderCart();
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');
}
function changeQty(id, delta) {
  const cur = cart.get(id); if (!cur) return;
  const next = cur.qty + delta;
  if (next <= 0) cart.delete(id); else cart.set(id, { ...cur, qty: next });
  renderCart();
}
function renderCart() {
  let total = 0, count = 0;
  cartItems.innerHTML = '';
  if (cart.size === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Your bag is empty.<br/>Time to add some fizz ✨</div>';
  } else {
    cart.forEach(({ product, qty }) => {
      total += product.price * qty;
      count += qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="info">
          <h4>${product.name}</h4>
          <span>$${product.price.toFixed(2)}</span>
          <div class="qty">
            <button data-act="dec" data-id="${product.id}">−</button>
            <span>${qty}</span>
            <button data-act="inc" data-id="${product.id}">+</button>
          </div>
        </div>
        <strong>$${(product.price * qty).toFixed(2)}</strong>
      `;
      cartItems.appendChild(row);
    });
  }
  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = count;
}
cartItems.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  changeQty(b.dataset.id, b.dataset.act === 'inc' ? 1 : -1);
});
function openDrawer() { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
cartBtn.addEventListener('click', openDrawer);
closeCart.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
document.getElementById('mobile-cart').addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
renderCart();

/* ---------------- Search autocomplete ---------------- */
const search = document.getElementById('search');
const sug = document.getElementById('search-suggestions');
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  if (!q) { sug.hidden = true; return; }
  const matches = products.filter(p => p.name.toLowerCase().includes(q) || p.flavor.toLowerCase().includes(q));
  if (!matches.length) { sug.hidden = true; return; }
  sug.innerHTML = matches.map(p => `<li data-id="${p.id}">${p.name} — <em>${p.flavor}</em></li>`).join('');
  sug.hidden = false;
});
sug.addEventListener('click', (e) => {
  const li = e.target.closest('li'); if (!li) return;
  const idx = products.findIndex(p => p.id === li.dataset.id);
  setHero(idx, true);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  search.value = ''; sug.hidden = true;
});
document.addEventListener('click', (e) => { if (!e.target.closest('.search-wrap')) sug.hidden = true; });

/* ---------------- Hamburger ---------------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.addEventListener('click', (e) => { if (e.target.tagName === 'A') mobileMenu.classList.remove('open'); });

/* ---------------- Reveal on scroll ---------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .section, .testimonial, .cta-inner').forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
  io.observe(el);
});

/* ---------------- Shop now scroll ---------------- */
document.getElementById('shop-now').addEventListener('click', () => {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});
