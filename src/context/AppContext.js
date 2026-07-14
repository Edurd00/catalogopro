import { injectTheme } from '../config/theme.js';
import { supabase } from '../config/supabase.js';

class AppState {
  constructor() {
    this.state = {
      tenant: null,
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      listeners: []
    };
  }

  subscribe(listener) {
    this.state.listeners.push(listener);
    return () => {
      this.state.listeners = this.state.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.state.listeners.forEach(listener => listener(this.getState()));
  }

  getState() {
    return { tenant: this.state.tenant, cart: this.state.cart };
  }

  /**
   * Multi-tenant init.
   * Priority:
   *  1. ?store=slug  → load by slug (public storefront)
   *  2. ?page=admin  → load by authenticated user's owner_id
   *  3. No param     → portal mode (no tenant injected)
   */
  async initTenant() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const storeSlug = urlParams.get('store');
      const isAdmin = urlParams.get('page') === 'admin';

      let query = supabase.from('tenant_settings').select('*');

      if (storeSlug) {
        // Public storefront: load by slug
        query = query.eq('slug', storeSlug).maybeSingle();
      } else if (isAdmin) {
        // Admin panel: load by current user's owner_id
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@catalogopro.com';
          if (session.user.email === SUPER_ADMIN_EMAIL) {
            // Super admin: no tenant filter; resolved in Dashboard
            return;
          }
          query = query.eq('owner_id', session.user.id).maybeSingle();
        } else {
          return;
        }
      } else {
        // Portal mode – no tenant
        return;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar tenant:', error.message);
        return;
      }

      if (data) {
        this.state.tenant = data;
        injectTheme(data.primary_color, data.secondary_color);
        this.notify();
      }
    } catch (err) {
      console.error('Erro ao inicializar tenant:', err.message);
    }
  }

  setTenant(tenantData) {
    this.state.tenant = tenantData;
    if (tenantData) injectTheme(tenantData.primary_color, tenantData.secondary_color);
    // Reset cart when switching tenants
    this.state.cart = [];
    localStorage.removeItem('cart');
    this.notify();
  }

  addToCart(product, quantity = 1, selectedAttributes = {}) {
    const cartItemId = `${product.id}-${btoa(JSON.stringify(selectedAttributes))}`;
    const existingItemIndex = this.state.cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingItemIndex > -1) {
      this.state.cart[existingItemIndex].quantity += quantity;
    } else {
      this.state.cart.push({ cartItemId, product, quantity, selectedAttributes });
    }
    this.saveCart();
  }

  removeFromCart(cartItemId) {
    this.state.cart = this.state.cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
  }

  clearCart() {
    this.state.cart = [];
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.state.cart));
    this.notify();
  }
}

export const appContext = new AppState();