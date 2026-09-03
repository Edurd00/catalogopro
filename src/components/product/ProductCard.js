import { Toast } from '../Toast.js';

export const ProductCard = {
  render(product) {
    const title = product.name || product.title || 'Produto sem nome';
    const price = Number(product.price);
    const promoPrice = product.promo_price ? Number(product.promo_price) : null;
    const hasDiscount = promoPrice && promoPrice < price;
    const finalPrice = hasDiscount ? promoPrice : price;
    const discountPercentage = hasDiscount ? Math.round(((price - promoPrice) / price) * 100) : 0;
    const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;

    const formatCurrency = (value) => 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return `
      <div class="js-product-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border border-gray-100 relative cursor-pointer" data-id="${product.id}">
        
        ${hasDiscount ? `
          <span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg z-10 shadow-sm flex items-center gap-1">
            <span>-${discountPercentage}%</span>
            <span class="text-[8px] opacity-80">OFF</span>
          </span>
        ` : ''}

        ${isOutOfStock ? `
          <span class="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg z-10 shadow-sm">
            Esgotado
          </span>
        ` : (product.stock_quantity && product.stock_quantity <= 5) ? `
          <span class="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg z-10 shadow-sm">
            Últimas ${product.stock_quantity} un.
          </span>
        ` : ''}

        <div class="relative pt-[100%] bg-gray-50 overflow-hidden">
          <img 
            src="${product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}" 
            alt="${title}" 
            class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';"
          />
        </div>
        
        <div class="p-4 flex flex-col flex-grow">
          <span class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5">
            ${product.categories?.name || 'Geral'}
          </span>
          <h3 class="font-bold text-gray-800 text-sm md:text-base line-clamp-2 min-h-[2.5rem] mb-2 leading-snug">
            ${title}
          </h3>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow font-normal leading-relaxed">
            ${product.description || 'Sem descrição disponível.'}
          </p>
          
          <div class="flex flex-col mb-4">
            <div class="flex items-center gap-2 flex-wrap">
              ${hasDiscount ? `
                <span class="text-xs text-gray-400 line-through">R$ ${price.toFixed(2)}</span>
                <span class="text-lg md:text-xl font-black text-red-600">${formatCurrency(finalPrice)}</span>
              ` : `
                <span class="text-lg md:text-xl font-black text-gray-900">${formatCurrency(price)}</span>
              `}
            </div>
          </div>

          <button 
            data-id="${product.id}"
            ${isOutOfStock ? 'disabled' : ''}
            class="js-add-to-cart w-full ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-lojaPrimaria text-white active:scale-95'} font-bold py-3 px-4 rounded-xl transition duration-200 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            ${isOutOfStock ? 'Indisponível' : 'Adicionar à Sacola'}
          </button>
        </div>
      </div>
    `;
  },

  bindEvents(container) {
    container.querySelectorAll('.js-add-to-cart').forEach(button => {
      button.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = button.getAttribute('data-id');
        if (productId) {
          window.dispatchEvent(new CustomEvent('global:add-to-cart', { detail: { id: productId } }));
          Toast.show('Produto adicionado ao carrinho! 🛒');
        }
      };
    });
  }
};