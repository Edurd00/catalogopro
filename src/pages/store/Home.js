import { supabase } from '../../config/supabase.js';
import { ProductDetailsModal } from '../../components/product/ProductDetailsModal.js';

export const Home = {
  selectedCategoryId: null,
  searchQuery: '',
  allProducts: [],

  async render() {
    try {
      // 1. Fetch tenant settings
      const { data: tenantData } = await supabase
        .from('tenant_settings')
        .select('*')
        .maybeSingle();

      const tenant = tenantData || {};

      // If tenant is not set up, show onboarding screen instead of a broken page
      if (!tenant.store_name) {
        return `
          <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 text-center transition-colors duration-300">
            <div class="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl max-w-md border border-gray-100 dark:border-gray-800 space-y-6">
              <div class="w-16 h-16 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div class="space-y-2">
                <h2 class="text-2xl font-black text-gray-905 tracking-tight dark:text-white">Vitrine Pendente</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">A plataforma está online, mas nenhuma loja foi configurada ainda.</p>
              </div>
              <a href="/?page=admin" class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition shadow-lg shadow-blue-500/20">
                Acessar Painel do Admin
              </a>
            </div>
          </div>
        `;
      }

      // 2. Fetch products and categories filtered by tenant_id
      let productsQuery = supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
      let categoriesQuery = supabase.from('categories').select('*').order('name', { ascending: true });

      if (tenant.id) {
        productsQuery = productsQuery.or(`tenant_id.eq.${tenant.id},tenant_id.is.null`);
        categoriesQuery = categoriesQuery.or(`tenant_id.eq.${tenant.id},tenant_id.is.null`);
      }

      const [productsRes, categoriesRes] = await Promise.all([
        productsQuery,
        categoriesQuery
      ]);

      if (productsRes.error) console.error("Erro produtos:", productsRes.error);
      if (categoriesRes.error) console.error("Erro categorias:", categoriesRes.error);

      this.allProducts = productsRes.data || [];
      const categories = categoriesRes.data || [];

      // Hero banner styling configuration
      const heroStyle = tenant.hero_image_url
        ? `style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${tenant.hero_image_url}'); background-size: cover; background-position: center;"`
        : 'class="bg-gradient-to-br from-lojaPrimaria to-lojaSecundaria"';

      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const whatsappFloatButton = tenant.whatsapp_number
        ? `
          <a href="https://wa.me/${tenant.whatsapp_number.replace(/\D/g, '')}" target="_blank" class="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.644-1.921-.154-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/></svg>
            <span class="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Fale Conosco</span>
          </a>
        `
        : '';

      return `
      <section class="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-center px-4" ${heroStyle.startsWith('style') ? heroStyle : ''} ${heroStyle.startsWith('class') ? heroStyle : ''}>
        ${(tenant.footer_bio !== 'HIDE_HERO_TEXT' && tenant.hero_title) ? `
          <div class="max-w-4xl mx-auto space-y-4 relative z-10 text-white animate-in fade-in slide-in-from-bottom duration-700">
            <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tight">${tenant.hero_title || 'Bem-vindo'}</h2>
            <p class="text-lg md:text-xl font-medium opacity-90">${tenant.hero_subtitle || ''}</p>
          </div>
        ` : ''}
      </section>

      <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <!-- BARRA DE PESQUISA -->
        <section class="relative max-w-2xl mx-auto">
          <div class="relative group">
            <input
              type="text"
              id="search-input"
              placeholder="O que você está procurando hoje?"
              class="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-lojaPrimaria focus:ring-4 focus:ring-lojaPrimaria/10 transition outline-none"
              value="${this.searchQuery}"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-lojaPrimaria transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        <!-- CATEGORIAS STICKY -->
        <section class="sticky top-[73px] z-30 -mx-4 px-4 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100/80 scrollbar-none overflow-x-auto">
          <div class="flex gap-3 max-w-7xl mx-auto">
            <button data-category-id="all" class="js-category-btn whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${!this.selectedCategoryId ? 'bg-lojaPrimaria text-white border-lojaPrimaria shadow-lg shadow-lojaPrimaria/20' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-250' }">🔥 Todos</button>
            ${categories.map(cat => `
              <button data-category-id="${cat.id}" class="js-category-btn whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${this.selectedCategoryId === cat.id ? 'bg-lojaPrimaria text-white border-lojaPrimaria shadow-lg shadow-lojaPrimaria/20' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-250' }">${cat.name}</button>
            `).join('')}
          </div>
        </section>

        <section id="products-grid-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-0">
          ${this.renderProductsHTML(this.allProducts, formatCurrency)}
        </section>
      </main>

      <!-- RODAPÉ MODERNO E COMPACTO -->
      <footer class="bg-white border-t border-gray-100 pt-12 pb-20">
        <div class="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div class="space-y-4">
            <h3 class="text-lg font-black text-gray-900 uppercase tracking-tighter">${tenant.store_name || 'VITRINE'}</h3>
            <p class="text-xs text-gray-500 leading-relaxed max-w-md mx-auto font-medium">
              ${(tenant.footer_bio && tenant.footer_bio !== 'SHOW_HERO_TEXT' && tenant.footer_bio !== 'HIDE_HERO_TEXT')
                ? tenant.footer_bio
                : 'A melhor seleção de produtos para você, com entrega rápida e atendimento via WhatsApp.'}
            </p>
          </div>

          <div class="flex flex-col items-center gap-6">
            ${tenant.address ? `
              <div class="flex items-center gap-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span class="text-[10px] font-bold uppercase tracking-widest">${tenant.address}</span>
              </div>
            ` : ''}

            <div class="flex items-center justify-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <a href="#" class="hover:text-lojaPrimaria transition">Início</a>
              <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
              <a href="/?page=admin" class="hover:text-lojaPrimaria transition">Painel</a>
            </div>

            <!-- Ícones Sociais Minimalistas -->
            <div class="flex justify-center gap-4 mt-3">
              ${tenant.instagram_url && tenant.instagram_url !== '#' ? `
                <a href="${tenant.instagram_url}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 bg-gray-100 hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-650 hover:text-white rounded-full flex items-center justify-center transition shadow-sm" title="Instagram">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              ` : ''}

              ${tenant.facebook_url && tenant.facebook_url !== '#' ? `
                <a href="${tenant.facebook_url}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition shadow-sm" title="Facebook">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              ` : ''}
            </div>
          </div>

          <div class="pt-8 border-t border-gray-50">
              <p class="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">© 2026 ${tenant.store_name || 'Vitrine'}</p>
          </div>
        </div>
      </footer>

      <!-- BOTÃO WHATSAPP FLUTUANTE -->
      ${whatsappFloatButton}
    `;
    } catch (err) {
      console.error("Erro ao renderizar Home:", err);
      return `<div class="p-20 text-center">
        <h2 class="text-2xl font-black text-gray-900 dark:text-white">Ops! Algo deu errado.</h2>
        <p class="text-gray-500 mt-2">${err.message}</p>
        <button onclick="location.reload()" class="mt-6 bg-lojaPrimaria text-white px-8 py-3 rounded-2xl font-bold shadow-lg">Tentar Novamente</button>
      </div>`;
    }
  },

  renderProductsHTML(products, formatCurrency) {
    let filtered = products;

    if (this.selectedCategoryId) {
      filtered = filtered.filter(p => p.category_id === this.selectedCategoryId);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      return `
        <div class="col-span-full py-20 text-center space-y-4">
          <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p class="text-gray-500 font-medium">Nenhum produto encontrado para sua busca.</p>
        </div>
      `;
    }

    return filtered.map(prod => {
      const price = Number(prod.price);
      const promoPrice = prod.promo_price ? Number(prod.promo_price) : null;
      const hasDiscount = promoPrice && price > promoPrice;
      const discountPercentage = hasDiscount ? Math.round(((price - promoPrice) / price) * 100) : 0;

      return `
        <div class="js-product-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full relative animate-in fade-in duration-500" data-id="${prod.id}">

          ${hasDiscount ? `
            <span class="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md z-10 shadow-sm flex flex-col items-center leading-none">
              <span>${discountPercentage}%</span>
              <span class="text-[7px] opacity-80">OFF</span>
            </span>
          ` : ''}

          <div class="aspect-square w-full overflow-hidden bg-gray-50 relative">
            <img
              src="${prod.image_url || ''}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="${prod.title || 'Produto'}"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';"
            />
          </div>
          <div class="p-3 md:p-4 flex flex-col flex-grow">
            <span class="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">${prod.categories?.name || 'Geral'}</span>
            <h3 class="font-bold text-gray-800 text-xs md:text-sm line-clamp-2 mb-2 flex-grow leading-tight">${prod.title}</h3>
            <div class="flex flex-col mt-auto pt-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                ${hasDiscount ? `<span class="text-[10px] text-gray-400 line-through">R$ ${prod.price}</span>` : ''}
                <span class="text-sm md:text-lg font-black ${hasDiscount ? 'text-red-600' : 'text-gray-900'}">${formatCurrency(promoPrice || price)}</span>
              </div>
              <button class="js-quick-add mt-2 w-full bg-gray-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lojaPrimaria transition-colors shadow-sm">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  bindEvents(container) {
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Live Search Filter
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

    container.querySelectorAll('.js-category-btn').forEach(btn => {
      btn.onclick = () => {
        this.selectedCategoryId = btn.dataset.categoryId === 'all' ? null : btn.dataset.categoryId;

        // Update active state classes
        container.querySelectorAll('.js-category-btn').forEach(b => {
          b.className = 'js-category-btn whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-white text-gray-500 border-gray-100 hover:border-gray-250';
        });
        btn.className = 'js-category-btn whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-lojaPrimaria text-white border-lojaPrimaria shadow-lg shadow-lojaPrimaria/20';

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
    container.querySelectorAll('.js-product-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('.js-quick-add')) return;
        const prod = this.allProducts.find(p => p.id === card.dataset.id);
        const modalContainer = document.getElementById('product-modal-container');
        if (modalContainer && prod) {
          modalContainer.innerHTML = ProductDetailsModal.render(prod);
          ProductDetailsModal.bindEvents(modalContainer, prod, (detail) => {
            window.dispatchEvent(new CustomEvent('global:add-to-cart', { detail: { id: prod.id, ...detail } }));
          });
        }
      };
    });
    container.querySelectorAll('.js-quick-add').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const card = btn.closest('.js-product-card');
        if (card) {
          window.dispatchEvent(new CustomEvent('global:add-to-cart', { detail: { id: card.dataset.id } }));
          Toast?.show ? Toast.show("Produto adicionado ao carrinho!") : null;
        }
      };
    });
  }
};