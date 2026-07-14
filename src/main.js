import './styles/index.css';
import { appContext } from './context/AppContext.js';
import { Home } from './pages/store/Home.js';
import { Portal } from './pages/saas/Portal.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { CheckoutModal } from './components/cart/CheckoutModal.js';
import { orderService } from './services/orderService.js';
import { Dashboard } from './pages/admin/Dashboard.js';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard.js';
import { Login } from './pages/auth/Login.js';
import { supabase } from './config/supabase.js';

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@catalogopro.com';

async function mountApp() {
  // Apply saved theme immediately
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }

  const appDiv = document.getElementById('app');
  if (!appDiv) return;

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get('page');
  const storeSlug = urlParams.get('store');

  // ─── LOGIN PAGE ──────────────────────────────────────────────────────────────
  if (currentPage === 'login') {
    appDiv.innerHTML = Login.render();
    Login.bindEvents(appDiv);
    return;
  }

  // ─── ADMIN PAGE ──────────────────────────────────────────────────────────────
  if (currentPage === 'admin') {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.search = '?page=login';
      return;
    }

    const isSuperAdmin = session.user.email === SUPER_ADMIN_EMAIL;

    if (isSuperAdmin) {
      // Super Admin Dashboard
      async function renderSuperAdmin() {
        appDiv.innerHTML = await SuperAdminDashboard.render();
        SuperAdminDashboard.bindEvents(appDiv, () => renderSuperAdmin());
      }
      await renderSuperAdmin();
    } else {
      // Merchant Dashboard — load their tenant first
      await appContext.initTenant();
      async function renderAdmin() {
        appDiv.innerHTML = await Dashboard.render();
        Dashboard.bindEvents(appDiv, () => renderAdmin());
      }
      await renderAdmin();
    }
    return;
  }

  // ─── STOREFRONT (?store=slug) ─────────────────────────────────────────────────
  if (storeSlug) {
    await appContext.initTenant();
    await mountStorefront(appDiv);
    return;
  }

  // ─── SAAS PORTAL (no params) ──────────────────────────────────────────────────
  appDiv.innerHTML = await Portal.render();
  Portal.bindEvents(appDiv);
}

async function mountStorefront(appDiv) {
  const tenantData = appContext.getState().tenant;

  const brandHeaderHTML = tenantData?.logo_url
    ? `<img src="${tenantData.logo_url}" class="h-10 w-auto object-contain" alt="${tenantData.store_name || 'Logo'}" />`
    : `<span class="text-xl font-black text-lojaPrimaria uppercase tracking-tighter">${tenantData?.store_name || 'VITRINE'}</span>`;

  appDiv.innerHTML = `
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <a href="/?store=${new URLSearchParams(window.location.search).get('store')}">${brandHeaderHTML}</a>
          <a href="/" class="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-lojaPrimaria transition-colors">
            ← Todas as Lojas
          </a>
        </div>
        <button id="floating-cart-trigger" class="bg-lojaPrimaria text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-lojaPrimaria/20 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <span id="cart-counter-slot">0</span>
        </button>
      </div>
    </header>
    <div id="home-view-container"></div>
    <div id="cart-drawer-container"></div>
    <div id="checkout-modal-container"></div>
    <div id="product-modal-container"></div>
  `;

  const homeContainer = document.getElementById('home-view-container');
  const cartContainer = document.getElementById('cart-drawer-container');
  const checkoutContainer = document.getElementById('checkout-modal-container');
  const cartCounterSlot = document.getElementById('cart-counter-slot');

  async function updateUI() {
    const { cart } = appContext.getState();
    const currentCount = parseInt(cartCounterSlot?.innerText || '0');
    const newCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    if (cartCounterSlot) {
      cartCounterSlot.innerText = newCount;
      if (newCount > currentCount) {
        const trigger = document.getElementById('floating-cart-trigger');
        trigger?.classList.add('scale-110');
        setTimeout(() => trigger?.classList.remove('scale-110'), 300);
      }
    }

    cartContainer.innerHTML = CartDrawer.render();
    CartDrawer.bindEvents(cartContainer, () => CheckoutModal.open());
    checkoutContainer.innerHTML = CheckoutModal.render();
    CheckoutModal.bindEvents(checkoutContainer, async (formData) => {
      const { tenant } = appContext.getState();
      const res = await orderService.createOrder({ ...formData, cartItems: cart, tenant });
      if (res.success) { CheckoutModal.close(); appContext.clearCart(); }
    });
  }

  homeContainer.innerHTML = await Home.render();
  Home.bindEvents(homeContainer);

  window.addEventListener('global:add-to-cart', async (e) => {
    const { id, quantity, size, color, option1, option2 } = e.detail;
    const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
    if (product) {
      appContext.addToCart(product, quantity || 1, { size, color, option1, option2 });
      CartDrawer.open();
    }
  });

  document.getElementById('floating-cart-trigger').onclick = () => CartDrawer.open();
  appContext.subscribe(() => updateUI());
  await updateUI();
}

mountApp();