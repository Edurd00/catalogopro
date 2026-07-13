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

        <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">

          <!-- Topo: Imagem Premium -->
          <div class="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 flex-shrink-0">
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

            <!-- Botão Fechar Flutuante -->
            <button id="close-product-modal" class="absolute top-4 right-4 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full transition-all text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            ${images.length > 1 ? `
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                ${images.map((_, i) => `<div class="w-1.5 h-1.5 rounded-full bg-white/40"></div>`).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Bloco de Conteúdo -->
          <div class="p-6 space-y-6 overflow-y-auto scrollbar-thin">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-lojaPrimaria uppercase tracking-[0.2em] opacity-80">${product.categories?.name || 'Geral'}</span>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">${product.title}</h2>
              <div class="flex items-center gap-3 mt-2">
                <span class="text-2xl font-black text-gray-900 dark:text-white">${formatCurrency(finalPrice)}</span>
                ${hasDiscount ? `<span class="text-sm text-gray-400 line-through font-bold">${formatCurrency(product.price)}</span>` : ''}
              </div>
            </div>

            <div class="space-y-2 border-t border-gray-50 dark:border-gray-800 pt-4">
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Descrição</span>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${product.description || 'Produto de alta qualidade para sua rotina.'}</p>
            </div>

            <!-- Grade de Escolhas -->
            <div class="space-y-6">
              ${product.colors && product.colors.length > 0 ? `
                <div class="space-y-3">
                  <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Selecione a Cor</span>
                  <div class="flex flex-wrap gap-2">
                    ${product.colors.map(color => `
                      <button class="js-color-btn px-4 py-2 border-2 border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 transition-all hover:border-lojaPrimaria active:scale-95" data-color="${color}">${color}</button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${product.attributes && product.attributes.length > 0 ? `
                <div class="space-y-3">
                  <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Selecione o Tamanho</span>
                  <div class="flex flex-wrap gap-2">
                    ${product.attributes.map(attr => `
                      <button class="js-attr-btn px-4 py-2 border-2 border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 transition-all hover:border-lojaPrimaria active:scale-95" data-attr="${attr}">${attr}</button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Quantidade -->
            <div class="space-y-3 border-t border-gray-50 dark:border-gray-800 pt-4">
               <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Quantidade</span>
               <div class="flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-1 border border-gray-100 dark:border-gray-700 w-32">
                <button id="qty-minus" class="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-500 font-bold">-</button>
                <input type="number" id="qty-input" value="1" min="1" class="w-full text-center font-black text-gray-900 dark:text-white bg-transparent focus:outline-none text-sm" readonly />
                <button id="qty-plus" class="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-500 font-bold">+</button>
              </div>
            </div>
          </div>

          <!-- Base Fixa -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <button id="modal-add-to-cart" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-xl shadow-lojaPrimaria/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Adicionar ao Carrinho
            </button>
            <button id="buy-now-whatsapp" class="w-full bg-[#25D366] text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.38-1.644-1.541-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/></svg>
              Conversar no WhatsApp
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, product, onAdd) {
    const root = container.querySelector('#product-modal-root');
    const closeBtn = container.querySelector('#close-product-modal');
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

    closeBtn.onclick = close;
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
      if (product.attributes?.length > 0 && !selectedAttr) {
        Toast.show("Selecione um tamanho para continuar", "error");
        return;
      }
      if (product.colors?.length > 0 && !selectedColor) {
        Toast.show("Selecione uma cor para continuar", "error");
        return;
      }

      onAdd({
        quantity: parseInt(qtyInput.value),
        size: selectedAttr,
        color: selectedColor
      });
      Toast.show("Produto adicionado ao carrinho!");
      close();
    };

    if (buyNowBtn) {
      buyNowBtn.onclick = () => {
        const tenant = appContext.getState().tenant;
        const msg = `Olá! Tenho interesse no produto: ${product.title}\n${selectedAttr ? 'Tamanho: ' + selectedAttr : ''} ${selectedColor ? 'Cor: ' + selectedColor : ''}\nQtd: ${qtyInput.value}`;
        window.open(`https://wa.me/${tenant?.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      };
    }
  }
};
