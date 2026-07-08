export const ConfirmModal = {
  render(title, message, confirmText = 'Confirmar') {
    return `
      <div id="confirm-modal-root" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
        <div class="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-8 relative shadow-2xl animate-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
          <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">${title}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8">${message}</p>
          <div class="grid grid-cols-2 gap-4">
            <button id="btn-confirm-cancel" class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 transition">Cancelar</button>
            <button id="btn-confirm-proceed" class="bg-red-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 transition shadow-lg shadow-red-500/20">${confirmText}</button>
          </div>
        </div>
      </div>
    `;
  },

  show(title, message, confirmText) {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      container.innerHTML = this.render(title, message, confirmText);
      document.body.appendChild(container);

      const close = (res) => {
        container.remove();
        resolve(res);
      };

      container.querySelector('#btn-confirm-cancel').onclick = () => close(false);
      container.querySelector('#btn-confirm-proceed').onclick = () => close(true);
    });
  }
};
