import { ProductDetailsModal } from '../../components/product/ProductDetailsModal.js';
import { Toast } from '../../components/Toast.js';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { supabase } from '../../config/supabase.js';

export const Home = {
  selectedCategoryId: null,
  searchQuery: '',
  allProducts: [],
  categories: [],
  tenant: null,

  async render() {
    try {
      // 1. Tenta carregar tenant settings caso exista no Supabase ou use padrão profissional de portfólio
      const urlParams = new URLSearchParams(window.location.search);
      const storeSlug = urlParams.get('store');

      let tenantData = null;
      try {
        if (supabase && import.meta.env.VITE_SUPABASE_URL) {
          let tenantQuery = supabase.from('tenant_settings').select('*');
          if (storeSlug) tenantQuery = tenantQuery.eq('slug', storeSlug);
          const { data } = await tenantQuery.maybeSingle();
          tenantData = data;
        }
      } catch (e) {
        // Fallback silencioso para tenant padrão de portfólio
      }

      // Configuração padrão da loja para portfólio (visual impecável garantido)
      const tenant = tenantData || {
        store_name: 'Catálogo Pro',
        hero_title: 'Catálogo Digital & Delivery',
        hero_subtitle: 'Explore produtos exclusivos e finalize seu pedido diretamente pelo WhatsApp',
        hero_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
        whatsapp_number: '5511999999999',
        primary_color: '#3b82f6',
        secondary_color: '#1e3a8a',
        address: 'São Paulo, SP - Atendimento Online'
      };

      // 2. Busca produtos e categorias através da camada unificada (Neon / MockData)
      const [products, categories] = await Promise.all([
        productService.getProducts(),
        categoryService.getAllActive()
      ]);

      this.allProducts = products || [];
      this.categories = categories || [];
      this.tenant = tenant;

      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const heroStyle = tenant.hero_image_url
        ? `style="background: linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('${tenant.hero_image_url}'); background-size: cover; background-position: center;"`
        : 'class="bg-gradient-to-br from-lojaPrimaria to-lojaSecundaria"';

      const cleanPhone = (tenant.whatsapp_number || '5511999999999').replace(/\D/g, '');
      const whatsappFloatButton = `
        <a href="https://wa.me/${cleanPhone}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20cat%C3%A1logo." target="_blank" class="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.644-1.921-.154-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/>
          </svg>
          <span class="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">Fale Conosco</span>
        </a>
      `;

      return `
        <!-- HERO BANNER -->
        <section class="relative w-full h-[360px] md:h-[460px] flex items-center justify-center text-center px-4" ${heroStyle.startsWith('style') ? heroStyle : ''} ${heroStyle.startsWith('class') ? heroStyle : ''}>
          <div class="max-w-4xl mx-auto space-y-4 relative z-10 text-white animate-in fade-in slide-in-from-bottom duration-700">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Vitrine Online • Catálogo Interativo
            </div>
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              ${tenant.hero_title || 'Catálogo Pro'}
            </h1>
            <p class="text-sm md:text-lg font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
              ${tenant.hero_subtitle || 'Escolha seus itens favoritos e finalize sua compra facilmente.'}
            </p>
          </div>
        </section>

        <!-- CONTEÚDO PRINCIPAL -->
        <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
          
          <!-- BARRA DE PESQUISA -->
          <section class="relative max-w-2xl mx-auto">
            <div class="relative group">
              <input
                type="text"
                id="search-input"
                placeholder="Buscar por nome ou descrição do produto..."
                class="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white focus:border-lojaPrimaria focus:ring-4 focus:ring-lojaPrimaria/10 transition outline-none shadow-sm"
                value="${this.searchQuery}"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-lojaPrimaria transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </section>

          <!-- CATEGORIAS STICKY -->
          <section class="sticky top-[73px] z-30 -mx-4 px-4 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 scrollbar-none overflow-x-auto">
            <div class="flex gap-2.5 max-w-7xl mx-auto">
              <button data-category-id="all" class="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${!this.selectedCategoryId ? 'bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300' }">
                🔥 Todos (${this.allProducts.length})
              </button>
              ${this.categories.map(cat => {
                const count = this.allProducts.filter(p => String(p.category_id) === String(cat.id)).length;
                const isSelected = String(this.selectedCategoryId) === String(cat.id);
                return `
                  <button data-category-id="${cat.id}" class="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${isSelected ? 'bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300' }">
                    ${cat.name} ${count > 0 ? `(${count})` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </section>

          <!-- GRID DE PRODUTOS -->
          <section id="products-grid-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-1 md:px-0">
            ${this.renderProductsHTML(this.allProducts, formatCurrency)}
          </section>
        </main>

        <!-- RODAPÉ MODERNO -->
        <footer class="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-12 pb-20 mt-16">
          <div class="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div class="space-y-2">
              <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">${tenant.store_name}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto font-medium">
                Catálogo digital otimizado de alta performance integrado ao PostgreSQL Neon e WhatsApp.
              </p>
            </div>

            ${tenant.address ? `
              <div class="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>${tenant.address}</span>
              </div>
            ` : ''}

            <div class="flex items-center justify-center gap-6 text-xs font-black text-gray-400 uppercase tracking-widest pt-2">
              <a href="#" class="hover:text-lojaPrimaria transition">Início</a>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <a href="/?page=admin" class="hover:text-lojaPrimaria transition">Painel Admin</a>
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              © ${new Date().getFullYear()} ${tenant.store_name} • Desenvolvido para Portfólio
            </div>
          </div>
        </footer>

        <!-- BOTÃO WHATSAPP FLUTUANTE -->
        ${whatsappFloatButton}
      `;
    } catch (err) {
      console.error("Erro ao renderizar Home:", err);
      return `
        <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Ops! Algo deu errado ao carregar o catálogo.</h2>
          <p class="text-gray-500 mt-2">${err.message}</p>
          <button onclick="location.reload()" class="mt-6 bg-lojaPrimaria text-white px-8 py-3 rounded-2xl font-bold shadow-lg">Tentar Novamente</button>
        </div>
      `;
    }
  },

  renderProductsHTML(products, formatCurrency) {
    let filtered = products;

    if (this.selectedCategoryId) {
      filtered = filtered.filter(p => String(p.category_id) === String(this.selectedCategoryId));
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(query) || desc.includes(query);
      });
    }

    if (filtered.length === 0) {
      return `
        <div class="col-span-full py-20 text-center space-y-4">
          <div class="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200">Nenhum produto encontrado</h4>
          <p class="text-gray-500 text-xs">Tente buscar por outro termo ou selecione outra categoria.</p>
        </div>
      `;
    }

    return filtered.map(prod => {
      const title = prod.name || prod.title || 'Produto';
      const price = Number(prod.price);
      const promoPrice = prod.promo_price ? Number(prod.promo_price) : null;
      const hasDiscount = promoPrice && promoPrice < price;
      const discountPercentage = hasDiscount ? Math.round(((price - promoPrice) / price) * 100) : 0;
      const displayPrice = hasDiscount ? promoPrice : price;
      const isOutOfStock = prod.stock_quantity !== undefined && prod.stock_quantity <= 0;

      return `
        <div class="js-product-card group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full relative animate-in fade-in" data-id="${prod.id}">

          ${hasDiscount ? `
            <span class="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md z-10 shadow-sm flex items-center gap-0.5 leading-none">
              <span>-${discountPercentage}%</span>
              <span class="text-[7px] opacity-80">OFF</span>
            </span>
          ` : ''}

          ${isOutOfStock ? `
            <span class="absolute top-2.5 right-2.5 bg-gray-900/80 backdrop-blur-sm text-white text-[8px] font-black uppercase px-2 py-1 rounded-md z-10">
              Esgotado
            </span>
          ` : ''}

          <div class="aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
            <img
              src="${prod.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="${title}"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';"
            />
          </div>

          <div class="p-3.5 md:p-4 flex flex-col flex-grow">
            <span class="text-[9px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
              ${prod.categories?.name || 'Geral'}
            </span>
            <h3 class="font-bold text-gray-800 dark:text-white text-xs md:text-sm line-clamp-2 mb-2 flex-grow leading-snug">
              ${title}
            </h3>
            
            <div class="flex flex-col mt-auto pt-2">
              <div class="flex items-baseline gap-1.5 flex-wrap">
                ${hasDiscount ? `<span class="text-[10px] text-gray-400 line-through">R$ ${price.toFixed(2)}</span>` : ''}
                <span class="text-sm md:text-lg font-black ${hasDiscount ? 'text-red-600' : 'text-gray-900 dark:text-white'}">
                  ${formatCurrency(displayPrice)}
                </span>
              </div>
              <button class="js-quick-add mt-2.5 w-full bg-gray-900 dark:bg-gray-700 hover:bg-lojaPrimaria dark:hover:bg-lojaPrimaria text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-1.5 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  bindEvents(container) {
    const formatCurrency = (value) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Filtro de busca em tempo real
    const searchInput = container.querySelector('#search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        const grid = container.querySelector('#products-grid-container');
        if (grid) {
          grid.innerHTML = this.renderProductsHTML(this.allProducts, formatCurrency);
          this.bindCardEvents(container);
        }
      };
    }

    // Filtro por categorias
    container.querySelectorAll('.js-category-btn').forEach(btn => {
      btn.onclick = () => {
        const catId = btn.dataset.categoryId;
        this.selectedCategoryId = catId === 'all' ? null : catId;

        // Atualiza estilo dos botões de categoria
        container.querySelectorAll('.js-category-btn').forEach(b => {
          b.className = 'js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300';
        });
        btn.className = 'js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20';

        const grid = container.querySelector('#products-grid-container');
        if (grid) {
          grid.innerHTML = this.renderProductsHTML(this.allProducts, formatCurrency);
          this.bindCardEvents(container);
        }
      };
    });

    this.bindCardEvents(container);
  },

  bindCardEvents(container) {
    // Clique no Card para Abrir Detalhes (Modal)
    container.querySelectorAll('.js-product-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('.js-quick-add')) return;
        const cardId = card.dataset.id;
        const prod = this.allProducts.find(p => String(p.id) === String(cardId));
        const modalContainer = document.getElementById('product-modal-container');

        if (modalContainer && prod) {
          modalContainer.innerHTML = ProductDetailsModal.render(prod);
          ProductDetailsModal.bindEvents(modalContainer, prod, (detail) => {
            window.dispatchEvent(new CustomEvent('global:add-to-cart', { detail: { id: prod.id, ...detail } }));
          });
        }
      };
    });

    // Clique no Botão de Compra Rápida "Adicionar"
    container.querySelectorAll('.js-quick-add').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const card = btn.closest('.js-product-card');
        if (card && card.dataset.id) {
          window.dispatchEvent(new CustomEvent('global:add-to-cart', { detail: { id: card.dataset.id } }));
          Toast.show("Produto adicionado ao carrinho! 🛒");
        }
      };
    });
  }
};