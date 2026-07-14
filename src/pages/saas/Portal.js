import { supabase } from '../../config/supabase.js';

/**
 * SaaS Landing Portal
 * Displayed when no ?store= or ?page= param exists.
 * Lists all active tenant stores.
 */
export const Portal = {
  async render() {
    try {
      const { data: stores, error } = await supabase
        .from('tenant_settings')
        .select('id, store_name, slug, logo_url, hero_image_url, hero_title, hero_subtitle, whatsapp_number, primary_color')
        .order('store_name', { ascending: true });

      if (error) throw error;

      const storeList = stores || [];

      return `
        <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">

          <!-- Hero Header -->
          <header class="relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-transparent to-transparent pointer-events-none"></div>
            <div class="max-w-6xl mx-auto px-6 pt-16 pb-20 relative z-10 text-center">
              <div class="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-8">
                <span class="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>
                Plataforma Multi-Nicho
              </div>
              <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                Catálogo
                <span class="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pro</span>
              </h1>
              <p class="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                Descubra os melhores catálogos digitais e conclua suas compras diretamente no WhatsApp.
              </p>

              <div class="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                <a href="/?page=admin" class="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-violet-900/50 hover:scale-[1.02] active:scale-[0.98]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Painel Administrativo
                </a>
                <a href="#lojas" class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all">
                  Ver todas as lojas
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                </a>
              </div>
            </div>
          </header>

          <!-- Stats Bar -->
          <div class="border-y border-white/5 bg-white/[0.02] py-6">
            <div class="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
              <div>
                <p class="text-3xl font-black text-white">${storeList.length}</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Lojas Ativas</p>
              </div>
              <div>
                <p class="text-3xl font-black text-white">Multi</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Nichos</p>
              </div>
              <div>
                <p class="text-3xl font-black text-white">WhatsApp</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Checkout</p>
              </div>
            </div>
          </div>

          <!-- Store Listing -->
          <main id="lojas" class="max-w-6xl mx-auto px-6 py-16">
            <!-- Search -->
            <div class="mb-10 max-w-md">
              <div class="relative">
                <input
                  type="text"
                  id="portal-search"
                  placeholder="Buscar loja..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/10 transition"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <div id="portal-stores-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${this.renderStores(storeList)}
            </div>

            ${storeList.length === 0 ? `
              <div class="text-center py-24 space-y-4">
                <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-4xl">🏪</div>
                <h3 class="text-xl font-black text-gray-300">Nenhuma loja cadastrada ainda</h3>
                <p class="text-gray-600 text-sm">Acesse o painel de Super Admin para adicionar a primeira loja.</p>
                <a href="/?page=admin" class="inline-block mt-4 bg-violet-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-violet-500 transition">
                  Acessar Painel
                </a>
              </div>
            ` : ''}
          </main>

          <!-- Footer -->
          <footer class="border-t border-white/5 py-10 text-center">
            <p class="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">© 2026 CatálogoPro · Plataforma SaaS Multi-Nicho</p>
          </footer>
        </div>
      `;
    } catch (err) {
      console.error('Erro ao carregar portal:', err);
      return `
        <div class="min-h-screen flex items-center justify-center bg-gray-950 text-white">
          <div class="text-center p-8 space-y-4">
            <h2 class="text-2xl font-black">Erro ao carregar o portal</h2>
            <p class="text-gray-500">${err.message}</p>
            <button onclick="location.reload()" class="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold">Tentar novamente</button>
          </div>
        </div>
      `;
    }
  },

  renderStores(stores) {
    if (!stores.length) return '';
    return stores.map(store => {
      const slug = store.slug || store.id;
      const bgStyle = store.hero_image_url
        ? `style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${store.hero_image_url}'); background-size: cover; background-position: center;"`
        : `style="background: linear-gradient(135deg, ${store.primary_color || '#6d28d9'}33, ${store.primary_color || '#6d28d9'}11);"`;

      return `
        <a href="/?store=${slug}" class="js-store-card group relative rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-900/30 block" data-name="${(store.store_name || '').toLowerCase()}">
          <div class="h-52 flex flex-col justify-between p-6" ${bgStyle}>
            <div class="flex items-start justify-between">
              ${store.logo_url
                ? `<img src="${store.logo_url}" class="h-12 w-12 rounded-2xl object-cover border-2 border-white/20 shadow-lg" onerror="this.style.display='none'" />`
                : `<div class="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white" style="background:${store.primary_color || '#6d28d9'}44">${(store.store_name || '?').charAt(0).toUpperCase()}</div>`
              }
              <span class="text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/10">
                Aberta
              </span>
            </div>
            <div>
              <h3 class="text-lg font-black text-white leading-tight group-hover:text-violet-200 transition">${store.store_name || slug}</h3>
              ${store.hero_subtitle ? `<p class="text-xs text-white/60 mt-1 line-clamp-1">${store.hero_subtitle}</p>` : ''}
            </div>
          </div>
          <div class="bg-white/[0.03] border-t border-white/5 px-6 py-4 flex items-center justify-between">
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">/${slug}</span>
            <span class="text-[10px] font-black text-violet-400 uppercase tracking-widest group-hover:text-violet-300 flex items-center gap-1 transition">
              Visitar
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </a>
      `;
    }).join('');
  },

  bindEvents(container) {
    const searchInput = container.querySelector('#portal-search');
    if (!searchInput) return;

    searchInput.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      container.querySelectorAll('.js-store-card').forEach(card => {
        const name = card.dataset.name || '';
        card.style.display = name.includes(query) ? '' : 'none';
      });
    };
  }
};
