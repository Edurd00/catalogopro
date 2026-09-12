import { injectTheme } from '../../config/theme.js';
import { ImageUpload } from '../../components/ImageUpload.js';
import { Toast } from '../../components/Toast.js';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { orderService } from '../../services/orderService.js';
import { dbService } from '../../services/dbService.js';
import { appContext } from '../../context/AppContext.js';

export const Dashboard = {
  async render() {
    try {
      window.currentAdminTab = window.currentAdminTab || 'overview';

      const storeSettings = (await dbService.getStoreSettings()) || appContext.getState().storeSettings || {
        id: 'store-1',
        store_name: 'Catálogo Pro',
        logo_url: null,
        banner_url: null,
        primary_color: '#3b82f6',
        secondary_color: '#1e3a8a',
        whatsapp_number: '5511999999999',
        email: 'contato@catalogopro.com'
      };

      const [products, categories, orders] = await Promise.all([
        productService.getProducts({ active: null }),
        categoryService.getAllActive(),
        orderService.getOrders()
      ]);

      const activeOrders = orders.filter(o => o.status !== 'cancelled');
      const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      const totalOrders = orders.length;
      const averageTicket = activeOrders.length > 0 ? (totalRevenue / activeOrders.length) : 0;
      const activeProducts = products.filter(p => p.active !== false).length;

      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const renderAdminProductList = (productList, expandedId = null) => {
        return productList.map(prod => {
          const isExpanded = prod.id === expandedId;
          const displayPrice = prod.promotional_price || prod.price;
          const priceFrom = prod.promotional_price ? prod.price : null;
          const temDesconto = priceFrom && Number(priceFrom) > Number(displayPrice);

          return `
            <div class="border border-gray-100 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-900 mb-3 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div onclick="window.toggleAdminProduct('${prod.id}')" class="p-3 flex items-center justify-between bg-gray-55/50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-12 h-12 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0">
                    <img src="${prod.image_url || ''}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-xs font-black text-gray-800 dark:text-gray-100 truncate uppercase tracking-tight">${prod.name}</h4>
                    <p class="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      ${temDesconto ? `<span class="line-through mr-1.5 opacity-50">R$ ${priceFrom}</span>` : ''}
                      <span class="${temDesconto ? 'text-red-650 dark:text-red-400 font-extrabold' : 'text-lojaPrimaria font-extrabold'}">R$ ${displayPrice}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-2">
                  <span class="text-gray-400 p-1.5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-lojaPrimaria' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>

              <div class="${isExpanded ? 'block' : 'hidden'} p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                <div class="space-y-4">
                  <div>
                    <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Descrição</h5>
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">${prod.description || 'Sem descrição cadastrada.'}</p>
                  </div>
                  <div class="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <span>Estoque: ${prod.stock}</span>
                    <span>Status: ${prod.active ? 'Ativo' : 'Inativo'}</span>
                    ${prod.featured ? '<span class="text-amber-500">Destaque</span>' : ''}
                  </div>
                </div>
                
                <div class="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" onclick="event.stopPropagation(); window.editAdminProduct('${prod.id}')" class="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-650 dark:text-blue-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    Editar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.deleteAdminProduct('${prod.id}')" class="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-650 dark:text-red-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      };

      const tabClass = (tab) => window.currentAdminTab === tab
        ? 'bg-lojaPrimaria text-white shadow-lg shadow-lojaPrimaria/20 scale-[1.02]'
        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800/80';

      return `
        <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
          <div class="max-w-7xl mx-auto space-y-6">

            <!-- CABEÇALHO ADMIN -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800/80">
              <div class="flex items-center gap-4">
                ${storeSettings.logo_url
                  ? `<div class="w-12 h-12 rounded-2xl overflow-hidden border bg-white dark:bg-gray-800 flex items-center justify-center p-1"><img src="${storeSettings.logo_url}" class="max-h-full max-w-full object-contain" /></div>`
                  : `<div class="w-12 h-12 rounded-2xl bg-lojaPrimaria/10 text-lojaPrimaria flex items-center justify-center font-black uppercase text-lg">${(storeSettings.store_name || 'L').charAt(0)}</div>`
                }
                <div>
                  <div class="flex items-center gap-2.5">
                    <h1 class="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Painel Administrativo</h1>
                    <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">Neon Postgres</span>
                  </div>
                  <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Loja: <span class="text-gray-900 dark:text-gray-200">${storeSettings.store_name}</span></p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button onclick="window.toggleStoreTheme()" class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold p-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-sm" title="Alternar Tema">
                  <span id="theme-icon">${localStorage.getItem('theme') === 'dark' ? '☀️' : '🌙'}</span>
                </button>
                <a href="/" class="flex-1 lg:flex-none text-center bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 font-black px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-md">
                  Ver Minha Vitrine
                </a>
                <button onclick="window.adminLogout()" class="bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-sm" title="Sair do Painel">
                  Sair
                </button>
              </div>
            </div>

            <!-- NAVEGAÇÃO POR ABAS -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button onclick="window.toggleAdminTab('overview')" class="${tabClass('overview')} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📊 Visão Geral
              </button>
              <button onclick="window.toggleAdminTab('catalog')" class="${tabClass('catalog')} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                🛍️ Catálogo
              </button>
              <button onclick="window.toggleAdminTab('categories')" class="${tabClass('categories')} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📁 Categorias
              </button>
              <button onclick="window.toggleAdminTab('orders')" class="${tabClass('orders')} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📝 Pedidos (${orders.filter(o => o.status === 'pending').length})
              </button>
              <button onclick="window.toggleAdminTab('settings')" class="${tabClass('settings')} font-black col-span-2 md:col-span-1 px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                ⚙️ Configurações
              </button>
            </div>

            <!-- ABA 1: VISÃO GERAL -->
            <div class="${window.currentAdminTab === 'overview' ? 'block' : 'hidden'} space-y-6 animate-in fade-in duration-300">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Faturamento</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${formatCurrency(totalRevenue)}</h3>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pedidos Totais</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${totalOrders}</h3>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ticket Médio</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${formatCurrency(averageTicket)}</h3>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Produtos Ativos</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${activeProducts}</h3>
                  </div>
                </div>
              </div>
            </div>

            <!-- ABA 2: CATALOGO -->
            <div class="${window.currentAdminTab === 'catalog' ? 'block' : 'hidden'} grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              <div class="lg:col-span-5 space-y-6">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight" id="product-form-title">Cadastrar Novo Produto</h3>
                  
                  <form id="admin-product-form" class="space-y-4">
                    <input type="hidden" id="product-id" value="" />
                    
                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome do Produto *</label>
                       <input type="text" id="prod-name" required class="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Ex: Headphone Wireless" />
                    </div>

                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Categoria</label>
                       <select id="prod-category" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100">
                          <option value="">Nenhuma Categoria</option>
                          ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                       </select>
                    </div>

                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Descrição</label>
                       <textarea id="prod-description" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-24" placeholder="Descrição do produto..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço (R$) *</label>
                         <input type="number" step="0.01" id="prod-price" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="99.90" />
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço Promocional (R$)</label>
                         <input type="number" step="0.01" id="prod-promo" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="79.90" />
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Estoque *</label>
                         <input type="number" id="prod-stock" required value="10" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" />
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">URL da Imagem</label>
                         <input type="text" id="url-prod" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="https://..." />
                      </div>
                    </div>

                    <button type="submit" id="btn-prod-submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition uppercase text-xs tracking-widest">
                       Salvar Produto
                    </button>
                  </form>
                </div>
              </div>

              <div class="lg:col-span-7 space-y-6">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Produtos (${products.length})</h3>
                  <div class="grid grid-cols-1 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                    ${renderAdminProductList(products, window.currentExpandedId)}
                  </div>
                </div>
              </div>
            </div>

            <!-- ABA 3: CATEGORIAS -->
            <div class="${window.currentAdminTab === 'categories' ? 'block' : 'hidden'} max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 animate-in fade-in duration-300">
               <div>
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Categorias</h3>
               </div>

               <form id="admin-direct-category-form" class="flex gap-2">
                 <input type="text" id="direct-cat-name" required class="flex-grow bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Nome da Categoria" />
                 <button type="submit" class="bg-lojaPrimaria text-white font-black px-6 py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition flex items-center justify-center shadow-sm">
                   Adicionar
                 </button>
               </form>

               <div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  ${categories.map(cat => `
                    <div class="flex items-center justify-between bg-gray-55/50 dark:bg-gray-950/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                       <span class="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest">${cat.name}</span>
                       <button onclick="window.deleteCategory('${cat.id}')" class="text-red-500 text-xs font-bold p-2">Excluir</button>
                    </div>
                  `).join('')}
               </div>
            </div>

            <!-- ABA 4: PEDIDOS -->
            <div class="${window.currentAdminTab === 'orders' ? 'block' : 'hidden'} space-y-6 animate-in fade-in duration-300">
               <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h2 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Pedidos</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     ${orders.map(order => `
                        <div class="bg-gray-55/50 dark:bg-gray-900/50 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 space-y-4">
                           <div class="flex justify-between items-start">
                              <div>
                                 <p class="text-[9px] font-black text-gray-400 uppercase">#${order.id.slice(0, 8)}</p>
                                 <h4 class="text-xs font-black text-gray-950 dark:text-white uppercase">${order.customer_name}</h4>
                              </div>
                              <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 text-blue-600">${order.status}</span>
                           </div>
                           <p class="text-xs font-bold text-lojaPrimaria">${formatCurrency(order.total_amount)}</p>
                           <div class="flex gap-2">
                              <button onclick="window.advanceOrderStatus('${order.id}', 'shipped')" class="bg-blue-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg">Avançar Status</button>
                           </div>
                        </div>
                     `).join('')}
                  </div>
               </div>
            </div>

            <!-- ABA 5: CONFIGURAÇÕES DA LOJA -->
            <div class="${window.currentAdminTab === 'settings' ? 'block' : 'hidden'} max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div class="p-6 border-b border-gray-50 dark:border-gray-850/80 bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Configurações da Loja</h3>
                  </div>

                  <form id="admin-store-form" class="p-6 space-y-6 bg-white dark:bg-gray-900">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome da Loja *</label>
                      <input type="text" id="conf-name" value="${storeSettings.store_name || ''}" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" />
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">URL da Logo</label>
                      <input type="text" id="conf-logo" value="${storeSettings.logo_url || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="https://..." />
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">URL do Banner</label>
                      <input type="text" id="conf-banner" value="${storeSettings.banner_url || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="https://..." />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Primária</label>
                        <input type="color" id="conf-primary" value="${storeSettings.primary_color || '#3b82f6'}" class="w-full h-12 rounded-xl border-none cursor-pointer" />
                      </div>
                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Secundária</label>
                        <input type="color" id="conf-secondary" value="${storeSettings.secondary_color || '#1e3a8a'}" class="w-full h-12 rounded-xl border-none cursor-pointer" />
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp *</label>
                        <input type="text" id="conf-phone" value="${storeSettings.whatsapp_number || ''}" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" />
                      </div>
                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">E-mail</label>
                        <input type="email" id="conf-email" value="${storeSettings.email || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" />
                      </div>
                    </div>

                    <button type="submit" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-lg transition uppercase text-xs tracking-widest mt-4">
                      Salvar Alterações
                    </button>
                  </form>
                </div>
            </div>

          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      return `<div class="p-20 text-center font-black uppercase text-red-500">Erro ao carregar o painel administrativo.</div>`;
    }
  },

  bindEvents(container, onRefresh) {
    const storeForm = container.querySelector('#admin-store-form');
    const productForm = container.querySelector('#admin-product-form');
    const directCategoryForm = container.querySelector('#admin-direct-category-form');

    window.toggleAdminTab = (tab) => {
      window.currentAdminTab = tab;
      onRefresh();
    };

    window.toggleStoreTheme = () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      const icon = container.querySelector('#theme-icon');
      if (icon) icon.innerText = isDark ? '☀️' : '🌙';
    };

    window.adminLogout = () => {
      localStorage.removeItem('admin_auth');
      Toast.show('Você saiu do painel administrativo.', 'info');
      setTimeout(() => { window.location.search = ''; }, 300);
    };

    window.toggleAdminProduct = (id) => {
      window.currentExpandedId = window.currentExpandedId === id ? null : id;
      onRefresh();
    };

    window.deleteAdminProduct = async (id) => {
      if (confirm('Deseja excluir este produto?')) {
        await productService.delete(id);
        Toast.show("Produto excluído!");
        onRefresh();
      }
    };

    window.deleteCategory = async (id) => {
      if (confirm('Deseja excluir esta categoria?')) {
        await categoryService.delete(id);
        Toast.show("Categoria removida!");
        onRefresh();
      }
    };

    window.advanceOrderStatus = async (id, nextStatus) => {
      await orderService.updateStatus(id, nextStatus);
      Toast.show("Status do pedido atualizado!");
      onRefresh();
    };

    window.editAdminProduct = async (id) => {
      const prod = await productService.getById(id);
      if (prod) {
        window.currentAdminTab = 'catalog';
        onRefresh();

        setTimeout(() => {
          container.querySelector('#product-id').value = prod.id;
          container.querySelector('#prod-name').value = prod.name;
          container.querySelector('#prod-category').value = prod.category_id || '';
          container.querySelector('#prod-description').value = prod.description || '';
          container.querySelector('#prod-price').value = prod.price;
          container.querySelector('#prod-promo').value = prod.promotional_price || '';
          container.querySelector('#prod-stock').value = prod.stock ?? 10;
          container.querySelector('#url-prod').value = prod.image_url || '';
        }, 100);
      }
    };

    if (directCategoryForm) {
      directCategoryForm.onsubmit = async (e) => {
        e.preventDefault();
        const inputName = container.querySelector('#direct-cat-name');
        const catName = inputName.value.trim();
        if (!catName) return;

        await categoryService.create({ name: catName });
        Toast.show("Categoria criada!");
        inputName.value = '';
        onRefresh();
      };
    }

    if (storeForm) {
      storeForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
          const currentSettings = await dbService.getStoreSettings();
          const updatedData = {
            store_name: container.querySelector('#conf-name').value,
            logo_url: container.querySelector('#conf-logo').value || null,
            banner_url: container.querySelector('#conf-banner').value || null,
            primary_color: container.querySelector('#conf-primary').value,
            secondary_color: container.querySelector('#conf-secondary').value,
            whatsapp_number: container.querySelector('#conf-phone').value,
            email: container.querySelector('#conf-email').value || null
          };

          if (currentSettings && currentSettings.id) {
            await dbService.updateStoreSettings(currentSettings.id, updatedData);
          } else {
            await dbService.createStoreSettings(updatedData);
          }

          injectTheme(updatedData.primary_color, updatedData.secondary_color);
          appContext.setStoreSettings(updatedData);
          Toast.show("Configurações da loja salvas com sucesso!");
          onRefresh();
        } catch (err) {
          Toast.show("Erro ao salvar configurações: " + err.message, "error");
        }
      };
    }

    if (productForm) {
      productForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
          const productId = container.querySelector('#product-id').value;
          const payload = {
            name: container.querySelector('#prod-name').value,
            category_id: container.querySelector('#prod-category').value || null,
            description: container.querySelector('#prod-description').value,
            price: parseFloat(container.querySelector('#prod-price').value),
            promotional_price: container.querySelector('#prod-promo').value ? parseFloat(container.querySelector('#prod-promo').value) : null,
            stock: parseInt(container.querySelector('#prod-stock').value || 10, 10),
            image_url: container.querySelector('#url-prod').value || null,
            active: true
          };

          if (productId) {
            await productService.update(productId, payload);
          } else {
            await productService.create(payload);
          }

          Toast.show("Produto salvo com sucesso!");
          productForm.reset();
          container.querySelector('#product-id').value = '';
          onRefresh();
        } catch (err) {
          Toast.show("Erro ao salvar produto: " + err.message, "error");
        }
      };
    }
  }
};
