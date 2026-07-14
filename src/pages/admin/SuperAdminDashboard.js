import { supabase } from '../../config/supabase.js';
import { Toast } from '../../components/Toast.js';
import { ImageUpload } from '../../components/ImageUpload.js';
import { injectTheme } from '../../config/theme.js';

/**
 * Super Admin Dashboard
 * Only accessible to the super admin email configured in VITE_SUPER_ADMIN_EMAIL.
 * Provides full tenant management: create, edit, delete stores.
 */
export const SuperAdminDashboard = {
  async render() {
    try {
      window.superAdminTab = window.superAdminTab || 'tenants';

      const { data: tenants, error } = await supabase
        .from('tenant_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const stores = tenants || [];

      const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';

      return `
        <div class="min-h-screen bg-gray-950 text-white">
          <!-- Top Navigation Bar -->
          <header class="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/5 px-6 py-4">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h1 class="text-sm font-black text-white uppercase tracking-tight">Super Admin</h1>
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">CatálogoPro Platform</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  ${stores.length} lojas ativas
                </span>
                <a href="/" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition px-3 py-2 rounded-xl hover:bg-white/5">
                  ← Portal
                </a>
                <button id="super-logout-btn" class="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition">
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">

            <!-- Tabs -->
            <nav class="flex gap-2">
              ${[
                { id: 'tenants', label: '🏪 Gerenciar Lojas' },
                { id: 'create', label: '+ Nova Loja' },
              ].map(t => `
                <button onclick="window.superAdminTab='${t.id}'; window.refreshSuperAdmin()" 
                  class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition border ${window.superAdminTab === t.id
                    ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/30'
                    : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300'}">
                  ${t.label}
                </button>
              `).join('')}
            </nav>

            <!-- Tenants List Tab -->
            <div class="${window.superAdminTab === 'tenants' ? 'block' : 'hidden'} space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xs font-black text-gray-500 uppercase tracking-widest">Todos os Lojistas (${stores.length})</h2>
              </div>

              ${stores.length === 0 ? `
                <div class="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
                  <div class="text-6xl">🏪</div>
                  <p class="text-gray-500 font-bold">Nenhuma loja cadastrada.</p>
                  <button onclick="window.superAdminTab='create'; window.refreshSuperAdmin()" class="bg-violet-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-violet-500 transition">
                    Criar primeira loja
                  </button>
                </div>
              ` : stores.map(store => `
                <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-violet-500/30 hover:bg-white/[0.05] transition group">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    ${store.logo_url
                      ? `<img src="${store.logo_url}" class="w-14 h-14 rounded-2xl object-cover border border-white/10 flex-shrink-0" onerror="this.style.display='none'" />`
                      : `<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0" style="background:${store.primary_color || '#6d28d9'}33; color:${store.primary_color || '#a78bfa'}">${(store.store_name || '?').charAt(0)}</div>`
                    }
                    <div class="min-w-0">
                      <h3 class="font-black text-white text-sm uppercase tracking-tight truncate">${store.store_name || '(sem nome)'}</h3>
                      <p class="text-[10px] text-gray-600 font-bold mt-0.5">slug: <span class="text-violet-400">/${store.slug || store.id}</span></p>
                      <p class="text-[10px] text-gray-700 font-bold">WhatsApp: ${store.whatsapp_number || '—'} · Criado em ${formatDate(store.created_at)}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <a href="/?store=${store.slug || store.id}" target="_blank" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-violet-400 transition px-3 py-2 rounded-xl border border-white/10 hover:border-violet-500/30">
                      Ver Vitrine ↗
                    </a>
                    <button onclick="window.superAdminEditTenant('${store.id}')" class="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition px-3 py-2 rounded-xl border border-blue-500/20 hover:border-blue-500/40">
                      Editar
                    </button>
                    <button onclick="window.superAdminDeleteTenant('${store.id}', '${store.store_name || store.id}')" class="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition px-3 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40">
                      Excluir
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Create Tenant Tab -->
            <div class="${window.superAdminTab === 'create' ? 'block' : 'hidden'} max-w-2xl">
              <div class="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                <div class="p-6 border-b border-white/5">
                  <h2 class="font-black text-white text-sm uppercase tracking-tight">Nova Loja</h2>
                  <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Preencha os dados para cadastrar um novo lojista</p>
                </div>
                <form id="super-create-tenant-form" class="p-6 space-y-5">
                  <input type="hidden" id="edit-tenant-id" value="" />

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome da Loja *</label>
                      <input type="text" id="t-store-name" required placeholder="Ex: Pizzaria Roma"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Slug Único *</label>
                      <input type="text" id="t-slug" required placeholder="pizzaria-roma"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      <p class="text-[9px] text-gray-700 mt-1">URL: /?store=<span id="slug-preview" class="text-violet-400">...</span></p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp *</label>
                      <input type="text" id="t-whatsapp" required placeholder="5511999999999"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">E-mail do Proprietário</label>
                      <input type="email" id="t-owner-email" placeholder="lojista@email.com"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      <p class="text-[9px] text-gray-700 mt-1">Vincula ao login do lojista no painel</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título Hero</label>
                      <input type="text" id="t-hero-title" placeholder="Os melhores sabores da cidade"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Subtítulo Hero</label>
                      <input type="text" id="t-hero-subtitle" placeholder="Peça agora pelo WhatsApp"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Primária</label>
                      <div class="flex items-center gap-3">
                        <input type="color" id="t-primary-color" value="#6d28d9" class="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                        <input type="text" id="t-primary-color-hex" value="#6d28d9"
                          class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Secundária</label>
                      <div class="flex items-center gap-3">
                        <input type="color" id="t-secondary-color" value="#4c1d95" class="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                        <input type="text" id="t-secondary-color-hex" value="#4c1d95"
                          class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                    </div>
                  </div>

                  <!-- Niche Configuration -->
                  <div class="border-t border-white/5 pt-5 space-y-4">
                    <h4 class="text-[10px] font-black text-violet-400 uppercase tracking-widest">Configuração de Nicho</h4>
                    <p class="text-[10px] text-gray-600">Defina os rótulos dos atributos de produto para este nicho (ex: restaurante → "Adicionais" e "Bebida"; vestuário → "Tamanho" e "Cor")</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Rótulo Opção 1</label>
                        <input type="text" id="t-option1-label" placeholder="Ex: Tamanho / Adicionais"
                          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                      <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Rótulo Opção 2</label>
                        <input type="text" id="t-option2-label" placeholder="Ex: Cor / Bebida"
                          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nicho / Segmento</label>
                      <select id="t-niche" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 transition">
                        <option value="">Selecionar nicho</option>
                        <option value="fashion">👗 Moda & Vestuário</option>
                        <option value="food">🍕 Restaurante & Alimentação</option>
                        <option value="beauty">💄 Beleza & Estética</option>
                        <option value="electronics">📱 Eletrônicos & Tech</option>
                        <option value="pets">🐾 Pet Shop</option>
                        <option value="home">🏠 Casa & Decoração</option>
                        <option value="sports">⚽ Esportes & Lazer</option>
                        <option value="other">🏪 Outros</option>
                      </select>
                    </div>
                  </div>

                  <div class="pt-2">
                    <button type="submit" id="btn-super-save-tenant" class="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-violet-900/40 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                      Salvar Loja
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error('Erro ao renderizar Super Admin:', err);
      return `<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white text-center p-8">
        <div><h2 class="text-2xl font-black mb-2">Erro</h2><p class="text-gray-500">${err.message}</p></div>
      </div>`;
    }
  },

  bindEvents(container, onRefresh) {
    window.refreshSuperAdmin = onRefresh;

    // Logout
    container.querySelector('#super-logout-btn')?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.search = '';
    });

    // Slug preview
    const slugInput = container.querySelector('#t-slug');
    const slugPreview = container.querySelector('#slug-preview');
    if (slugInput && slugPreview) {
      slugInput.oninput = () => {
        const val = slugInput.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
        slugInput.value = val;
        slugPreview.textContent = val || '...';
      };
    }

    // Store name → auto-slug
    const storeNameInput = container.querySelector('#t-store-name');
    if (storeNameInput && slugInput) {
      storeNameInput.oninput = () => {
        if (!container.querySelector('#edit-tenant-id').value) {
          const auto = storeNameInput.value
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          slugInput.value = auto;
          if (slugPreview) slugPreview.textContent = auto || '...';
        }
      };
    }

    // Color pickers sync
    const syncColor = (pickerId, hexId) => {
      const picker = container.querySelector(`#${pickerId}`);
      const hex = container.querySelector(`#${hexId}`);
      if (!picker || !hex) return;
      picker.oninput = () => { hex.value = picker.value; };
      hex.oninput = () => { if (/^#[0-9A-Fa-f]{6}$/.test(hex.value)) picker.value = hex.value; };
    };
    syncColor('t-primary-color', 't-primary-color-hex');
    syncColor('t-secondary-color', 't-secondary-color-hex');

    // Niche presets
    const nicheSelect = container.querySelector('#t-niche');
    const opt1 = container.querySelector('#t-option1-label');
    const opt2 = container.querySelector('#t-option2-label');
    const nichePresets = {
      fashion:     { o1: 'Tamanho', o2: 'Cor' },
      food:        { o1: 'Adicionais', o2: 'Bebida' },
      beauty:      { o1: 'Variação', o2: 'Cor' },
      electronics: { o1: 'Capacidade', o2: 'Cor' },
      pets:        { o1: 'Tamanho', o2: 'Cor' },
      home:        { o1: 'Dimensão', o2: 'Cor' },
      sports:      { o1: 'Tamanho', o2: 'Cor' },
    };
    if (nicheSelect) {
      nicheSelect.onchange = () => {
        const preset = nichePresets[nicheSelect.value];
        if (preset) {
          if (opt1) opt1.value = preset.o1;
          if (opt2) opt2.value = preset.o2;
        }
      };
    }

    // Edit tenant
    window.superAdminEditTenant = async (id) => {
      const { data: t } = await supabase.from('tenant_settings').select('*').eq('id', id).single();
      if (!t) return;
      window.superAdminTab = 'create';
      onRefresh();
      setTimeout(() => {
        const setVal = (sel, val) => { const el = container.querySelector(sel); if (el) el.value = val || ''; };
        setVal('#edit-tenant-id', t.id);
        setVal('#t-store-name', t.store_name);
        setVal('#t-slug', t.slug);
        setVal('#t-whatsapp', t.whatsapp_number);
        setVal('#t-hero-title', t.hero_title);
        setVal('#t-hero-subtitle', t.hero_subtitle);
        setVal('#t-primary-color', t.primary_color || '#6d28d9');
        setVal('#t-primary-color-hex', t.primary_color || '#6d28d9');
        setVal('#t-secondary-color', t.secondary_color || '#4c1d95');
        setVal('#t-secondary-color-hex', t.secondary_color || '#4c1d95');
        setVal('#t-option1-label', t.option1_label);
        setVal('#t-option2-label', t.option2_label);
        setVal('#t-niche', t.niche);
        if (slugPreview) slugPreview.textContent = t.slug || '...';
        const btn = container.querySelector('#btn-super-save-tenant');
        if (btn) btn.innerText = 'Salvar Alterações';
      }, 100);
    };

    // Delete tenant
    window.superAdminDeleteTenant = async (id, name) => {
      if (!confirm(`Tem certeza que deseja excluir a loja "${name}"? Esta ação é irreversível.`)) return;
      const { error } = await supabase.from('tenant_settings').delete().eq('id', id);
      if (error) {
        Toast.show('Erro ao excluir: ' + error.message, 'error');
      } else {
        Toast.show(`Loja "${name}" excluída com sucesso!`);
        onRefresh();
      }
    };

    // Form submit
    const form = container.querySelector('#super-create-tenant-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const editId = container.querySelector('#edit-tenant-id')?.value;

        const payload = {
          store_name: container.querySelector('#t-store-name')?.value?.trim(),
          slug:       container.querySelector('#t-slug')?.value?.trim(),
          whatsapp_number: container.querySelector('#t-whatsapp')?.value?.trim(),
          hero_title:  container.querySelector('#t-hero-title')?.value?.trim() || null,
          hero_subtitle: container.querySelector('#t-hero-subtitle')?.value?.trim() || null,
          primary_color:   container.querySelector('#t-primary-color-hex')?.value || '#6d28d9',
          secondary_color: container.querySelector('#t-secondary-color-hex')?.value || '#4c1d95',
          option1_label:   container.querySelector('#t-option1-label')?.value?.trim() || null,
          option2_label:   container.querySelector('#t-option2-label')?.value?.trim() || null,
          niche:           container.querySelector('#t-niche')?.value || null,
        };

        // Resolve owner_id from email
        const ownerEmail = container.querySelector('#t-owner-email')?.value?.trim();
        if (ownerEmail) {
          const { data: users } = await supabase
            .from('tenant_settings')
            .select('owner_id')
            .eq('owner_id', ownerEmail)
            .limit(1);
          // NOTE: owner_id lookup requires admin API — store raw email for now
          payload.owner_email = ownerEmail;
        }

        let error;
        if (editId) {
          ({ error } = await supabase.from('tenant_settings').update(payload).eq('id', editId));
        } else {
          ({ error } = await supabase.from('tenant_settings').insert(payload));
        }

        if (error) {
          Toast.show('Erro: ' + error.message, 'error');
        } else {
          Toast.show(editId ? 'Loja atualizada com sucesso!' : 'Nova loja criada com sucesso!');
          window.superAdminTab = 'tenants';
          onRefresh();
        }
      };
    }
  }
};
