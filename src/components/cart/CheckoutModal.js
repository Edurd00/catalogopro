import { appContext } from '../../context/AppContext.js';
import { supabase } from '../../config/supabase.js';

export const CheckoutModal = {
  neighborhoods: [],

  async render() {
    const cartItems = appContext.getState().cart || [];
    const tenant = appContext.getState().tenant || {};

    // Fetch neighborhoods if not already loaded
    if (this.neighborhoods.length === 0 && tenant.id) {
      const { data } = await supabase
        .from('delivery_fees')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('neighborhood', { ascending: true });
      this.neighborhoods = data || [];
    }

    const formatCurrency = (value) => 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Initial subtotal calculation
    const subtotal = cartItems.reduce((sum, item) => {
      const prod = item.product || {};
      const price = (prod.promo_price && prod.promo_price < prod.price) 
        ? Number(prod.promo_price) 
        : Number(prod.price || 0);
      return sum + (price * (item.quantity || 1));
    }, 0);

    return `
      <div id="checkout-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
          
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Finalizar Pedido</h3>
            <button id="close-checkout" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Toggle Entrega vs Retirada -->
          <div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <button id="toggle-delivery" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm">
              🚚 Entrega
            </button>
            <button id="toggle-pickup" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-gray-400 hover:text-gray-600">
              🛍️ Retirada
            </button>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-3 border border-gray-100 dark:border-gray-800 text-sm">
            <div class="flex justify-between text-gray-500 dark:text-gray-400 font-medium">
              <span>Subtotal:</span>
              <span class="text-gray-900 dark:text-white">${formatCurrency(subtotal)}</span>
            </div>
            <div id="delivery-fee-row" class="flex justify-between text-gray-500 dark:text-gray-400 font-medium">
              <span>Taxa de Entrega:</span>
              <span id="display-delivery-fee" class="text-gray-900 dark:text-white">${formatCurrency(0)}</span>
            </div>
            <div class="flex justify-between text-lg font-black text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
              <span>Total:</span>
              <span id="display-total">${formatCurrency(subtotal)}</span>
            </div>
          </div>
          
          <form id="checkout-form" class="space-y-4">
            <input type="hidden" id="order-type" value="delivery" />
            <input type="hidden" id="delivery-fee-hidden" value="0" />

            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Seu Nome</label>
                <input type="text" id="form-name" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-lojaPrimaria text-gray-900 dark:text-white placeholder-gray-400" placeholder="Como podemos te chamar?" />
              </div>
              <div class="col-span-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">WhatsApp</label>
                <input type="tel" id="form-phone" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-lojaPrimaria text-gray-900 dark:text-white placeholder-gray-400" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div id="delivery-fields" class="space-y-4">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Bairro para Entrega</label>
                <select id="form-neighborhood" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-lojaPrimaria text-gray-900 dark:text-white">
                  <option value="">Selecione seu bairro...</option>
                  ${this.neighborhoods.map(n => `
                    <option value="${n.neighborhood}" data-fee="${n.fee_value}">${n.neighborhood} (${formatCurrency(n.fee_value)})</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Endereço Completo</label>
                <textarea id="form-address" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 text-sm h-20 focus:ring-2 focus:ring-lojaPrimaria text-gray-900 dark:text-white placeholder-gray-400" placeholder="Rua, número, complemento..."></textarea>
              </div>
            </div>

            <div class="pt-2">
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Forma de Pagamento</label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" class="js-pay-method py-3 border-2 border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-tight text-gray-500 transition-all hover:border-lojaPrimaria selected" data-value="Pix">Pix</button>
                <button type="button" class="js-pay-method py-3 border-2 border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-tight text-gray-500 transition-all hover:border-lojaPrimaria" data-value="Cartão">Cartão</button>
                <button type="button" class="js-pay-method py-3 border-2 border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-tight text-gray-500 transition-all hover:border-lojaPrimaria" data-value="Dinheiro">Dinheiro</button>
              </div>
              <input type="hidden" id="form-payment" value="Pix" />
            </div>

            <div id="change-field" class="hidden animate-in fade-in slide-in-from-top-2">
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Troco para quanto?</label>
              <input type="text" id="form-change" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-lojaPrimaria text-gray-900 dark:text-white" placeholder="Ex: 100,00" />
            </div>

            <button type="submit" class="w-full bg-lojaPrimaria text-white font-black py-5 rounded-2xl shadow-xl shadow-lojaPrimaria/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-[0.2em] mt-4">
              Enviar Pedido para WhatsApp
            </button>
          </form>
        </div>
      </div>
    `;
  },
  
  open() { 
    const container = document.getElementById('checkout-modal-container');
    if (container) {
      this.render().then(html => {
        container.innerHTML = html;
        this.bindEvents(container, window.currentCheckoutCallback || (() => {}));
        document.getElementById('checkout-modal')?.classList.remove('hidden');
      });
    }
  },
  
  close() {
    const modal = document.getElementById('checkout-modal');
    modal?.classList.add('animate-out', 'fade-out', 'zoom-out');
    setTimeout(() => modal?.classList.add('hidden'), 300);
  },

  bindEvents(container, onComplete) {
    const closeBtn = container.querySelector('#close-checkout');
    const form = container.querySelector('#checkout-form');
    const toggleDelivery = container.querySelector('#toggle-delivery');
    const togglePickup = container.querySelector('#toggle-pickup');
    const deliveryFields = container.querySelector('#delivery-fields');
    const orderTypeInput = container.querySelector('#order-type');
    const neighborhoodSelect = container.querySelector('#form-neighborhood');
    const displayFee = container.querySelector('#display-delivery-fee');
    const displayTotal = container.querySelector('#display-total');
    const feeHidden = container.querySelector('#delivery-fee-hidden');
    const payButtons = container.querySelectorAll('.js-pay-method');
    const paymentInput = container.querySelector('#form-payment');
    const changeField = container.querySelector('#change-field');

    const subtotal = appContext.getState().cart.reduce((sum, item) => {
      const prod = item.product || {};
      const price = (prod.promo_price && prod.promo_price < prod.price) ? Number(prod.promo_price) : Number(prod.price || 0);
      return sum + (price * (item.quantity || 1));
    }, 0);

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const updateTotals = () => {
      const type = orderTypeInput.value;
      let fee = 0;
      if (type === 'delivery') {
        const selected = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
        fee = parseFloat(selected?.dataset.fee || 0);
      }
      displayFee.innerText = formatCurrency(fee);
      displayTotal.innerText = formatCurrency(subtotal + fee);
      feeHidden.value = fee;
    };

    if (closeBtn) closeBtn.onclick = () => this.close();

    toggleDelivery.onclick = () => {
      orderTypeInput.value = 'delivery';
      deliveryFields.classList.remove('hidden');
      toggleDelivery.className = 'flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm';
      togglePickup.className = 'flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-gray-400 hover:text-gray-600';
      updateTotals();
    };

    togglePickup.onclick = () => {
      orderTypeInput.value = 'pickup';
      deliveryFields.classList.add('hidden');
      togglePickup.className = 'flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm';
      toggleDelivery.className = 'flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-gray-400 hover:text-gray-600';
      updateTotals();
    };

    neighborhoodSelect.onchange = updateTotals;

    payButtons.forEach(btn => {
      btn.onclick = () => {
        payButtons.forEach(b => b.classList.remove('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria'));
        btn.classList.add('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
        paymentInput.value = btn.dataset.value;
        if (btn.dataset.value === 'Dinheiro') {
          changeField.classList.remove('hidden');
        } else {
          changeField.classList.add('hidden');
        }
      };
    });

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const data = {
          customerName: container.querySelector('#form-name').value,
          customerPhone: container.querySelector('#form-phone').value,
          deliveryAddress: orderTypeInput.value === 'delivery' ? container.querySelector('#form-address').value : 'RETIRADA NO BALCÃO',
          neighborhood: orderTypeInput.value === 'delivery' ? neighborhoodSelect.value : null,
          deliveryFee: parseFloat(feeHidden.value),
          orderType: orderTypeInput.value,
          paymentMethod: paymentInput.value,
          changeFor: paymentInput.value === 'Dinheiro' ? container.querySelector('#form-change').value : null
        };
        onComplete(data);
      };
    }
  }
};
