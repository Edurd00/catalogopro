import { Toast } from '../components/Toast.js';
import { supabase } from '../config/supabase.js';

export const orderService = {
  async createOrder({ customerName, customerPhone, deliveryAddress, paymentMethod, cartItems, tenant }) {
    try {
      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const tenantFee = tenant?.delivery_fee ? Number(tenant.delivery_fee) : 0;
      const maxProductShipping = cartItems.reduce((max, item) => {
        const rawShipping = item.shipping_fee ?? item.product?.shipping_fee ?? 0;
        return rawShipping > max ? rawShipping : max;
      }, 0);
      const deliveryFee = maxProductShipping > 0 ? maxProductShipping : tenantFee;

      const subtotal = cartItems.reduce((sum, item) => {
        const prod = item.product || item;
        const price = prod.promo_price && Number(prod.promo_price) < Number(prod.price)
          ? Number(prod.promo_price)
          : Number(prod.price || 0);
        return sum + (price * item.quantity);
      }, 0);

      const totalAmount = subtotal + deliveryFee;

      // Tenta persistir no banco de dados se a tabela existir
      let orderId = 'ORD-' + Date.now();
      try {
        if (supabase && import.meta.env.VITE_SUPABASE_URL) {
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              customer_name: customerName,
              customer_phone: customerPhone,
              delivery_address: deliveryAddress,
              payment_method: paymentMethod,
              total_amount: totalAmount,
              status: 'pending',
              tenant_id: tenant?.id || null
            })
            .select().single();

          if (!orderError && order?.id) {
            orderId = order.id;
            const itemsToInsert = cartItems.map(item => {
              const prod = item.product || item;
              const unitPrice = prod.promo_price && Number(prod.promo_price) < Number(prod.price)
                ? Number(prod.promo_price)
                : Number(prod.price || 0);
              return {
                order_id: order.id,
                product_id: prod.id,
                quantity: item.quantity,
                unit_price: unitPrice,
                selected_attributes: item.selectedAttributes || {}
              };
            });

            await supabase.from('order_items').insert(itemsToInsert);
          }
        }
      } catch (dbErr) {
        // Se as tabelas orders/order_items não existirem no Neon/Supabase, não bloqueia o WhatsApp
        console.warn('Persistência opcional de pedido não concluída (tabelas orders podem não existir):', dbErr.message);
      }

      // Monta mensagem do WhatsApp
      let text = `*📦 NOVO PEDIDO RECEBIDO (#${orderId})*\n`;
      text += `----------------------------------------\n`;
      text += `*Cliente:* ${customerName}\n`;
      text += `*Telefone:* ${customerPhone}\n`;
      text += `----------------------------------------\n`;
      text += `*🛒 ITENS DO PEDIDO:*\n`;

      cartItems.forEach(item => {
        const prod = item.product || item;
        const productName = prod.name || prod.title || 'Produto';
        const unitPrice = prod.promo_price && Number(prod.promo_price) < Number(prod.price)
          ? Number(prod.promo_price)
          : Number(prod.price || 0);

        text += `${item.quantity}x ${productName} - ${formatCurrency(unitPrice)}\n`;
        if (item.selectedAttributes?.size) text += `- Tamanho/Opção: ${item.selectedAttributes.size}\n`;
        if (item.selectedAttributes?.color) text += `- Cor/Variação: ${item.selectedAttributes.color}\n`;
      });

      text += `----------------------------------------\n`;
      text += `*💰 RESUMO DOS VALORES:*\n`;
      text += `Subtotal: ${formatCurrency(subtotal)}\n`;
      text += `Taxa de Entrega: ${deliveryFee === 0 ? 'Grátis / A combinar' : formatCurrency(deliveryFee)}\n`;
      text += `*TOTAL DO PEDIDO: ${formatCurrency(totalAmount)}*\n`;
      text += `----------------------------------------\n`;
      text += `*📍 DADOS DE ENTREGA / PAGAMENTO:*\n`;
      text += `Forma de Pagamento: ${paymentMethod}\n`;
      text += `Tipo: ${deliveryAddress ? 'Delivery' : 'Retirada'}\n`;
      text += `Endereço: ${deliveryAddress || 'Retirada no Local'}\n`;

      const rawPhone = tenant?.whatsapp_number || '5511999999999';
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