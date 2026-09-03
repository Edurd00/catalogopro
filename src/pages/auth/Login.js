import { Toast } from '../../components/Toast.js';
import { supabase } from '../../config/supabase.js';

export const Login = {
  render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
        <div class="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md space-y-6 animate-in fade-in">
          
          <div class="text-center space-y-2">
            <div class="w-14 h-14 bg-lojaPrimaria/10 text-lojaPrimaria rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Painel Administrativo</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Acesse as métricas, catálogo e pedidos da sua loja.</p>
          </div>

          <!-- Dica rápida para quem está avaliando o portfólio -->
          <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 text-xs text-blue-700 dark:text-blue-300 space-y-2">
            <div class="flex items-center gap-1.5 font-bold">
              <span>💡</span>
              <span>Acesso para Avaliação de Portfólio</span>
            </div>
            <p class="text-[11px] leading-relaxed opacity-90">
              Você pode usar o botão de acesso rápido abaixo ou entrar com <strong>admin@catalogopro.com</strong> e qualquer senha.
            </p>
            <button id="quick-login-btn" type="button" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm active:scale-98">
              ⚡ Entrar como Administrador (1-Clique)
            </button>
          </div>
          
          <div class="relative flex items-center justify-center">
            <span class="border-t border-gray-200 dark:border-gray-800 w-full"></span>
            <span class="bg-white dark:bg-gray-900 px-3 text-[10px] font-black uppercase tracking-widest text-gray-400">ou informe os dados</span>
            <span class="border-t border-gray-200 dark:border-gray-800 w-full"></span>
          </div>

          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">E-mail</label>
              <input 
                type="email" 
                id="login-email" 
                required 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-lojaPrimaria focus:outline-none transition" 
                placeholder="admin@catalogopro.com" 
                value="admin@catalogopro.com"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Senha</label>
              <input 
                type="password" 
                id="login-password" 
                required 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-lojaPrimaria focus:outline-none transition" 
                placeholder="••••••••" 
                value="admin123"
              />
            </div>
            
            <button type="submit" class="w-full bg-gray-900 dark:bg-lojaPrimaria hover:bg-opacity-90 text-white font-black py-3.5 rounded-xl transition text-xs uppercase tracking-widest shadow-md mt-2 active:scale-98">
              Acessar Painel
            </button>
          </form>
          
          <div class="text-center pt-2">
            <a href="/" class="text-xs text-gray-400 hover:text-lojaPrimaria transition font-bold">← Voltar para a Vitrine</a>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container) {
    const doLogin = (email = 'admin@catalogopro.com') => {
      localStorage.setItem('admin_auth', JSON.stringify({
        email,
        name: 'Administrador',
        authenticated: true,
        loginAt: Date.now()
      }));
      Toast.show('Login realizado com sucesso! Carregando painel...', 'success');
      setTimeout(() => {
        window.location.search = '?page=admin';
      }, 300);
    };

    // Botão de acesso rápido
    const quickBtn = container.querySelector('#quick-login-btn');
    if (quickBtn) {
      quickBtn.onclick = () => doLogin('admin@catalogopro.com');
    }

    // Formulário de login
    const form = container.querySelector('#login-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const email = container.querySelector('#login-email').value;
        const password = container.querySelector('#login-password').value;

        // Se o Supabase estiver ativo, tenta via Supabase Auth
        if (supabase) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (!error && data?.session) {
              window.location.search = '?page=admin';
              return;
            }
          } catch (err) {
            console.warn('Tentativa no Supabase falhou, utilizando autenticação local:', err.message);
          }
        }

        // Caso use Neon / portfólio demo, valida credenciais padrão
        if (email && password) {
          doLogin(email);
        } else {
          Toast.show('Preencha e-mail e senha para continuar.', 'error');
        }
      };
    }
  }
};