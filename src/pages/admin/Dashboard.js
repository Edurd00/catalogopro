import { supabase } from '../../config/supabase.js';
import { injectTheme } from '../../config/theme.js';
import { ImageUpload } from '../../components/ImageUpload.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';
import { Toast } from '../../components/Toast.js';

export const Dashboard = {
  async render() {
    try {
      const [ordersRes, productsRes, categoriesRes, tenantRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('tenant_settings').select('*').maybeSingle()
      ]);

      const products = productsRes.data || [];
      const categories = categoriesRes.data || [];
      const tenant = tenantRes.data || {};
      const orders = ordersRes.data || [];

      const isConfigured = tenant.store_name && tenant.logo_url && tenant.whatsapp_number;

      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const renderAdminProductList = (products, expandedId = null) => {
        return products.map(prod => {
          const isExpanded = prod.id === expandedId;
          const displayPrice = prod.promo_price || prod.price;
          const priceFrom = prod.promo_price ? prod.price : null;
          const temDesconto = priceFrom && Number(priceFrom) > Number(displayPrice);

          return `
            <div class="border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 mb-2 overflow-hidden shadow-sm mx-1">
              <div onclick="window.toggleAdminProduct('${prod.id}')" class="p-2 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div class="w-10 h-10 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0">
                    <img src="${prod.image_url || ''}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-[11px] font-black text-gray-800 dark:text-gray-100 truncate uppercase tracking-tight">${prod.title}</h4>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                      ${temDesconto ? `<span class="line-through mr-1 opacity-50">R$ ${priceFrom}</span>` : ''}
                      <span class="${temDesconto ? 'text-red-600' : ''}">R$ ${displayPrice}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-2">
                  <span class="text-gray-400 p-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>

              <div class="${isExpanded ? 'block' : 'hidden'} p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div class="space-y-3">
                    <div>
                        <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Descrição</h5>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px]">${prod.description || 'Sem descrição.'}</p>
                    </div>
                    ${prod.colors && prod.colors.length > 0 ? `
                        <div>
                            <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Cores</h5>
                            <div class="flex flex-wrap gap-1">
                                ${prod.colors.map(c => `<span class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 dark:text-gray-300 uppercase">${c}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="flex gap-2 justify-end pt-3 mt-3 border-t border-gray-50 dark:border-gray-800">
                  <button type="button" onclick="event.stopPropagation(); window.cloneAdminProduct('${prod.id}')" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1">
                    🔗 Clonar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.editAdminProduct('${prod.id}')" class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1">
                    ✏️ Editar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.deleteAdminProduct('${prod.id}')" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1">
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      };

      return `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-3 md:p-8 transition-colors duration-300">
          <div class="max-w-7xl mx-auto space-y-6 md:space-y-8">

            <!-- CABEÇALHO ADMIN -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <h1 class="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Painel Administrativo</h1>
                  ${isConfigured
                    ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-600">Online</span>`
                    : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-600">Pendente</span>`
                  }
                </div>
                <p class="text-xs text-gray-500 font-bold uppercase tracking-widest">Loja: <span class="text-gray-900 dark:text-gray-300">${tenant.store_name || 'Nova Loja'}</span></p>
              </div>
              <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button onclick="window.toggleAdminTab('dashboard')" class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition">Painel</button>
                <button onclick="window.toggleAdminTab('orders')" class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition">Central de Pedidos</button>
                <button onclick="window.toggleStoreTheme()" class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                  <span id="theme-icon">🌙 Modo Escuro</span>
                </button>
                <a href="/" class="text-center bg-gray-900 hover:bg-black text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-lg">
                  Ver Minha Vitrine
                </a>
              </div>
            </div>

            <div class="${window.currentAdminTab === 'orders' ? 'hidden' : 'grid'} grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

              <!-- COLUNA ESQUERDA: CONFIGS -->
              <div class="lg:col-span-5 space-y-6 md:space-y-8">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div class="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight">Configurações Gerais</h3>
                  </div>

                  <form id="admin-tenant-form" class="p-6 space-y-4 bg-white dark:bg-gray-900">
                    <div class="space-y-4">
                      <!-- Seção 1: Identidade -->
                      <div class="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-800/20">
                        <button type="button" onclick="window.toggleConfigAccordion('identity')" class="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <span class="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-lojaPrimaria" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Identidade da Loja
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-transform \text{window.adminConfigExpanded === 'identity' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div class="${window.adminConfigExpanded === 'identity' ? 'block' : 'hidden'} p-4 space-y-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                          <div>
                            <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome da Loja</label>
                            <input type="text" id="conf-name" value="${tenant.store_name || ''}" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lojaPrimaria transition" />
                          </div>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                              ${ImageUpload.render('logo', tenant.logo_url, 'Logotipo')}
                              ${tenant.logo_url ? `<button type="button" onclick="window.removeTenantMedia('logo')" class="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors">✕ Remover Imagem</button>` : ''}
                            </div>
                            <div class="space-y-1">
                              ${ImageUpload.render('hero', tenant.hero_image_url, 'Banner Hero')}
                              ${tenant.hero_image_url ? `<button type="button" onclick="window.removeTenantMedia('hero')" class="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors">✕ Remover Imagem</button>` : ''}
                            </div>
                          </div>
                          <div class="pt-2">
                             <label class="flex items-center gap-3 cursor-pointer group">
                               <div class="relative">
                                 <input type="checkbox" id="conf-show-hero-text" ${tenant.footer_bio !== 'HIDE_HERO_TEXT' ? 'checked' : ''} class="sr-only peer" />
                                 <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lojaPrimaria"></div>
                               </div>
                               <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Exibir texto sobre o Banner da Hero?</span>
                             </label>
                          </div>
                        </div>
                      </div>

                      <!-- Seção 2: Estilo e Cores -->
                      <div class="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-800/20">
                        <button type="button" onclick="window.toggleConfigAccordion('style')" class="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <span class="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-lojaPrimaria" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656l-1.172 1.172" /></svg>
                            Cores & Estilo
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-transform \text{window.adminConfigExpanded === 'style' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div class="${window.adminConfigExpanded === 'style' ? 'block' : 'hidden'} p-4 space-y-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Primária</label>
                              <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-1 pr-3">
                                <input type="color" id="conf-primary" value="${tenant.primary_color || '#3b82f6'}" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer" />
                                <span class="text-[10px] font-mono font-black text-gray-500 dark:text-gray-400 uppercase">${tenant.primary_color || '#3b82f6'}</span>
                              </div>
                            </div>
                            <div>
                              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Secundária</label>
                              <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-1 pr-3">
                                <input type="color" id="conf-secondary" value="${tenant.secondary_color || '#1e3a8a'}" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer" />
                                <span class="text-[10px] font-mono font-black text-gray-500 dark:text-gray-400 uppercase">${tenant.secondary_color || '#1e3a8a'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Seção 3: Contato e Redes Sociais -->
                      <div class="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-800/20">
                        <button type="button" onclick="window.toggleConfigAccordion('social')" class="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <span class="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-lojaPrimaria" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Contato & Redes Sociais
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-transform \text{window.adminConfigExpanded === 'social' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div class="${window.adminConfigExpanded === 'social' ? 'block' : 'hidden'} p-4 space-y-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                          <div>
                            <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp (Receber Pedidos)</label>
                            <input type="text" id="conf-phone" value="${tenant.whatsapp_number || ''}" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" placeholder="5511999999999" />
                          </div>
                          <div>
                            <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Endereço Físico</label>
                            <input type="text" id="conf-address" value="${tenant.address || ''}" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                          </div>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Instagram (URL)</label>
                               <input type="text" id="conf-instagram" value="${tenant.instagram_url || ''}" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                            </div>
                            <div>
                               <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Facebook (URL)</label>
                               <input type="text" id="conf-facebook" value="${tenant.facebook_url || ''}" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button type="submit" id="btn-save-tenant" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-lg shadow-lojaPrimaria/20 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest group disabled:opacity-70 disabled:cursor-not-allowed">
                      <span id="btn-save-text">Salvar Alterações</span>
                      <div id="btn-save-loader" class="hidden animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    </button>
                  </form>
                </div>

                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
                   <h3 class="font-black text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight">Categorias</h3>
                   <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                      ${categories.map(cat => `
                        <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 group">
                           <span class="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">${cat.name}</span>
                           <button onclick="window.deleteCategory('${cat.id}')" class="text-red-300 hover:text-red-500 transition p-1 hover:bg-red-50 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      `).join('')}
                   </div>
                </div>
              </div>

              <!-- COLUNA DIREITA: PRODUTOS -->
              <div class="lg:col-span-7 space-y-6 md:space-y-8">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight" id="product-form-title">Cadastrar Novo Produto</h3>
                  <form id="admin-product-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="hidden" id="product-id" value="" />
                    <div class="space-y-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título do Produto</label>
                         <input type="text" id="prod-title" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                      </div>
                      <div class="flex gap-2">
                        <div class="flex-1">
                             <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Categoria</label>
                             <select id="prod-category" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100">
                                <option value="" disabled selected>Selecionar...</option>
                                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                <option value="new">+ Criar Nova</option>
                             </select>
                        </div>
                        <input type="text" id="new-category-name" class="hidden flex-grow bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-3 text-sm font-bold mt-5 text-gray-900 dark:text-gray-100" placeholder="Nome" />
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Descrição Curta</label>
                         <textarea id="prod-description" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100 h-24" placeholder="Detalhes do item..."></textarea>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                           <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço (R$)</label>
                           <input type="number" step="0.01" id="prod-price" required class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                           <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Promo (R$)</label>
                           <input type="number" step="0.01" id="prod-promo" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                        </div>
                      </div>
                      ${ImageUpload.render('prod', '', 'Foto do Produto')}
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cores (separadas por vírgula)</label>
                         <input type="text" id="prod-colors" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" placeholder="Preto, Branco, Azul" />
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Tamanhos (P, M, G)</label>
                         <input type="text" id="prod-attributes" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100" />
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Outras Imagens (URLs separadas por vírgula)</label>
                        <textarea id="prod-image-urls" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-gray-100 h-20" placeholder="https://exemplo.com/foto2.jpg, https://exemplo.com/foto3.jpg"></textarea>
                      </div>
                    </div>
                    <button type="submit" id="btn-prod-submit" class="md:col-span-2 bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-700 transition uppercase text-xs tracking-widest disabled:opacity-70 disabled:cursor-not-allowed">
                       <span id="btn-prod-text">Adicionar ao Catálogo</span>
                       <div id="btn-prod-loader" class="hidden animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    </button>
                  </form>
                </div>

                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight">Catálogo</h3>
                  <div class="grid grid-cols-1 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin" id="admin-product-list">
                    ${renderAdminProductList(products, window.currentExpandedId)}
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight">Fluxo de Preparo</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- COLUNA: NOVOS -->
                    <div class="space-y-3">
                      <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        📥 Novos
                      </h4>
                      <div class="space-y-3">
                        ${orders.filter(o => o.status === 'pending' || o.status === 'new').map(order => `
                          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                            <div>
                              <div class="flex justify-between items-start">
                                <p class="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">${order.customer_name}</p>
                                <span class="text-[9px] text-gray-400 font-bold">${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <p class="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">
                                ${order.payment_method} • ${formatCurrency(order.total_amount)}
                              </p>
                            </div>
                            <div class="text-[9px] text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-50 dark:border-gray-800">
                              ${order.items_summary || 'Ver detalhes no WhatsApp'}
                            </div>
                            <button onclick="window.advanceOrderStatus('${order.id}', 'preparing')" class="w-full bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                              🍳 Preparar Pedido
                            </button>
                          </div>
                        `).join('')}
                        ${orders.filter(o => o.status === 'pending' || o.status === 'new').length === 0 ? '<p class="text-center text-gray-400 text-[9px] font-bold uppercase tracking-widest py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">Vazio</p>' : ''}
                      </div>
                    </div>
                    <!-- COLUNA: EM PREPARO -->
                    <div class="space-y-3">
                      <h4 class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        🍳 Em Preparo
                      </h4>
                      <div class="space-y-3">
                        ${orders.filter(o => o.status === 'preparing').map(order => `
                          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                            <div>
                               <div class="flex justify-between items-start">
                                  <p class="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">${order.customer_name}</p>
                                  <span class="text-[9px] text-gray-400 font-bold">${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               </div>
                               <p class="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">
                                 ${order.payment_method} • ${formatCurrency(order.total_amount)}
                               </p>
                            </div>
                            <button onclick="window.advanceOrderStatus('${order.id}', 'shipped')" class="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-xl transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2">
                              🚚 Saiu p/ Entrega
                            </button>
                          </div>
                        `).join('')}
                        ${orders.filter(o => o.status === 'preparing').length === 0 ? '<p class="text-center text-gray-400 text-[9px] font-bold uppercase tracking-widest py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">Vazio</p>' : ''}
                      </div>
                    </div>
                    <!-- COLUNA: ENTREGUES -->
                    <div class="space-y-3">
                      <h4 class="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-green-500"></span>
                        🚚 Entregues
                      </h4>
                      <div class="space-y-3">
                        ${orders.filter(o => o.status === 'shipped' || o.status === 'delivered').map(order => `
                          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 opacity-80">
                            <div class="flex justify-between items-start">
                                <p class="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">${order.customer_name}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p class="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">
                               ${order.payment_method} • ${formatCurrency(order.total_amount)}
                            </p>
                          </div>
                        `).join('')}
                        ${orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length === 0 ? '<p class="text-center text-gray-400 text-[9px] font-bold uppercase tracking-widest py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">Vazio</p>' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CENTRAL DE PEDIDOS -->
            <div class="${window.currentAdminTab === 'orders' ? 'block' : 'hidden'} space-y-8 animate-in fade-in duration-500">
               <div class="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-lojaPrimaria" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                     Central de Pedidos
                  </h2>

                  <div class="space-y-12">
                     ${(() => {
                        const groups = {};
                        orders.forEach(o => {
                           const date = new Date(o.created_at);
                           const today = new Date();
                           const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

                           let key = date.toLocaleDateString('pt-BR');
                           if (date.toDateString() === today.toDateString()) key = 'Hoje';
                           else if (date.toDateString() === yesterday.toDateString()) key = 'Ontem';

                           if (!groups[key]) groups[key] = [];
                           groups[key].push(o);
                        });

                        return Object.entries(groups).map(([date, items]) => `
                           <div class="space-y-4">
                              <div class="flex items-center gap-4">
                                 <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">📅 Pedidos de ${date}</span>
                                 <div class="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 ${items.map(order => `
                                    <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 hover:border-lojaPrimaria/30 transition-colors group">
                                       <div class="flex justify-between items-start">
                                          <div>
                                             <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">#${order.id.slice(0, 8)} • ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                             <h4 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">${order.customer_name}</h4>
                                          </div>
                                          <span class="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600' }">${order.status}</span>
                                       </div>

                                       <div class="space-y-2">
                                          <p class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-1">Itens do Pedido</p>
                                          <div class="text-[10px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
                                             ${order.items_summary || 'Itens não listados'}
                                          </div>
                                       </div>

                                       <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Entrega</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase truncate">${order.delivery_address ? 'Delivery' : 'Retirada'}</p>
                                          </div>
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Pagamento</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">${order.payment_method}</p>
                                          </div>
                                          <div class="col-span-2 text-right pt-2 border-t border-gray-50 dark:border-gray-800/50">
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Total do Pedido</p>
                                             <p class="text-sm font-black text-lojaPrimaria">${formatCurrency(order.total_amount)}</p>
                                          </div>
                                       </div>

                                       <button onclick="window.advanceOrderStatus('${order.id}', '${order.status === 'pending' ? 'preparing' : (order.status === 'preparing' ? 'shipped' : 'delivered')}')" class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-lojaPrimaria dark:hover:border-lojaPrimaria text-gray-900 dark:text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm">
                                          Avançar Status
                                       </button>
                                    </div>
                                 `).join('')}
                              </div>
                           </div>
                        `).join('');
                     })()}
                  </div>
               </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      return `<div class="p-20 text-center font-black uppercase text-red-500">Erro de Conexão</div>`;
    }
  },

  bindEvents(container, onRefresh) {
    const tenantForm = container.querySelector('#admin-tenant-form');
    const productForm = container.querySelector('#admin-product-form');
    const categorySelect = container.querySelector('#prod-category');
    const newCategoryInput = container.querySelector('#new-category-name');

    ImageUpload.bindEvents('logo', (url) => { if(!url) container.querySelector('#url-logo').value = ''; });
    ImageUpload.bindEvents('hero', (url) => { if(!url) container.querySelector('#url-hero').value = ''; });
    ImageUpload.bindEvents('prod', (url) => { if(!url) container.querySelector('#url-prod').value = ''; });

    window.removeTenantMedia = async (type) => {
       if (await ConfirmModal.show('Remover Imagem?', 'Deseja realmente apagar esta imagem das configurações?', 'Sim, Remover')) {
          const field = type === 'logo' ? 'logo_url' : 'hero_image_url';
          const { data: tenant } = await supabase.from('tenant_settings').select('id').maybeSingle();
          if (tenant) {
             const { error } = await supabase.from('tenant_settings').update({ [field]: null }).eq('id', tenant.id);
             if (error) Toast.show("Erro ao remover: " + error.message, "error");
             else { Toast.show("Imagem removida com sucesso!"); onRefresh(); }
          }
       }
    };

    window.toggleAdminTab = (tab) => {
      window.currentAdminTab = tab;
      onRefresh();
    };

    window.toggleStoreTheme = () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      const icon = container.querySelector('#theme-icon');
      if (icon) icon.innerText = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    };

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      const icon = container.querySelector('#theme-icon');
      if (icon) icon.innerText = '☀️ Modo Claro';
    }

    window.toggleConfigAccordion = (section) => {
      window.adminConfigExpanded = window.adminConfigExpanded === section ? null : section;
      onRefresh();
    };

    if (categorySelect) {
      categorySelect.onchange = () => {
        if (categorySelect.value === 'new') {
          newCategoryInput.classList.remove('hidden');
          newCategoryInput.required = true;
        } else {
          newCategoryInput.classList.add('hidden');
          newCategoryInput.required = false;
        }
      };
    }

    if (tenantForm) {
      tenantForm.onsubmit = async (e) => {
        e.preventDefault();
        const btnSave = container.querySelector('#btn-save-tenant');
        const btnText = container.querySelector('#btn-save-text');
        const btnLoader = container.querySelector('#btn-save-loader');

        btnSave.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        try {
          const updatedData = {
            store_name: container.querySelector('#conf-name').value,
            logo_url: container.querySelector('#url-logo').value,
            hero_image_url: container.querySelector('#url-hero').value,
            whatsapp_number: container.querySelector('#conf-phone').value,
            address: container.querySelector('#conf-address').value,
            primary_color: container.querySelector('#conf-primary').value,
            secondary_color: container.querySelector('#conf-secondary').value,
            instagram_url: container.querySelector('#conf-instagram').value,
            facebook_url: container.querySelector('#conf-facebook').value,
            footer_bio: container.querySelector('#conf-show-hero-text').checked ? 'SHOW_HERO_TEXT' : 'HIDE_HERO_TEXT'
          };

          const { data: currentTenant } = await supabase.from('tenant_settings').select('id').maybeSingle();

          let error;
          if (currentTenant) {
            const res = await supabase.from('tenant_settings').update(updatedData).eq('id', currentTenant.id);
            error = res.error;
          } else {
            const res = await supabase.from('tenant_settings').insert(updatedData);
            error = res.error;
          }

          if (!error) {
            injectTheme(updatedData.primary_color, updatedData.secondary_color);
            Toast.show("✨ Sucesso! Alterações salvas com sucesso.");
            onRefresh();
          } else {
            throw error;
          }
        } catch (err) {
          Toast.show("❌ Erro ao salvar: " + err.message, "error");
          btnSave.disabled = false;
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
        }
      };
    }

    window.toggleAdminProduct = (id) => {
      window.currentExpandedId = window.currentExpandedId === id ? null : id;
      onRefresh();
    };

    window.deleteAdminProduct = async (id) => {
       if (await ConfirmModal.show('Excluir Produto?', 'Tem certeza que deseja apagar este item permanentemente?', 'Sim, Excluir')) {
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) Toast.show("❌ Erro ao deletar: " + error.message, "error");
          else { Toast.show("Produto excluído!"); onRefresh(); }
       }
    };

    window.deleteCategory = async (id) => {
       if (await ConfirmModal.show('Excluir Categoria?', 'Esta ação removerá a categoria. Produtos sem categoria serão listados como Geral.', 'Sim, Excluir')) {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) Toast.show("❌ Erro ao excluir: " + error.message, "error");
          else { Toast.show("Categoria removida"); onRefresh(); }
       }
    };

    window.cloneAdminProduct = async (id) => {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (prod) {
        container.querySelector('#product-form-title').innerText = 'Clonando: ' + prod.title;
        container.querySelector('#btn-prod-submit').innerText = 'Adicionar como Novo';
        container.querySelector('#product-id').value = '';
        container.querySelector('#prod-title').value = prod.title + ' (Cópia)';
        container.querySelector('#prod-category').value = prod.category_id || '';
        container.querySelector('#prod-description').value = prod.description || '';
        container.querySelector('#prod-price').value = prod.price;
        container.querySelector('#prod-promo').value = prod.promo_price || '';
        container.querySelector('#prod-colors').value = Array.isArray(prod.colors) ? prod.colors.join(', ') : '';
        container.querySelector('#prod-attributes').value = Array.isArray(prod.attributes) ? prod.attributes.join(', ') : '';

        const otherUrls = Array.isArray(prod.image_urls) ? prod.image_urls.filter(u => u !== prod.image_url) : [];
        container.querySelector('#prod-image-urls').value = otherUrls.join(', ');

        const urlProd = container.querySelector('#url-prod');
        urlProd.value = prod.image_url || '';
        const previewContainer = container.querySelector('#container-prod').querySelector('.relative');
        const removeBtn = document.getElementById('remove-prod');

        if (prod.image_url) {
            if (removeBtn) { removeBtn.classList.remove('hidden'); removeBtn.classList.add('flex'); }
            previewContainer.innerHTML = `
                <img src="${prod.image_url}" id="preview-prod" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
                </div>
            `;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.advanceOrderStatus = async (id, nextStatus) => {
      const { error } = await supabase.from('orders').update({ status: nextStatus }).eq('id', id);
      if (error) Toast.show("Erro ao atualizar status: " + error.message, "error");
      else { Toast.show("Status atualizado!"); onRefresh(); }
    };

    window.editAdminProduct = async (id) => {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (prod) {
        container.querySelector('#product-form-title').innerText = 'Editando: ' + prod.title;
        container.querySelector('#btn-prod-submit').innerText = 'Salvar Alterações';
        container.querySelector('#product-id').value = prod.id;
        container.querySelector('#prod-title').value = prod.title;
        container.querySelector('#prod-category').value = prod.category_id || '';
        container.querySelector('#prod-description').value = prod.description || '';
        container.querySelector('#prod-price').value = prod.price;
        container.querySelector('#prod-promo').value = prod.promo_price || '';
        container.querySelector('#prod-colors').value = Array.isArray(prod.colors) ? prod.colors.join(', ') : '';
        container.querySelector('#prod-attributes').value = Array.isArray(prod.attributes) ? prod.attributes.join(', ') : '';

        const otherUrls = Array.isArray(prod.image_urls) ? prod.image_urls.filter(u => u !== prod.image_url) : [];
        container.querySelector('#prod-image-urls').value = otherUrls.join(', ');

        const urlProd = container.querySelector('#url-prod');
        urlProd.value = prod.image_url || '';
        const previewContainer = container.querySelector('#container-prod').querySelector('.relative');
        const removeBtn = document.getElementById('remove-prod');

        if (prod.image_url) {
            if (removeBtn) { removeBtn.classList.remove('hidden'); removeBtn.classList.add('flex'); }
            previewContainer.innerHTML = `
                <img src="${prod.image_url}" id="preview-prod" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
                </div>
            `;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (productForm) {
      productForm.onsubmit = async (e) => {
        e.preventDefault();
        const btnSubmit = container.querySelector('#btn-prod-submit');
        const btnText = container.querySelector('#btn-prod-text');
        const btnLoader = container.querySelector('#btn-prod-loader');

        btnSubmit.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        try {
          let categoryId = categorySelect.value;
          const productId = container.querySelector('#product-id').value;

          if (categoryId === 'new') {
            const catName = newCategoryInput.value;
            const slug = catName.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9 -]/g, '').replace(/\\s+/g, '-');
            const { data: newCat, error: catErr } = await supabase.from('categories').insert({ name: catName, slug }).select().single();
            if (catErr) throw catErr;
            categoryId = newCat.id;
          }

          const priceVal = container.querySelector('#prod-price').value;
          const promoVal = container.querySelector('#prod-promo').value;
          const extraUrls = container.querySelector('#prod-image-urls').value.split(',').map(s => s.trim()).filter(s => s);
          const mainUrl = container.querySelector('#url-prod').value;

          const payload = {
            title: container.querySelector('#prod-title').value,
            category_id: categoryId || null,
            description: container.querySelector('#prod-description').value,
            price: parseFloat(priceVal),
            promo_price: promoVal ? parseFloat(promoVal) : null,
            image_url: mainUrl,
            image_urls: [mainUrl, ...extraUrls].filter(url => url),
            colors: container.querySelector('#prod-colors').value.split(',').map(s => s.trim()).filter(s => s),
            attributes: container.querySelector('#prod-attributes').value.split(',').map(s => s.trim()).filter(s => s)
          };

          let error;
          if (productId) {
            const res = await supabase.from('products').update(payload).eq('id', productId);
            error = res.error;
          } else {
            const res = await supabase.from('products').insert(payload);
            error = res.error;
          }

          if (error) throw error;

          Toast.show("✨ Sucesso! Produto salvo no catálogo.");
          productForm.reset();
          container.querySelector('#prod-image-urls').value = '';
          container.querySelector('#product-id').value = '';
          container.querySelector('#product-form-title').innerText = 'Cadastrar Novo Produto';
          container.querySelector('#btn-prod-submit').innerText = 'Adicionar ao Catálogo';

          const previewContainer = container.querySelector('#container-prod').querySelector('.relative');
          const removeBtn = document.getElementById('remove-prod');
          if (removeBtn) { removeBtn.classList.remove('flex'); removeBtn.classList.add('hidden'); }
          previewContainer.innerHTML = `
              <div id="placeholder-prod" class="text-gray-300">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
              </div>
              <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
              </div>
          `;

          onRefresh();
        } catch (err) {
          Toast.show("❌ Erro ao salvar produto: " + err.message, "error");
          btnSubmit.disabled = false;
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
        }
      };
    }
  }
};
