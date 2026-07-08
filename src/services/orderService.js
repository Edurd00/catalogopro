import { Toast } from '../components/Toast.js';
import { supabase } from '../config/supabase.js';

export const orderService = {
  async createOrder({ customerName, customerPhone, deliveryAddress, neighborhood, deliveryFee, orderType, paymentMethod, changeFor, cartItems, tenant }) {
    try {
      const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      const subtotal = cartItems.reduce((sum, item) => {
        const prod = item.product || item;
        const price = prod.promo_price && prod.promo_price < prod.price ? prod.promo_price : prod.price;
        return sum + (price * item.quantity);
      }, 0);

      const totalAmount = subtotal + (deliveryFee || 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          tenant_id: tenant.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_address: deliveryAddress,
          payment_method: paymentMethod,
          total_amount: totalAmount,
          status: 'pending',
          metadata: {
            order_type: orderType,
            neighborhood,
            delivery_fee: deliveryFee,
            change_for: changeFor
          }
        })
        .select().single();

      if (orderError) throw orderError;

      const itemsToInsert = cartItems.map(item => {
        const prod = item.product || item;
        const unitPrice = prod.promo_price && prod.promo_price < prod.price ? prod.promo_price : prod.price;
        return {
          order_id: order.id,
          product_id: prod.id,
          quantity: item.quantity,
          unit_price: unitPrice,
          selected_attributes: {
            size: item.size,
            color: item.color,
            variationTitle1: item.variationTitle1,
            variationTitle2: item.variationTitle2
          }
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // Format WhatsApp Message
      let text = `*📦 NOVO PEDIDO - ${tenant.store_name}*\n`;
      text += `----------------------------------------\n`;
      text += `📌 *TIPO:* ${orderType === 'pickup' ? 'RETIRADA NO BALCÃO' : 'ENTREGA'}\n`;
      text += `👤 *CLIENTE:* ${customerName}\n`;
      text += `📱 *WHATSAPP:* ${customerPhone}\n`;

      if (orderType === 'delivery') {
        text += `📍 *BAIRRO:* ${neighborhood}\n`;
        text += `🏠 *ENDEREÇO:* ${deliveryAddress}\n`;
      }
      text += `----------------------------------------\n`;
      text += `*🛒 ITENS:*\n`;

      cartItems.forEach(item => {
        const prod = item.product || item;
        const unitPrice = prod.promo_price && prod.promo_price < prod.price ? prod.promo_price : prod.price;
        text += `${item.quantity}x ${prod.title} - ${formatCurrency(unitPrice)}\n`;
        if (item.size) text += `- ${item.variationTitle2 || 'Tamanho'}: ${item.size}\n`;
        if (item.color) text += `- ${item.variationTitle1 || 'Cor'}: ${item.color}\n`;
      });

      text += `----------------------------------------\n`;
      text += `*💰 RESUMO:*\n`;
      text += `Subtotal: ${formatCurrency(subtotal)}\n`;
      if (orderType === 'delivery') {
        text += `Taxa de Entrega: ${deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}\n`;
      }
      text += `*TOTAL: ${formatCurrency(totalAmount)}*\n`;
      text += `----------------------------------------\n`;
      text += `*💳 PAGAMENTO:* ${paymentMethod}`;
      if (paymentMethod === 'Dinheiro' && changeFor) {
        text += ` (Troco para R$ ${changeFor})`;
      }

      const cleanPhone = tenant.whatsapp_number.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');

      return { success: true, orderId: order.id };
    } catch (error) {
      console.error(error);
      Toast.show("Erro ao processar pedido.", 'error');
      return { success: false };
    }
  },

  async getMonthMetrics(tenantId) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('tenant_id', tenantId)
      .neq('status', 'cancelled')
      .gte('created_at', firstDay);

    if (error) return { totalOrders: 0, totalRevenue: 0, topItem: '-' };

    const totalOrders = data.length;
    const totalRevenue = data.reduce((sum, o) => sum + Number(o.total_amount), 0);

    return { totalOrders, totalRevenue, topItem: '-' };
  }
};
