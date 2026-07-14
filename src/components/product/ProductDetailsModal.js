import { appContext } from '../../context/AppContext.js';
import { Toast } from '../Toast.js';

export const ProductDetailsModal = {
  /**
   * @param {Object} product
   * @param {{ opt1Label: string, opt2Label: string }} options - niche-specific labels
   */
  render(product, options = {}) {
    const opt1Label = options.opt1Label || 'Opções';
    const opt2Label = options.opt2Label || 'Variações';

    const hasDiscount = product.promo_price && Number(product.promo_price) < Number(product.price);
    const finalPrice = hasDiscount ? product.promo_price : product.price;
    const discountPct = hasDiscount
      ? Math.round(((Number(product.price) - Number(product.promo_price)) / Number(product.price)) * 100)
      : 0;

    const formatCurrency = (value) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Build image array
    const allImages = [];
    if (product.image_url) allImages.push(product.image_url);
    if (Array.isArray(product.image_urls)) {
      product.image_urls.forEach(u => { if (u && !allImages.includes(u)) allImages.push(u); });
    }
    if (allImages.length === 0) allImages.push('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000');

    return `
      <div id="product-modal-root" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" id="modal-backdrop"></div>

        <!-- Modal Card -->
        <div class="bg-white dark:bg-gray-900 w-full sm:max-w-4xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl shadow-black/30 overflow-hidden relative
                    flex flex-col sm:flex-row animate-in fade-in slide-in-from-bottom duration-350 sm:slide-in-from-bottom-0 sm:zoom-in-95 max-h-[95vh] sm:max-h-[88vh]">

          <!-- ══ LEFT: Image Gallery ══ -->
          <div class="relative sm:w-[48%] flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden" style="min-height: 260px; max-height: 420px;">

            <!-- Thumbnail strip -->
            ${allImages.length > 1 ? `
              <div class="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 overflow-y-auto max-h-[200px] scrollbar-none">
                ${allImages.map((img, i) => `
                  <button class="js-thumb w-10 h-10 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${i === 0 ? 'border-white shadow-lg scale-110' : 'border-transparent opacity-60 hover:opacity-90'}" data-index="${i}" onclick="window.modalSwitchImage(${i})">
                    <img src="${img}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <!-- Main image -->
            <div id="modal-main-img-wrap" class="w-full h-full" style="height:100%; min-height:inherit;">
              <img
                id="modal-main-img"
                src="${allImages[0]}"
                class="w-full h-full object-cover"
                style="min-height: inherit;"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000';"
              />
            </div>

            <!-- Close button -->
            <button id="close-product-modal" class="absolute top-4 right-4 z-30 bg-black/25 hover:bg-black/50 backdrop-blur-md p-2.5 rounded-full transition-all text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <!-- Discount badge -->
            ${hasDiscount ? `
              <div class="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-md">
                -${discountPct}% OFF
              </div>
            ` : ''}
          </div>

          <!-- ══ RIGHT: Product Info ══ -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Scrollable content area -->
            <div class="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">

              <!-- Category + Title + Price -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-lojaPrimaria uppercase tracking-[0.25em] opacity-80">
                  ${product.categories?.name || 'Geral'}
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  ${product.title}
                </h2>
                <div class="flex items-baseline gap-3 pt-1">
                  <span class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                    ${formatCurrency(finalPrice)}
                  </span>
                  ${hasDiscount ? `
                    <span class="text-sm text-gray-400 line-through font-bold">${formatCurrency(product.price)}</span>
                    <span class="text-xs font-black text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-lg">
                      Economize ${formatCurrency(Number(product.price) - Number(product.promo_price))}
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- Description -->
              ${product.description ? `
                <div class="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${product.description}</p>
                </div>
              ` : ''}

              <!-- Option 1: Colors / Adicionais / etc -->
              ${product.colors && product.colors.length > 0 ? `
                <div class="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">${opt1Label}</span>
                    <span id="selected-color-label" class="text-[10px] font-black text-lojaPrimaria uppercase tracking-wider opacity-0 transition-opacity">—</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    ${product.colors.map(color => `
                      <button class="js-color-btn group px-4 py-2 rounded-xl text-xs font-black border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300
                                     hover:border-lojaPrimaria hover:text-lojaPrimaria transition-all active:scale-95 select-none" data-color="${color}">
                        ${color}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Option 2: Sizes / Bebidas / etc -->
              ${product.attributes && product.attributes.length > 0 ? `
                <div class="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">${opt2Label}</span>
                    <span id="selected-attr-label" class="text-[10px] font-black text-lojaPrimaria uppercase tracking-wider opacity-0 transition-opacity">—</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    ${product.attributes.map(attr => `
                      <button class="js-attr-btn px-4 py-2 rounded-xl text-xs font-black border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300
                                     hover:border-lojaPrimaria hover:text-lojaPrimaria transition-all active:scale-95 select-none" data-attr="${attr}">
                        ${attr}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Quantity Selector -->
              <div class="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2.5">
                <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Quantidade</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
                    <button id="qty-minus" class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-700 dark:text-gray-200 font-black text-lg leading-none">−</button>
                    <input type="number" id="qty-input" value="1" min="1" class="w-10 text-center font-black text-gray-900 dark:text-white bg-transparent focus:outline-none text-sm" readonly />
                    <button id="qty-plus" class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-700 dark:text-gray-200 font-black text-lg leading-none">+</button>
                  </div>
                  <!-- Shipping info if available -->
                  ${Number(product.shipping_fee) > 0 ? `
                    <span class="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2 5 5 3-3 5 5 2-2V9a1 1 0 00-1-1h-5" /></svg>
                      Frete: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.shipping_fee)}
                    </span>
                  ` : `<span class="text-[10px] text-emerald-500 font-black flex items-center gap-1">
                    ✓ Frete a combinar
                  </span>`}
                </div>
              </div>
            </div>

            <!-- ══ Fixed Action Footer ══ -->
            <div class="p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 space-y-2.5 flex-shrink-0">
              <button id="modal-add-to-cart"
                class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-xl shadow-lojaPrimaria/25
                       hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase tracking-widest
                       flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Adicionar ao Carrinho
              </button>
              <button id="buy-now-whatsapp"
                class="w-full bg-[#25D366] text-white font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.2em]
                       flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.38-1.644-1.541-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/></svg>
                Pedir pelo WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * @param {HTMLElement} container
   * @param {Object} product
   * @param {Function} onAdd
   * @param {{ opt1Label: string, opt2Label: string }} options
   */
  bindEvents(container, product, onAdd, options = {}) {
    const opt1Label = options.opt1Label || 'Opções';
    const opt2Label = options.opt2Label || 'Variações';

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

    // ── Image switcher ──────────────────────────────────────────────
    window.modalSwitchImage = (index) => {
      const mainImg = container.querySelector('#modal-main-img');
      const thumbs = container.querySelectorAll('.js-thumb');
      const allImages = [];
      if (product.image_url) allImages.push(product.image_url);
      if (Array.isArray(product.image_urls)) {
        product.image_urls.forEach(u => { if (u && !allImages.includes(u)) allImages.push(u); });
      }
      if (mainImg && allImages[index]) {
        mainImg.style.opacity = '0';
        mainImg.style.transition = 'opacity 0.2s';
        setTimeout(() => {
          mainImg.src = allImages[index];
          mainImg.style.opacity = '1';
        }, 200);
      }
      thumbs.forEach((t, i) => {
        t.classList.toggle('border-white', i === index);
        t.classList.toggle('scale-110', i === index);
        t.classList.toggle('opacity-60', i !== index);
        t.classList.toggle('border-transparent', i !== index);
      });
    };

    // ── Close ───────────────────────────────────────────────────────
    const close = () => {
      root?.classList.add('animate-out', 'fade-out', 'zoom-out', 'duration-200');
      setTimeout(() => root?.remove(), 200);
    };
    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
    });

    // ── Quantity ────────────────────────────────────────────────────
    qtyPlus?.addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) + 1; });
    qtyMinus?.addEventListener('click', () => {
      if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });

    // ── Option 1 selection (colors / adicionais) ────────────────────
    container.querySelectorAll('.js-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.js-color-btn').forEach(b => {
          b.classList.remove('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
          b.classList.add('border-gray-200', 'dark:border-gray-700', 'text-gray-600');
        });
        btn.classList.remove('border-gray-200', 'dark:border-gray-700', 'text-gray-600');
        btn.classList.add('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
        selectedColor = btn.getAttribute('data-color');
        const label = container.querySelector('#selected-color-label');
        if (label) { label.textContent = selectedColor; label.classList.remove('opacity-0'); }
      });
    });

    // ── Option 2 selection (sizes / bebidas) ────────────────────────
    container.querySelectorAll('.js-attr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.js-attr-btn').forEach(b => {
          b.classList.remove('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
          b.classList.add('border-gray-200', 'dark:border-gray-700', 'text-gray-600');
        });
        btn.classList.remove('border-gray-200', 'dark:border-gray-700', 'text-gray-600');
        btn.classList.add('bg-lojaPrimaria', 'text-white', 'border-lojaPrimaria');
        selectedAttr = btn.getAttribute('data-attr');
        const label = container.querySelector('#selected-attr-label');
        if (label) { label.textContent = selectedAttr; label.classList.remove('opacity-0'); }
      });
    });

    // ── Add to Cart ─────────────────────────────────────────────────
    addBtn?.addEventListener('click', () => {
      if (product.colors?.length > 0 && !selectedColor) {
        Toast.show(`Selecione ${opt1Label.toLowerCase()} para continuar`, 'error');
        container.querySelectorAll('.js-color-btn')[0]?.classList.add('ring-2', 'ring-red-400');
        return;
      }
      if (product.attributes?.length > 0 && !selectedAttr) {
        Toast.show(`Selecione ${opt2Label.toLowerCase()} para continuar`, 'error');
        container.querySelectorAll('.js-attr-btn')[0]?.classList.add('ring-2', 'ring-red-400');
        return;
      }

      onAdd({
        quantity: parseInt(qtyInput.value),
        size: selectedAttr,
        color: selectedColor,
        option1: selectedColor,
        option2: selectedAttr
      });
      Toast.show('Produto adicionado ao carrinho! 🛒');
      close();
    });

    // ── Buy via WhatsApp ────────────────────────────────────────────
    buyNowBtn?.addEventListener('click', () => {
      const tenant = appContext.getState().tenant;
      const phone = tenant?.whatsapp_number?.replace(/\D/g, '');
      if (!phone) { Toast.show('WhatsApp não configurado', 'error'); return; }

      const parts = [`Olá! Tenho interesse no produto: *${product.title}*`];
      if (selectedColor) parts.push(`${opt1Label}: ${selectedColor}`);
      if (selectedAttr) parts.push(`${opt2Label}: ${selectedAttr}`);
      parts.push(`Quantidade: ${qtyInput.value}`);

      const msg = parts.join('\n');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
};
