import { injectTheme } from '../config/theme.js';
import { dbService } from '../services/dbService.js';

class AppState {
  constructor() {
    this.state = {
      storeSettings: null,
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
    return {
      storeSettings: this.state.storeSettings,
      tenant: this.state.storeSettings, // Backward compatibility alias
      cart: this.state.cart
    };
  }

  /**
   * Initializes store configuration from Neon PostgreSQL store_settings
   */
  async initStoreSettings() {
    try {
      const settings = await dbService.getStoreSettings();
      if (settings) {
        this.state.storeSettings = settings;
        if (settings.primary_color && settings.secondary_color) {
          injectTheme(settings.primary_color, settings.secondary_color);
        }
        this.notify();
      }
    } catch (err) {
      console.warn('Erro ao carregar configurações da loja:', err.message);
    }
  }

  // Alias for backward compatibility
  async initTenant() {
    return await this.initStoreSettings();
  }

  setStoreSettings(settingsData) {
    this.state.storeSettings = settingsData;
    if (settingsData?.primary_color) {
      injectTheme(settingsData.primary_color, settingsData.secondary_color || '#1e3a8a');
    }
    this.notify();
  }

  setTenant(settingsData) {
    this.setStoreSettings(settingsData);
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
