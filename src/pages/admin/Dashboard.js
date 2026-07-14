import { supabase } from '../../config/supabase.js';
import { injectTheme } from '../../config/theme.js';
import { ImageUpload } from '../../components/ImageUpload.js';
import { Toast } from '../../components/Toast.js';

export const Dashboard = {
  async render() {
    try {
      // 1. Initialize admin tab
      window.currentAdminTab = window.currentAdminTab || 'overview';

      // 2. Fetch tenant settings — filtered by owner_id for merchants
      const { data: { session } } = await supabase.auth.getSession();
      let tenantQuery = supabase.from('tenant_settings').select('*');
      if (session?.user?.id) {
        tenantQuery = tenantQuery.eq('owner_id', session.user.id);
      }
      const { data: tenantData } = await tenantQuery.maybeSingle();

      const tenant = tenantData || {};
      // Niche-specific option labels
      const opt1Label = tenant.option1_label || 'Cores';
      const opt2Label = tenant.option2_label || 'Tamanhos';
      const isConfigured = tenant.store_name && tenant.logo_url && tenant.whatsapp_number;

      // 3. Fetch data filtered by tenant_id (or unassigned items)
      let ordersQuery = supabase.from('orders').select('*').order('created_at', { ascending: false });
      let productsQuery = supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
      let categoriesQuery = supabase.from('categories').select('*').order('name', { ascending: true });

      if (tenant.id) {
        ordersQuery = ordersQuery.or(`tenant_id.eq.${tenant.id},tenant_id.is.null`);
        productsQuery = productsQuery.or(`tenant_id.eq.${tenant.id},tenant_id.is.null`);
        categoriesQuery = categoriesQuery.or(`tenant_id.eq.${tenant.id},tenant_id.is.null`);
      }

      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        ordersQuery,
        productsQuery,
        categoriesQuery
      ]);

      const products = productsRes.data || [];
      const categories = categoriesRes.data || [];
      const orders = ordersRes.data || [];

      // 4. Calculate Sales Statistics
      const activeOrders = orders.filter(o => o.status !== 'cancelled');
      const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const totalOrders = orders.length;
      const averageTicket = activeOrders.length > 0 ? (totalRevenue / activeOrders.length) : 0;
      const activeProducts = products.filter(p => p.is_active !== false).length;

      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      // Render Admin Product List
      const renderAdminProductList = (products, expandedId = null) => {
        return products.map(prod => {
          const isExpanded = prod.id === expandedId;
          const displayPrice = prod.promo_price || prod.price;
          const priceFrom = prod.promo_price ? prod.price : null;
          const temDesconto = priceFrom && Number(priceFrom) > Number(displayPrice);

          return `
            <div class="border border-gray-100 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-900 mb-3 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div onclick="window.toggleAdminProduct('${prod.id}')" class="p-3 flex items-center justify-between bg-gray-55/50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-12 h-12 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0">
                    <img src="${prod.image_url || ''}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-xs font-black text-gray-800 dark:text-gray-100 truncate uppercase tracking-tight">${prod.title}</h4>
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
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      ${prod.colors && prod.colors.length > 0 ? `
                          <div>
                              <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Cores Disponíveis</h5>
                              <div class="flex flex-wrap gap-1">
                                  ${prod.colors.map(c => `<span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">${c}</span>`).join('')}
                              </div>
                          </div>
                      ` : ''}
                      ${prod.attributes && prod.attributes.length > 0 ? `
                          <div>
                              <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tamanhos / Variações</h5>
                              <div class="flex flex-wrap gap-1">
                                  ${prod.attributes.map(a => `<span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">${a}</span>`).join('')}
                              </div>
                          </div>
                      ` : ''}
                    </div>
                </div>
                
                <div class="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" onclick="event.stopPropagation(); window.cloneAdminProduct('${prod.id}')" class="bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                    Clonar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.editAdminProduct('${prod.id}')" class="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-650 dark:text-blue-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Editar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.deleteAdminProduct('${prod.id}')" class="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-650 dark:text-red-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      };

      // Check current tab active styling
      const tabClass = (tab) => window.currentAdminTab === tab
        ? 'bg-lojaPrimaria text-white shadow-lg shadow-lojaPrimaria/20 scale-[1.02]'
        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800/80';

      return `
        <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
          <div class="max-w-7xl mx-auto space-y-6">

            <!-- CABEÇALHO ADMIN PREMIUM -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800/80">
              <div class="flex items-center gap-4">
                ${tenant.logo_url
                  ? `<div class="w-12 h-12 rounded-2xl overflow-hidden border bg-white dark:bg-gray-800 flex items-center justify-center p-1"><img src="${tenant.logo_url}" class="max-h-full max-w-full object-contain" /></div>`
                  : `<div class="w-12 h-12 rounded-2xl bg-lojaPrimaria/10 text-lojaPrimaria flex items-center justify-center font-black uppercase text-lg">${(tenant.store_name || 'V').charAt(0)}</div>`
                }
                <div>
                  <div class="flex items-center gap-2.5">
                    <h1 class="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Painel Administrativo</h1>
                    ${isConfigured
                      ? `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">Configurado</span>`
                      : `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">Pendente</span>`
                    }
                  </div>
                  <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Loja: <span class="text-gray-900 dark:text-gray-200">${tenant.store_name || 'Nova Loja'}</span></p>
                </div>
              </div>

              <!-- CONTROLES DO CABEÇALHO -->
              <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button onclick="window.toggleStoreTheme()" class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold p-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-sm" title="Alternar Tema">
                  <span id="theme-icon">${localStorage.getItem('theme') === 'dark' ? '☀️' : '🌙'}</span>
                </button>
                <a href="/" class="flex-1 lg:flex-none text-center bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 font-black px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-md">
                  Ver Minha Vitrine
                </a>
              </div>
            </div>

            <!-- NAVEGAÇÃO POR ABAS (TABS) -->
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

            <!-- ABA 1: VISÃO GERAL (STATISTICS + PREP FLOW) -->
            <div class="${window.currentAdminTab === 'overview' ? 'block' : 'hidden'} space-y-6 animate-in fade-in duration-300">
              
              <!-- CARDS DE ESTATÍSTICA -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Card 1 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Faturamento</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${formatCurrency(totalRevenue)}</h3>
                    <p class="text-[9px] text-green-500 font-extrabold uppercase mt-1">▲ Pedidos ativos</p>
                  </div>
                </div>
                <!-- Card 2 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pedidos Totais</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${totalOrders}</h3>
                    <p class="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Histórico completo</p>
                  </div>
                </div>
                <!-- Card 3 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ticket Médio</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${formatCurrency(averageTicket)}</h3>
                    <p class="text-[9px] text-lojaPrimaria font-extrabold uppercase mt-1">Média por venda</p>
                  </div>
                </div>
                <!-- Card 4 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Produtos Ativos</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${activeProducts}</h3>
                    <p class="text-[9px] text-indigo-500 font-extrabold uppercase mt-1">Exibidos na vitrine</p>
                  </div>
                </div>
              </div>

              <!-- FLUXO DE PREPARO (KANBAN) -->
              <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight mb-4">Fluxo de Preparo em Tempo Real</h3>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- COLUNA: NOVOS -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                      📥 Novos Pedidos
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${orders.filter(o => o.status === 'pending' || o.status === 'new').map(order => `
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-850 space-y-3 shadow-sm">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${order.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-bold tracking-tight">${new Date(order.created_at).toLocaleDateString()} às ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">Pendente</span>
                          </div>
                          <div class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 italic leading-relaxed">
                            ${order.items_summary || 'Ver no WhatsApp'}
                          </div>
                          <div class="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            <span>Total: <span class="text-lojaPrimaria font-black text-xs">${formatCurrency(order.total_amount)}</span></span>
                            <span>${order.payment_method}</span>
                          </div>
                          <button onclick="window.advanceOrderStatus('${order.id}', 'preparing')" class="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                            🍳 Preparar Pedido
                          </button>
                        </div>
                      `).join('')}
                      ${orders.filter(o => o.status === 'pending' || o.status === 'new').length === 0 ? '<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido novo</p>' : ''}
                    </div>
                  </div>

                  <!-- COLUNA: EM PREPARO -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      🍳 Em Preparação
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${orders.filter(o => o.status === 'preparing').map(order => `
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-850 space-y-3 shadow-sm">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${order.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-bold tracking-tight">${new Date(order.created_at).toLocaleDateString()} às ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">Preparando</span>
                          </div>
                          <div class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 italic leading-relaxed">
                            ${order.items_summary || 'Ver no WhatsApp'}
                          </div>
                          <div class="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            <span>Total: <span class="text-lojaPrimaria font-black text-xs">${formatCurrency(order.total_amount)}</span></span>
                            <span>${order.payment_method}</span>
                          </div>
                          <button onclick="window.advanceOrderStatus('${order.id}', 'shipped')" class="w-full bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                            🚚 Enviar para Entrega
                          </button>
                        </div>
                      `).join('')}
                      ${orders.filter(o => o.status === 'preparing').length === 0 ? '<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido em preparo</p>' : ''}
                    </div>
                  </div>

                  <!-- COLUNA: ENTREGUES / ENVIADOS -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      🚚 Saiu / Entregue
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${orders.filter(o => o.status === 'shipped' || o.status === 'delivered').map(order => `
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-150 dark:border-gray-850 space-y-2 shadow-sm opacity-80 hover:opacity-100 transition">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${order.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-medium">${new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${order.status === 'delivered' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400'}">${order.status === 'delivered' ? 'Entregue' : 'Saiu para Entrega'}</span>
                          </div>
                          <div class="text-[10px] text-gray-600 dark:text-gray-400 font-bold flex justify-between pt-1">
                            <span>Total: <span class="text-green-600 font-black">${formatCurrency(order.total_amount)}</span></span>
                            ${order.status === 'shipped' ? `
                              <button onclick="window.advanceOrderStatus('${order.id}', 'delivered')" class="text-[9px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-950/40 px-2 py-1 rounded-lg">✓ Concluir</button>
                            ` : ''}
                          </div>
                        </div>
                      `).join('')}
                      ${orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length === 0 ? '<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido finalizado</p>' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ABA 2: CATALOGO (PRODUTOS) -->
            <div class="${window.currentAdminTab === 'catalog' ? 'block' : 'hidden'} grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              <!-- FORMULÁRIO DE CADASTRO -->
              <div class="lg:col-span-5 space-y-6">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight" id="product-form-title">Cadastrar Novo Produto</h3>
                  
                  <form id="admin-product-form" class="space-y-4">
                    <input type="hidden" id="product-id" value="" />
                    
                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título do Produto *</label>
                       <input type="text" id="prod-title" required class="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-xl p-3.5 text-xs font-bold text-gray-955 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-lojaPrimaria" placeholder="Ex: Camiseta Premium Algodão" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Categoria *</label>
                         <select id="prod-category" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100">
                            <option value="" disabled selected>Selecionar...</option>
                            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            <option value="new">+ Criar Nova Categoria</option>
                         </select>
                      </div>
                      <div class="flex items-end">
                         <input type="text" id="new-category-name" class="hidden w-full bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 focus:outline-none" placeholder="Nome da Categoria" />
                      </div>
                    </div>

                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Descrição Curta</label>
                       <textarea id="prod-description" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-24 focus:outline-none" placeholder="Detalhes, especificações e cuidados com o produto..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço Original (R$) *</label>
                         <input type="number" step="0.01" id="prod-price" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="R$ 99,90" />
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço Promocional (R$)</label>
                         <input type="number" step="0.01" id="prod-promo" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="R$ 79,90" />
                      </div>
                    </div>

                    <div class="bg-gray-50/50 dark:bg-gray-950/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      ${ImageUpload.render('prod', '', 'Foto Principal do Produto')}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">${opt1Label}</label>
                         <input type="text" id="prod-colors" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Separe por vírgula" />
                         <div id="colors-preview" class="flex flex-wrap gap-1 mt-1.5 min-h-[16px]"></div>
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">${opt2Label}</label>
                         <input type="text" id="prod-attributes" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Separe por vírgula" />
                         <div id="attrs-preview" class="flex flex-wrap gap-1 mt-1.5 min-h-[16px]"></div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Outras Imagens (URLs separadas por vírgula)</label>
                      <textarea id="prod-image-urls" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-20" placeholder="https://site.com/imagem2.jpg, https://site.com/imagem3.jpg"></textarea>
                    </div>

                    <button type="submit" id="btn-prod-submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition uppercase text-xs tracking-widest">
                       Adicionar ao Catálogo
                    </button>
                  </form>
                </div>
              </div>

              <!-- LISTAGEM DO CATALOGO -->
              <div class="lg:col-span-7 space-y-6">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Produtos no Catálogo (${products.length})</h3>
                  </div>
                  <div class="grid grid-cols-1 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin" id="admin-product-list">
                    ${renderAdminProductList(products, window.currentExpandedId)}
                  </div>
                </div>
              </div>
            </div>

            <!-- ABA 3: CATEGORIAS -->
            <div class="${window.currentAdminTab === 'categories' ? 'block' : 'hidden'} max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 animate-in fade-in duration-300">
               <div>
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Gerenciador de Categorias</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Crie e exclua categorias para classificar os seus produtos.</p>
               </div>

               <!-- Form simples de Categoria -->
               <form id="admin-direct-category-form" class="flex gap-2">
                 <input type="text" id="direct-cat-name" required class="flex-grow bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Ex: Calçados, Acessórios" />
                 <button type="submit" class="bg-lojaPrimaria text-white font-black px-6 py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-1.5 shadow-sm">
                   Adicionar
                 </button>
               </form>

               <div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                  ${categories.map(cat => `
                    <div class="flex items-center justify-between bg-gray-55/50 dark:bg-gray-950/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-red-100 dark:hover:border-red-950/30 transition">
                       <div>
                         <span class="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest">${cat.name}</span>
                         <span class="block text-[9px] text-gray-400 font-mono mt-0.5">Slug: ${cat.slug}</span>
                       </div>
                       <button onclick="window.deleteCategory('${cat.id}')" class="text-gray-300 hover:text-red-605 transition p-2 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-xl">
                            <svg xmlns="http://www.w3.org/2050/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  `).join('')}
                  ${categories.length === 0 ? '<p class="text-center text-gray-400 py-6 text-xs uppercase tracking-widest font-bold">Nenhuma categoria cadastrada</p>' : ''}
               </div>
            </div>

            <!-- ABA 4: HISTÓRICO DE PEDIDOS -->
            <div class="${window.currentAdminTab === 'orders' ? 'block' : 'hidden'} space-y-6 animate-in fade-in duration-300">
               <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h2 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                     Central Histórica de Pedidos
                  </h2>

                  <div class="space-y-8">
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
                                 <span class="text-[9px] font-black text-gray-450 dark:text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">Pedidos de ${date}</span>
                                 <div class="h-px bg-gray-100 dark:bg-gray-800/80 w-full"></div>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 ${items.map(order => {
                                    let statusColor = 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20';
                                    if (order.status === 'preparing') statusColor = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20';
                                    if (order.status === 'shipped') statusColor = 'bg-purple-50 text-purple-600 dark:bg-purple-950/20';
                                    if (order.status === 'delivered') statusColor = 'bg-green-50 text-green-600 dark:bg-green-950/20';
                                    if (order.status === 'cancelled') statusColor = 'bg-red-50 text-red-650 dark:bg-red-950/20';

                                    return `
                                    <div class="bg-gray-55/50 dark:bg-gray-900/50 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 space-y-4 hover:border-lojaPrimaria/30 transition group shadow-sm">
                                       <div class="flex justify-between items-start">
                                          <div>
                                             <p class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">#${order.id.slice(0, 8)} • ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                             <h4 class="text-xs font-black text-gray-950 dark:text-white uppercase tracking-tight">${order.customer_name}</h4>
                                          </div>
                                          <span class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${statusColor}">${order.status}</span>
                                       </div>

                                       <div class="space-y-2">
                                          <div class="text-[10px] text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 p-3 rounded-xl border border-gray-100 dark:border-gray-850/80 leading-relaxed italic">
                                             ${order.items_summary || 'Itens não especificados'}
                                          </div>
                                       </div>

                                       <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Entrega</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase truncate">${order.delivery_address ? 'Delivery' : 'Retirada'}</p>
                                          </div>
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Pagamento</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">${order.payment_method}</p>
                                          </div>
                                          <div class="col-span-2 text-right pt-2 border-t border-gray-100 dark:border-gray-800/50">
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Total</p>
                                             <p class="text-sm font-black text-lojaPrimaria">${formatCurrency(order.total_amount)}</p>
                                          </div>
                                       </div>

                                       <div class="flex gap-2">
                                          <button onclick="window.advanceOrderStatus('${order.id}', '${order.status === 'pending' ? 'preparing' : (order.status === 'preparing' ? 'shipped' : 'delivered')}')" class="flex-1 bg-white dark:bg-gray-800 border border-gray-205 dark:border-gray-700 hover:border-lojaPrimaria text-gray-900 dark:text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition shadow-sm">
                                             Status
                                          </button>
                                          <button onclick="window.advanceOrderStatus('${order.id}', 'cancelled')" class="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition">
                                             ✕ Cancelar
                                          </button>
                                       </div>
                                    </div>
                                    `;
                                 }).join('')}
                              </div>
                           </div>
                        `).join('');
                     })()}
                     ${orders.length === 0 ? '<p class="text-center text-gray-400 dark:text-gray-500 py-12 text-xs uppercase tracking-widest font-black">Nenhum pedido registrado no sistema</p>' : ''}
                  </div>
               </div>
            </div>

            <!-- ABA 5: CONFIGURAÇÕES DA LOJA -->
            <div class="${window.currentAdminTab === 'settings' ? 'block' : 'hidden'} max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div class="p-6 border-b border-gray-50 dark:border-gray-850/80 bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Identidade & Configurações da Vitrine</h3>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure o visual, contato do WhatsApp e cores do tema.</p>
                  </div>

                  <form id="admin-tenant-form" class="p-6 space-y-6 bg-white dark:bg-gray-900">
                    
                    <!-- Bloco Identidade -->
                    <div class="space-y-4">
                      <h4 class="text-xs font-black text-lojaPrimaria uppercase tracking-wider border-b pb-2 dark:border-gray-800">Identidade da Loja</h4>
                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome da Loja *</label>
                        <input type="text" id="conf-name" value="${tenant.store_name || ''}" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100 focus:ring-2 focus:ring-lojaPrimaria" />
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2 bg-gray-50/30 dark:bg-gray-955/40 p-4 rounded-2xl border dark:border-gray-850">
                          ${ImageUpload.render('logo', tenant.logo_url, 'Logotipo da Loja')}
                          ${tenant.logo_url ? `<button type="button" onclick="window.removeTenantMedia('logo')" class="text-[9px] font-black uppercase text-red-650 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg hover:bg-red-100/50 transition">✕ Remover Imagem</button>` : ''}
                        </div>
                        <div class="space-y-2 bg-gray-50/30 dark:bg-gray-955/40 p-4 rounded-2xl border dark:border-gray-850">
                          ${ImageUpload.render('hero', tenant.hero_image_url, 'Banner Hero da Vitrine')}
                          ${tenant.hero_image_url ? `<button type="button" onclick="window.removeTenantMedia('hero')" class="text-[9px] font-black uppercase text-red-650 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg hover:bg-red-100/50 transition">✕ Remover Imagem</button>` : ''}
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título do Hero (Banner)</label>
                          <input type="text" id="conf-hero-title" value="${tenant.hero_title || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Ex: Nova Coleção de Verão" />
                        </div>
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Subtítulo do Hero</label>
                          <input type="text" id="conf-hero-subtitle" value="${tenant.hero_subtitle || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Ex: Até 50% de Desconto" />
                        </div>
                      </div>

                      <div class="pt-2">
                         <label class="flex items-center gap-3 cursor-pointer group">
                           <div class="relative">
                             <input type="checkbox" id="conf-show-hero-text" ${tenant.footer_bio !== 'HIDE_HERO_TEXT' ? 'checked' : ''} class="sr-only peer" />
                             <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lojaPrimaria"></div>
                           </div>
                           <span class="text-[10px] font-black text-gray-500 dark:text-gray-450 uppercase tracking-widest group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Exibir título e subtítulo sobre o Banner Hero</span>
                         </label>
                      </div>
                    </div>

                    <!-- Bloco Aparência e Cores -->
                    <div class="space-y-4 pt-4 border-t dark:border-gray-800">
                      <h4 class="text-xs font-black text-lojaPrimaria uppercase tracking-wider border-b pb-2 dark:border-gray-800">Cores da Identidade Visual</h4>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Primária</label>
                          <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-955 rounded-xl p-1.5 pr-4 border dark:border-gray-850">
                            <input type="color" id="conf-primary" value="${tenant.primary_color || '#3b82f6'}" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer" />
                            <span class="text-xs font-mono font-black text-gray-600 dark:text-gray-400 uppercase">${tenant.primary_color || '#3b82f6'}</span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Secundária</label>
                          <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-955 rounded-xl p-1.5 pr-4 border dark:border-gray-850">
                            <input type="color" id="conf-secondary" value="${tenant.secondary_color || '#1e3a8a'}" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer" />
                            <span class="text-xs font-mono font-black text-gray-600 dark:text-gray-400 uppercase">${tenant.secondary_color || '#1e3a8a'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Bloco Contato e Entrega -->
                    <div class="space-y-4 pt-4 border-t dark:border-gray-800">
                      <h4 class="text-xs font-black text-lojaPrimaria uppercase tracking-wider border-b pb-2 dark:border-gray-800">Contato, Endereço & Redes</h4>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp (Ex: 5511999999999) *</label>
                          <input type="text" id="conf-phone" value="${tenant.whatsapp_number || ''}" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Código do país + DDD + Número" />
                        </div>
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Taxa de Entrega Padrão (R$)</label>
                          <input type="number" step="0.01" id="conf-delivery-fee" value="${tenant.delivery_fee || '0.00'}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Endereço Físico</label>
                        <input type="text" id="conf-address" value="${tenant.address || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Rua das Flores, 123 - São Paulo" />
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Link do Instagram (URL)</label>
                           <input type="text" id="conf-instagram" value="${tenant.instagram_url || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="https://instagram.com/sualoja" />
                        </div>
                        <div>
                           <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Link do Facebook (URL)</label>
                           <input type="text" id="conf-facebook" value="${tenant.facebook_url || ''}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="https://facebook.com/sualoja" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Biografia / Rodapé Curto</label>
                        <textarea id="conf-footer-bio" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-20" placeholder="Uma breve descrição sobre sua loja para exibir no rodapé da página.">${(tenant.footer_bio && tenant.footer_bio !== 'SHOW_HERO_TEXT' && tenant.footer_bio !== 'HIDE_HERO_TEXT') ? tenant.footer_bio : ''}</textarea>
                      </div>
                    </div>

                    <button type="submit" id="btn-save-tenant" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-lg shadow-lojaPrimaria/25 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest mt-4">
                      <span id="btn-save-text">Salvar Alterações da Loja</span>
                      <div id="btn-save-loader" class="hidden animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    </button>
                  </form>
                </div>
            </div>

          </div>
        </div>

        <!-- MODAL DE EXCLUSÃO DE PRODUTO -->
        <div id="delete-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 hidden">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
            <h3 class="text-center text-lg font-black text-gray-900 dark:text-gray-100 mb-2">Excluir Produto?</h3>
            <p class="text-center text-gray-500 dark:text-gray-450 text-xs font-bold uppercase tracking-widest mb-2">Você quer excluir permanentemente o item <span id="delete-item-name" class="text-red-500 font-black"></span>?</p>
            <p class="text-center text-red-500 text-[9px] font-black uppercase tracking-[0.2em] mb-8 opacity-60">Essa operação não poderá ser revertida</p>
            <div class="grid grid-cols-2 gap-4">
              <button id="btn-cancel-delete" class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 transition">Cancelar</button>
              <button id="btn-confirm-delete" class="bg-red-500 hover:bg-red-650 text-white font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-lg shadow-red-500/20">Sim, Excluir</button>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      return `<div class="p-20 text-center font-black uppercase text-red-500">Erro de Conexão com o Supabase. Verifique sua chave API.</div>`;
    }
  },

  bindEvents(container, onRefresh) {
    const tenantForm = container.querySelector('#admin-tenant-form');
    const productForm = container.querySelector('#admin-product-form');
    const categorySelect = container.querySelector('#prod-category');
    const newCategoryInput = container.querySelector('#new-category-name');
    const directCategoryForm = container.querySelector('#admin-direct-category-form');

    // Live tag previews for colors and sizes
    const colorsInput = container.querySelector('#prod-colors');
    const colorsPreview = container.querySelector('#colors-preview');
    const attrsInput = container.querySelector('#prod-attributes');
    const attrsPreview = container.querySelector('#attrs-preview');

    const updateTagPreview = (input, previewContainer) => {
      if (!input || !previewContainer) return;
      const values = input.value.split(',').map(s => s.trim()).filter(s => s);
      previewContainer.innerHTML = values.map(val => `
        <span class="inline-flex items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase border border-gray-200 dark:border-gray-700">
          ${val}
        </span>
      `).join('');
    };

    if (colorsInput && colorsPreview) {
      colorsInput.oninput = () => updateTagPreview(colorsInput, colorsPreview);
      updateTagPreview(colorsInput, colorsPreview);
    }
    if (attrsInput && attrsPreview) {
      attrsInput.oninput = () => updateTagPreview(attrsInput, attrsPreview);
      updateTagPreview(attrsInput, attrsPreview);
    }

    // Bind Image Upload utilities
    ImageUpload.bindEvents('logo', (url) => { if(!url) container.querySelector('#url-logo').value = ''; });
    ImageUpload.bindEvents('hero', (url) => { if(!url) container.querySelector('#url-hero').value = ''; });
    ImageUpload.bindEvents('prod', (url) => { if(!url) container.querySelector('#url-prod').value = ''; });

    window.removeTenantMedia = async (type) => {
       const field = type === 'logo' ? 'logo_url' : 'hero_image_url';
       const { data: tenant } = await supabase.from('tenant_settings').select('id').maybeSingle();
       if (tenant) {
          const { error } = await supabase.from('tenant_settings').update({ [field]: null }).eq('id', tenant.id);
          if (error) {
            Toast.show("Erro ao remover: " + error.message, "error");
          } else {
            Toast.show("Imagem removida com sucesso!");
            onRefresh();
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
      if (icon) icon.innerText = isDark ? '☀️' : '🌙';
    };

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      const icon = container.querySelector('#theme-icon');
      if (icon) icon.innerText = '☀️';
    }

    if (categorySelect) {
      categorySelect.onchange = () => {
        if (categorySelect.value === 'new') {
          newCategoryInput.classList.remove('hidden');
          newCategoryInput.required = true;
          newCategoryInput.focus();
        } else {
          newCategoryInput.classList.add('hidden');
          newCategoryInput.required = false;
        }
      };
    }

    // Direct Category Creation Form
    if (directCategoryForm) {
      directCategoryForm.onsubmit = async (e) => {
        e.preventDefault();
        const inputName = container.querySelector('#direct-cat-name');
        const catName = inputName.value.trim();
        if (!catName) return;

        try {
          const slug = catName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
          const { data: tenant } = await supabase.from('tenant_settings').select('id').maybeSingle();

          const { error } = await supabase.from('categories').insert({
            name: catName,
            slug,
            tenant_id: tenant?.id || null
          });

          if (error) throw error;
          Toast.show("Categoria criada com sucesso!");
          inputName.value = '';
          onRefresh();
        } catch (err) {
          Toast.show("Erro ao criar categoria: " + err.message, "error");
        }
      };
    }

    // Tenant/Store Configuration Save
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
            hero_title: container.querySelector('#conf-hero-title').value,
            hero_subtitle: container.querySelector('#conf-hero-subtitle').value,
            whatsapp_number: container.querySelector('#conf-phone').value,
            delivery_fee: parseFloat(container.querySelector('#conf-delivery-fee').value || 0),
            address: container.querySelector('#conf-address').value,
            primary_color: container.querySelector('#conf-primary').value,
            secondary_color: container.querySelector('#conf-secondary').value,
            instagram_url: container.querySelector('#conf-instagram').value,
            facebook_url: container.querySelector('#conf-facebook').value,
            footer_bio: container.querySelector('#conf-footer-bio').value || (container.querySelector('#conf-show-hero-text').checked ? 'SHOW_HERO_TEXT' : 'HIDE_HERO_TEXT')
          };

          // Override footer_bio if show_hero_text check is critical for status
          if (!updatedData.footer_bio) {
             updatedData.footer_bio = container.querySelector('#conf-show-hero-text').checked ? 'SHOW_HERO_TEXT' : 'HIDE_HERO_TEXT';
          }

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
            Toast.show("Configurações da loja salvas com sucesso!");
            onRefresh();
          } else {
            throw error;
          }
        } catch (err) {
          Toast.show("Erro ao salvar: " + err.message, "error");
          btnSave.disabled = false;
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
        }
      };
    }

    const deleteModal = container.querySelector('#delete-modal');
    const deleteItemName = container.querySelector('#delete-item-name');
    const btnCancelDelete = container.querySelector('#btn-cancel-delete');
    const btnConfirmDelete = container.querySelector('#btn-confirm-delete');
    let itemToDelete = null;

    window.toggleAdminProduct = (id) => {
      window.currentExpandedId = window.currentExpandedId === id ? null : id;
      onRefresh();
    };

    window.deleteAdminProduct = async (id) => {
      const { data: prod } = await supabase.from('products').select('title').eq('id', id).single();
      itemToDelete = id;
      deleteItemName.innerText = prod?.title || "este produto";
      deleteModal.classList.remove('hidden');
    };

    window.deleteCategory = async (id) => {
       if (confirm('Atenção: Excluir esta categoria poderá desvincular produtos. Deseja prosseguir com a exclusão?')) {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) {
            Toast.show("Erro ao excluir: " + error.message, "error");
          } else {
            Toast.show("Categoria removida com sucesso!");
            onRefresh();
          }
       }
    };

    btnCancelDelete.onclick = () => deleteModal.classList.add('hidden');
    btnConfirmDelete.onclick = async () => {
      const { error } = await supabase.from('products').delete().eq('id', itemToDelete);
      if (error) {
        Toast.show("Erro ao deletar produto: " + error.message, "error");
      } else {
        Toast.show("Produto excluído do catálogo!");
      }
      deleteModal.classList.add('hidden');
      onRefresh();
    };

    window.cloneAdminProduct = async (id) => {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (prod) {
        window.currentAdminTab = 'catalog';
        onRefresh();
        
        setTimeout(() => {
          const formTitle = container.querySelector('#product-form-title');
          const submitBtn = container.querySelector('#btn-prod-submit');
          if (formTitle) formTitle.innerText = 'Clonando: ' + prod.title;
          if (submitBtn) submitBtn.innerText = 'Adicionar como Novo';

          container.querySelector('#product-id').value = '';
          container.querySelector('#prod-title').value = prod.title + ' (Cópia)';
          container.querySelector('#prod-category').value = prod.category_id || '';
          container.querySelector('#prod-description').value = prod.description || '';
          container.querySelector('#prod-price').value = prod.price;
          container.querySelector('#prod-promo').value = prod.promo_price || '';
          const colorsInputEl = container.querySelector('#prod-colors');
          const attributesInputEl = container.querySelector('#prod-attributes');
          colorsInputEl.value = Array.isArray(prod.colors) ? prod.colors.join(', ') : '';
          attributesInputEl.value = Array.isArray(prod.attributes) ? prod.attributes.join(', ') : '';
          colorsInputEl.dispatchEvent(new Event('input'));
          attributesInputEl.dispatchEvent(new Event('input'));

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
        }, 100);
      }
    };

    window.advanceOrderStatus = async (id, nextStatus) => {
      const { error } = await supabase.from('orders').update({ status: nextStatus }).eq('id', id);
      if (error) {
        Toast.show("Erro ao atualizar status do pedido: " + error.message, "error");
      } else {
        Toast.show("Status do pedido atualizado!");
        onRefresh();
      }
    };

    window.editAdminProduct = async (id) => {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (prod) {
        window.currentAdminTab = 'catalog';
        onRefresh();

        setTimeout(() => {
          const formTitle = container.querySelector('#product-form-title');
          const submitBtn = container.querySelector('#btn-prod-submit');
          if (formTitle) formTitle.innerText = 'Editando: ' + prod.title;
          if (submitBtn) submitBtn.innerText = 'Salvar Alterações';

          container.querySelector('#product-id').value = prod.id;
          container.querySelector('#prod-title').value = prod.title;
          container.querySelector('#prod-category').value = prod.category_id || '';
          container.querySelector('#prod-description').value = prod.description || '';
          container.querySelector('#prod-price').value = prod.price;
          container.querySelector('#prod-promo').value = prod.promo_price || '';
          const colorsInputEl = container.querySelector('#prod-colors');
          const attributesInputEl = container.querySelector('#prod-attributes');
          colorsInputEl.value = Array.isArray(prod.colors) ? prod.colors.join(', ') : '';
          attributesInputEl.value = Array.isArray(prod.attributes) ? prod.attributes.join(', ') : '';
          colorsInputEl.dispatchEvent(new Event('input'));
          attributesInputEl.dispatchEvent(new Event('input'));

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
        }, 100);
      }
    };

    if (productForm) {
      productForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
          let categoryId = categorySelect.value;
          const productId = container.querySelector('#product-id').value;

          const { data: tenant } = await supabase.from('tenant_settings').select('id').maybeSingle();

          if (categoryId === 'new') {
            const catName = newCategoryInput.value;
            const slug = catName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
            const { data: newCat, error: catErr } = await supabase.from('categories').insert({ name: catName, slug, tenant_id: tenant?.id || null }).select().single();
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
            attributes: container.querySelector('#prod-attributes').value.split(',').map(s => s.trim()).filter(s => s),
            tenant_id: tenant?.id || null
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

          Toast.show("Produto salvo no catálogo com sucesso!");
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
          Toast.show("Erro ao salvar produto: " + err.message, "error");
        }
      };
    }
  }
};
