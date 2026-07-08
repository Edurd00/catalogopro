export const Toast = {
  show(message, type = 'success') {
    const container = document.getElementById('toast-container') || this.createContainer();
    const toast = document.createElement('div');

    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const icon = type === 'success'
      ? '<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
      : '<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';

    toast.className = `flex items-center gap-3 ${bgColor} ${borderColor} border ${textColor} px-6 py-4 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top duration-300 min-w-[300px]`;
    toast.innerHTML = `
      <div class="flex-shrink-0">${icon}</div>
      <p class="text-sm font-bold uppercase tracking-tight">${message}</p>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.replace('animate-in', 'animate-out');
      toast.classList.add('fade-out', 'duration-500');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  },

  createContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-[90vw] md:max-w-md items-center';
    document.body.appendChild(container);
    return container;
  }
};
