import { appContext } from '../../context/AppContext.js';
import { Toast } from '../Toast.js';

export const ProductDetailsModal = {
  render(product) {
    const hasDiscount = product.promo_price && Number(product.promo_price) < Number(product.price);
    const finalPrice = hasDiscount ? product.promo_price : product.price;
    const formatCurrency = (value) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const images = Array.isArray(product.image_urls) && product.image_urls.length > 0
      ? product.image_urls
      : [product.image_url].filter(u => u);

    return `
      <div id="product-modal-root" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>

        <div class="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 max-h-[85vh] h-auto border border-gray-100 dark:border-gray-800">

          <!-- Lado Esquerdo: Mídia (Controlado) -->
          <div class="w-full md:w-1/2 h-72 md:h-full bg-gray-100 dark:bg-gray-800 relative flex-shrink-0">
            <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-full" id="modal-carousel">
              ${images.length > 0 ? images.map(url => `
                <div class="w-full h-full flex-shrink-0 snap-center">
                  <img src="${url}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000';" />
                </div>
              `).join('') : `
                <div class="w-full h-full flex-shrink-0 snap-center">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000" class="w-full h-full object-cover" />
                </div>
              `}
            </div>

            <!-- Botão Fechar (Mobile) -->
            <button id="close-product-modal-mobile" class="md:hidden absolute top-4 right-4 z-30 bg-black/20 backdrop-blur-md p-2 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            ${images.length > 1 ? `
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                ${images.map((_, i) => `<div class="w-1.5 h-1.5 rounded-full bg-white/40"></div>`).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Lado Direito: Informações (ROLÁVEL) -->
          <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-white dark:bg-gray-900 overflow-y-auto pr-2 scrollbar-thin">
            <!-- Botão Fechar (Desktop) -->
            <button id="close-product-modal-desktop" class="hidden md:flex absolute top-6 right-6 z-30 bg-gray-50 dark:bg-gray-800 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div class="space-y-8 pb-4">
              <div>
                <span class="text-[10px] font-black text-lojaPrimaria uppercase tracking-[0.2em] opacity-80">${product.categories?.name || 'Catálogo'}</span>
                <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mt-1">${product.title}</h2>
                <div class="flex items-center gap-4 mt-3">
                  <span class="text-3xl font-black text-gray-900 dark:text-white">${formatCurrency(finalPrice)}</span>
                  ${hasDiscount ? `<span class="text-base text-gray-400 line-through font-bold">${formatCurrency(product.price)}</span>` : ''}
                </div>
              </div>

              <div class="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Descrição</span>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${product.description || 'Produto de alta qualidade selecionado para você.'}</p>
              </div>

              <!-- Escolha Dinâmica 1 (ex-Cores) -->
              ${product.colors && product.colors.length > 0 ? `
                <div class="space-y-4">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">${product.option_title_1 || 'Selecione a Opção'}</span>
                  <div class="flex flex-wrap gap-3">
                    ${product.colors.map(color => `
                      <button class="js-color-btn min-w-[3rem] px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-xs font-black text-gray-600 dark:text-gray-400 transition-all hover:border-lojaPrimaria active:scale-95" data-color="${color}">${color}</button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Escolha Dinâmica 2 (ex-Atributos) -->
              ${product.attributes && product.attributes.length > 0 ? `
                <div class="space-y-4">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">${product.option_title_2 || 'Tamanho'}</span>
                  <div class="flex flex-wrap gap-2">
                    ${product.attributes.map(attr => `
                      <button class="js-attr-btn px-5 py-2.5 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-xs font-black text-gray-600 dark:text-gray-400 transition-all hover:border-lojaPrimaria active:scale-95" data-attr="${attr}">${attr}</button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                 <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Quantidade</span>
                 <div class="flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-1 border border-gray-100 dark:border-gray-700 w-36">
                  <button id="qty-minus" class="w-12 h-12 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-500 font-bold">-</button>
                  <input type="number" id="qty-input" value="1" min="1" class="w-full text-center font-black text-gray-900 dark:text-white bg-transparent focus:outline-none text-base" readonly />
                  <button id="qty-plus" class="w-12 h-12 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-500 font-bold">+</button>
                </div>
              </div>
            </div>

            <!-- Botões de Ação Fixos no pé da coluna -->
            <div class="mt-auto pt-6 flex flex-col gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
              <button
                id="modal-add-to-cart"
                ${appContext.getState().tenant?.is_open === false ? 'disabled' : ''}
                class="w-full ${appContext.getState().tenant?.is_open === false ? 'bg-gray-400 cursor-not-allowed' : 'bg-lojaPrimaria shadow-lojaPrimaria/20 hover:scale-[1.02] active:scale-[0.98]'} text-white font-black py-5 rounded-2xl shadow-xl transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                ${appContext.getState().tenant?.is_open === false ? 'Loja Fechada' : 'Adicionar ao Carrinho'}
              </button>
              <button
                id="buy-now-whatsapp"
                ${appContext.getState().tenant?.is_open === false ? 'disabled' : ''}
                class="w-full ${appContext.getState().tenant?.is_open === false ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:opacity-90'} text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-opacity"
              >
                Finalizar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, product, onAdd) {
    const root = container.querySelector('#product-modal-root');
    const closeBtnMobile = container.querySelector('#close-product-modal-mobile');
    const closeBtnDesktop = container.querySelector('#close-product-modal-desktop');
    const backdrop = container.querySelector('#modal-backdrop');
    const qtyInput = container.querySelector('#qty-input');
    const qtyPlus = container.querySelector('#qty-plus');
    const qtyMinus = container.querySelector('#qty-minus');
    const addBtn = container.querySelector('#modal-add-to-cart');
    const buyNowBtn = container.querySelector('#buy-now-whatsapp');

    let selectedAttr = null;
    let selectedColor = null;

    const close = () => {
      root.classList.add('animate-out', 'fade-out', 'zoom-out');
      setTimeout(() => root.remove(), 300);
    };

    if (closeBtnMobile) closeBtnMobile.onclick = close;
    if (closeBtnDesktop) closeBtnDesktop.onclick = close;
    backdrop.onclick = (e) => { if(e.target === backdrop) close(); };

    qtyPlus.onclick = () => qtyInput.value = parseInt(qtyInput.value) + 1;
    qtyMinus.onclick = () => {
      if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    };

    container.querySelectorAll('.js-attr-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.js-attr-btn').forEach(b => {
            b.classList.remove('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
            b.classList.add('border-gray-100', 'dark:border-gray-800');
        });
        btn.classList.remove('border-gray-100', 'dark:border-gray-800');
        btn.classList.add('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
        selectedAttr = btn.getAttribute('data-attr');
      };
    });

    container.querySelectorAll('.js-color-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.js-color-btn').forEach(b => {
            b.classList.remove('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
            b.classList.add('border-gray-100', 'dark:border-gray-800');
        });
        btn.classList.remove('border-gray-100', 'dark:border-gray-800');
        btn.classList.add('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
        selectedColor = btn.getAttribute('data-color');
      };
    });

    addBtn.onclick = () => {
      const opt1Title = product.option_title_1 || 'Opção';
      const opt2Title = product.option_title_2 || 'Opção';

      if (product.attributes?.length > 0 && !selectedAttr) {
        Toast.show(`Selecione ${opt2Title} para continuar`, "error");
        return;
      }
      if (product.colors?.length > 0 && !selectedColor) {
        Toast.show(`Selecione ${opt1Title} para continuar`, "error");
        return;
      }

      onAdd({
        quantity: parseInt(qtyInput.value),
        size: selectedAttr,
        color: selectedColor,
        variationTitle1: opt1Title,
        variationTitle2: opt2Title
      });
      Toast.show("Produto adicionado ao carrinho!");
      close();
    };

    if (buyNowBtn) {
      buyNowBtn.onclick = () => {
        const tenant = appContext.getState().tenant;
        const opt1Title = product.option_title_1 || 'Opção';
        const opt2Title = product.option_title_2 || 'Opção';

        const msg = `Olá! Tenho interesse no produto: ${product.title}\n${selectedAttr ? opt2Title + ': ' + selectedAttr : ''} ${selectedColor ? opt1Title + ': ' + selectedColor : ''}\nQtd: ${qtyInput.value}`;
        window.open(`https://wa.me/${tenant?.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      };
    }
  }
};
