import './styles/index.css';
import { appContext } from './context/AppContext.js';
import { Home } from './pages/store/Home.js';
import { Portal } from './pages/saas/Portal.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { CheckoutModal } from './components/cart/CheckoutModal.js';
import { orderService } from './services/orderService.js';
import { productService } from './services/productService.js';
import { Dashboard } from './pages/admin/Dashboard.js';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard.js';
import { Login } from './pages/auth/Login.js';
import { supabase } from './config/supabase.js';

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@catalogopro.com';

async function mountApp() {
  // Inicializa tema salvo
  if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }

  const appDiv = document.getElementById('app');
  if (!appDiv) return;

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get('page');

  // ─── LOGIN PAGE ──────────────────────────────────────────────────────────────
  if (currentPage === 'login') {
    appDiv.innerHTML = Login.render();
    Login.bindEvents(appDiv);
    return;
  }

  // ─── ADMIN PAGE ──────────────────────────────────────────────────────────────
  if (currentPage === 'admin') {
    let session = null;
    try {
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const authRes = await supabase.auth.getSession();
        session = authRes.data?.session;
      }
    } catch (e) {
      console.warn('Supabase Auth indisponível:', e.message);
    }

    let localAuth = null;
    try {
      const raw = localStorage.getItem('admin_auth');
      if (raw) localAuth = JSON.parse(raw);
    } catch (e) {}

    // Permite login via Supabase ou via sessão local de portfólio
    if (!session && !localAuth?.authenticated) {
      window.location.search = '?page=login';
      return;
    }

    const isSuperAdmin = session?.user?.email === SUPER_ADMIN_EMAIL || localAuth?.role === 'superadmin';

    if (isSuperAdmin) {
      async function renderSuperAdmin() {
        appDiv.innerHTML = await SuperAdminDashboard.render();
        SuperAdminDashboard.bindEvents(appDiv, () => renderSuperAdmin());
      }
      await renderSuperAdmin();
    } else {
      await appContext.initTenant();
      async function renderAdmin() {
        appDiv.innerHTML = await Dashboard.render();
        Dashboard.bindEvents(appDiv, () => renderAdmin());
      }
      await renderAdmin();
    }
    return;
  }

  // ─── SAAS PORTAL OPCIONAL (?page=portal) ─────────────────────────────────────
  if (currentPage === 'portal') {
    appDiv.innerHTML = await Portal.render();
    Portal.bindEvents(appDiv);
    return;
  }

  // ─── VITRINE / CATÁLOGO PRINCIPAL (Padrão para Portfólio) ───────────────────
  await appContext.initTenant();
  await mountStorefront(appDiv);
}

async function mountStorefront(appDiv) {
  const tenantData = appContext.getState().tenant || {
    store_name: 'Catálogo Pro',
    logo_url: null,
    primary_color: '#3b82f6'
  };

  const brandHeaderHTML = tenantData?.logo_url
    ? `<img src="${tenantData.logo_url}" class="h-9 w-auto object-contain" alt="${tenantData.store_name || 'Logo'}" />`
    : `
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-xl bg-lojaPrimaria text-white flex items-center justify-center font-black text-sm shadow-md shadow-lojaPrimaria/30">CP</span>
        <span class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">${tenantData?.store_name || 'Catálogo Pro'}</span>
      </div>
    `;

  appDiv.innerHTML = `
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <a href="/" class="hover:opacity-90 transition">${brandHeaderHTML}</a>
          <span class="hidden md:inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Vitrine Online
          </span>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Link Painel Admin -->
          <a href="/?page=admin" class="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-lojaPrimaria dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Painel Admin
          </a>

          <!-- Alternador de Dark Mode -->
          <button id="theme-toggle-btn" class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition" title="Alternar Modo Escuro">
            <svg id="theme-icon-sun" class="w-5 h-5 hidden dark:block text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg id="theme-icon-moon" class="w-5 h-5 block dark:hidden text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Botão da Sacola / Carrinho -->
          <button id="floating-cart-trigger" class="bg-lojaPrimaria text-white px-4 md:px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-lojaPrimaria/25 transition-all active:scale-95 hover:opacity-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="hidden sm:inline">Sacola</span>
            <span id="cart-counter-slot" class="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black">0</span>
          </button>
        </div>
      </div>
    </header>

    <div id="home-view-container"></div>
    <div id="cart-drawer-container"></div>
    <div id="checkout-modal-container"></div>
    <div id="product-modal-container"></div>
  `;

  // Listener para alternar Dark Mode
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.onclick = () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
  }

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
      if (res.success) { 
        CheckoutModal.close(); 
        appContext.clearCart(); 
      }
    });
  }

  homeContainer.innerHTML = await Home.render();
  Home.bindEvents(homeContainer);

  // Escuta evento global de adicionar ao carrinho
  window.addEventListener('global:add-to-cart', async (e) => {
    const { id, quantity, size, color, option1, option2 } = e.detail;
    const product = await productService.getById(id);
    if (product) {
      appContext.addToCart(product, quantity || 1, { size, color, option1, option2 });
      CartDrawer.open();
    }
  });

  const cartTrigger = document.getElementById('floating-cart-trigger');
  if (cartTrigger) {
    cartTrigger.onclick = () => CartDrawer.open();
  }

  appContext.subscribe(() => updateUI());
  await updateUI();
}

mountApp();