import { Toast } from '../../components/Toast.js';

export const Login = {
  render() {
    return `
      <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-8 animate-in fade-in zoom-in duration-300">
          
          <div class="text-center space-y-2">
            <a href="/" class="inline-flex items-center gap-2 mb-4">
              <span class="w-10 h-10 rounded-2xl bg-lojaPrimaria text-white flex items-center justify-center font-black text-lg shadow-lg shadow-lojaPrimaria/30">CP</span>
            </a>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Acessar Painel</h1>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Entre com suas credenciais de administrador</p>
          </div>

          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">E-mail</label>
              <input
                type="email"
                id="login-email"
                required
                class="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lojaPrimaria transition"
                placeholder="admin@catalogopro.com"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Senha</label>
              <input
                type="password"
                id="login-password"
                required
                class="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lojaPrimaria transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-lojaPrimaria hover:opacity-90 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-lojaPrimaria/25 transition active:scale-[0.98]"
            >
              Entrar no Painel
            </button>
          </form>

          <div class="text-center pt-2">
            <a href="/" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-lojaPrimaria transition">← Voltar para a Vitrine</a>
          </div>

        </div>
      </div>
    `;
  },

  bindEvents(container) {
    const form = container.querySelector('#login-form');
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const email = container.querySelector('#login-email').value;

      localStorage.setItem('admin_auth', JSON.stringify({
        authenticated: true,
        email: email,
        role: 'admin'
      }));

      Toast.show('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        window.location.search = '?page=admin';
      }, 500);
    };
  }
};
