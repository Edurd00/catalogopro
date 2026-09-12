import { Toast } from '../components/Toast.js';
import { dbService } from './dbService.js';

export const orderService = {
  async getOrders() {
    return await dbService.getOrders();
  },

  async updateStatus(id, status) {
    return await dbService.updateOrderStatus(id, status);
  },

  async createOrder({ customerName, customerEmail, customerPhone, deliveryAddress, paymentMethod, notes, cartItems, storeSettings }) {
    try {
      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const subtotalAmount = cartItems.reduce((sum, item) => {
        const prod = item.product || item;
        const price = prod.promotional_price && Number(prod.promotional_price) < Number(prod.price)
          ? Number(prod.promotional_price)
          : Number(prod.price || 0);
        return sum + (price * Number(item.quantity || 1));
      }, 0);

      const totalAmount = subtotalAmount;

      // Persiste no banco Neon
      let order = null;
      try {
        order = await dbService.createOrder({
          customer_name: customerName,
          customer_email: customerEmail || null,
          customer_phone: customerPhone,
          address: deliveryAddress || null,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          notes: notes || null
        });

        if (order && order.id) {
          for (const item of cartItems) {
            const prod = item.product || item;
            const unitPrice = prod.promotional_price && Number(prod.promotional_price) < Number(prod.price)
              ? Number(prod.promotional_price)
              : Number(prod.price || 0);
            const qty = Number(item.quantity || 1);
            const subtotal = unitPrice * qty;
            const prodName = prod.name || prod.product_name || prod.title || 'Produto';

            await dbService.createOrderItem({
              order_id: order.id,
              product_id: prod.id || null,
              product_name: prodName,
              quantity: qty,
              unit_price: unitPrice,
              subtotal: subtotal
            });
          }
        }
      } catch (dbErr) {
        console.warn('Erro ao salvar pedido no banco de dados:', dbErr.message);
      }

      const orderId = order?.id || 'ORD-' + Date.now();

      // Monta mensagem do WhatsApp
      let text = `*📦 NOVO PEDIDO RECEBIDO (#${orderId})*\n`;
      text += `----------------------------------------\n`;
      text += `*Cliente:* ${customerName}\n`;
      text += `*Telefone:* ${customerPhone}\n`;
      if (customerEmail) text += `*E-mail:* ${customerEmail}\n`;
      text += `----------------------------------------\n`;
      text += `*🛒 ITENS DO PEDIDO:*\n`;

      cartItems.forEach(item => {
        const prod = item.product || item;
        const productName = prod.name || prod.product_name || prod.title || 'Produto';
        const unitPrice = prod.promotional_price && Number(prod.promotional_price) < Number(prod.price)
          ? Number(prod.promotional_price)
          : Number(prod.price || 0);

        text += `${item.quantity}x ${productName} - ${formatCurrency(unitPrice)}\n`;
        if (item.selectedAttributes?.size) text += `- Tamanho/Opção: ${item.selectedAttributes.size}\n`;
        if (item.selectedAttributes?.color) text += `- Cor/Variação: ${item.selectedAttributes.color}\n`;
      });

      text += `----------------------------------------\n`;
      text += `*💰 RESUMO DOS VALORES:*\n`;
      text += `Subtotal: ${formatCurrency(subtotalAmount)}\n`;
      text += `*TOTAL DO PEDIDO: ${formatCurrency(totalAmount)}*\n`;
      text += `----------------------------------------\n`;
      text += `*📍 DADOS DE ENTREGA / PAGAMENTO:*\n`;
      text += `Forma de Pagamento: ${paymentMethod}\n`;
      text += `Tipo: ${deliveryAddress ? 'Delivery' : 'Retirada'}\n`;
      text += `Endereço: ${deliveryAddress || 'Retirada no Local'}\n`;
      if (notes) text += `Observações: ${notes}\n`;

      const rawPhone = storeSettings?.whatsapp_number || '5511999999999';
      const cleanPhone = rawPhone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

      window.open(whatsappUrl, '_blank');
      Toast.show('Pedido gerado com sucesso! Redirecionando para o WhatsApp... 🚀');

      return { success: true, orderId };
    } catch (error) {
      console.error('Erro ao gerar pedido:', error);
      Toast.show("Erro ao processar pedido.", 'error');
      return { success: false };
    }
  }
};
