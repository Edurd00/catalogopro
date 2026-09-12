export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  whatsapp_number: string;
  email: string | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promotional_price: number | null;
  stock: number;
  image_url: string | null;
  featured: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  address: string | null;
  total_amount: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | string;
  payment_method: string;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
}
