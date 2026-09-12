import { neon } from '@neondatabase/serverless';
import { mockCategories, mockProducts } from '../data/mockData.js';

const getConnectionString = () => {
  return (
    (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
    import.meta.env?.VITE_DATABASE_URL ||
    import.meta.env?.DATABASE_URL ||
    import.meta.env?.VITE_NEON_DATABASE_URL ||
    ''
  );
};

let sqlClient = null;

function getSql() {
  const connectionString = getConnectionString();
  if (!connectionString) return null;

  if (!sqlClient) {
    try {
      sqlClient = neon(connectionString);
    } catch (err) {
      console.warn('Falha ao inicializar o cliente Neon:', err.message);
      sqlClient = null;
    }
  }
  return sqlClient;
}

// Fallback in-memory store settings
let localStoreSettings = {
  id: 'store-1',
  store_name: 'Catálogo Pro',
  logo_url: null,
  banner_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
  primary_color: '#3b82f6',
  secondary_color: '#1e3a8a',
  whatsapp_number: '5511999999999',
  email: 'contato@catalogopro.com'
};

// Fallback in-memory orders
let localOrders = [
  {
    id: '101',
    customer_name: 'Lucas Ferreira',
    customer_email: 'lucas@exemplo.com',
    customer_phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1000 - Bela Vista, SP',
    total_amount: 399.90,
    status: 'shipped',
    payment_method: 'Pix',
    notes: 'Entregar na portaria',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '102',
    customer_name: 'Mariana Souza',
    customer_email: 'mariana@exemplo.com',
    customer_phone: '(21) 99123-8877',
    address: 'Rua Barata Ribeiro, 250 - Copacabana, RJ',
    total_amount: 239.00,
    status: 'preparing',
    payment_method: 'Cartão de Crédito',
    notes: '',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

let localOrderItems = [
  {
    id: 'item-1',
    order_id: '101',
    product_id: '1',
    product_name: 'Headphone Bluetooth Noise Cancelling Pro',
    quantity: 1,
    unit_price: 399.90,
    subtotal: 399.90
  },
  {
    id: 'item-2',
    order_id: '102',
    product_id: '6',
    product_name: 'Jaqueta Corta-Vento Urban Techwear',
    quantity: 1,
    unit_price: 239.00,
    subtotal: 239.00
  }
];

let localProducts = mockProducts.map(p => ({
  id: String(p.id),
  category_id: p.category_id ? String(p.category_id) : null,
  name: p.name || p.title || 'Produto',
  slug: (p.name || p.title || 'produto').toLowerCase().replace(/\s+/g, '-'),
  description: p.description || '',
  price: Number(p.price || 0),
  promotional_price: p.promo_price ? Number(p.promo_price) : null,
  stock: p.stock_quantity !== undefined ? p.stock_quantity : (p.stock || 10),
  image_url: p.image_url || '',
  featured: Boolean(p.featured || p.is_featured),
  active: p.is_active !== undefined ? p.is_active : true
}));

let localCategories = mockCategories.map(c => ({
  id: String(c.id),
  name: c.name,
  slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
  description: c.description || '',
  created_at: c.created_at || new Date().toISOString()
}));

export const dbService = {
  // ---------------------------------------------------------------------------
  // STORE SETTINGS CRUD
  // ---------------------------------------------------------------------------
  async getStoreSettings() {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, store_name, logo_url, banner_url, primary_color, secondary_color, whatsapp_number, email
          FROM store_settings
          LIMIT 1
        `;
        if (rows && rows.length > 0) {
          return rows[0];
        }
      } catch (err) {
        console.warn('Erro ao carregar store_settings no Neon:', err.message);
      }
    }
    return localStoreSettings;
  },

  async createStoreSettings(data) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO store_settings (store_name, logo_url, banner_url, primary_color, secondary_color, whatsapp_number, email)
          VALUES (${data.store_name}, ${data.logo_url || null}, ${data.banner_url || null}, ${data.primary_color || '#3b82f6'}, ${data.secondary_color || '#1e3a8a'}, ${data.whatsapp_number}, ${data.email || null})
          RETURNING id, store_name, logo_url, banner_url, primary_color, secondary_color, whatsapp_number, email
        `;
        if (rows && rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('Erro ao criar store_settings no Neon:', err.message);
      }
    }
    localStoreSettings = { ...localStoreSettings, ...data };
    return localStoreSettings;
  },

  async updateStoreSettings(id, data) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          UPDATE store_settings
          SET store_name = ${data.store_name},
              logo_url = ${data.logo_url || null},
              banner_url = ${data.banner_url || null},
              primary_color = ${data.primary_color || '#3b82f6'},
              secondary_color = ${data.secondary_color || '#1e3a8a'},
              whatsapp_number = ${data.whatsapp_number},
              email = ${data.email || null}
          WHERE id = ${id}
          RETURNING id, store_name, logo_url, banner_url, primary_color, secondary_color, whatsapp_number, email
        `;
        if (rows && rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('Erro ao atualizar store_settings no Neon:', err.message);
      }
    }
    localStoreSettings = { ...localStoreSettings, ...data };
    return localStoreSettings;
  },

  // ---------------------------------------------------------------------------
  // PRODUCTS CRUD
  // ---------------------------------------------------------------------------
  async getProducts({ categoryId = null, searchQuery = '', featured = null, active = true } = {}) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT p.id, p.category_id, p.name, p.slug, p.description, p.price, p.promotional_price, p.stock, p.image_url, p.featured, p.active, p.created_at,
                 c.name AS category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.created_at DESC
        `;
        if (rows) {
          let list = rows.map(r => ({
            ...r,
            price: Number(r.price),
            promotional_price: r.promotional_price ? Number(r.promotional_price) : null,
            stock: Number(r.stock)
          }));

          if (active !== null) list = list.filter(p => p.active === active);
          if (categoryId) list = list.filter(p => String(p.category_id) === String(categoryId));
          if (featured !== null) list = list.filter(p => p.featured === featured);
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
              (p.name && p.name.toLowerCase().includes(q)) ||
              (p.description && p.description.toLowerCase().includes(q))
            );
          }
          return list;
        }
      } catch (err) {
        console.warn('Erro ao buscar produtos no Neon:', err.message);
      }
    }

    let list = [...localProducts];
    if (active !== null) list = list.filter(p => p.active === active);
    if (categoryId) list = list.filter(p => String(p.category_id) === String(categoryId));
    if (featured !== null) list = list.filter(p => p.featured === featured);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getProductById(id) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, category_id, name, slug, description, price, promotional_price, stock, image_url, featured, active
          FROM products
          WHERE id = ${id}
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return {
            ...r,
            price: Number(r.price),
            promotional_price: r.promotional_price ? Number(r.promotional_price) : null,
            stock: Number(r.stock)
          };
        }
      } catch (err) {
        console.warn('Erro ao buscar produto por id no Neon:', err.message);
      }
    }
    return localProducts.find(p => String(p.id) === String(id)) || null;
  },

  async createProduct(data) {
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : `prod-${Date.now()}`);
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO products (category_id, name, slug, description, price, promotional_price, stock, image_url, featured, active)
          VALUES (${data.category_id || null}, ${data.name}, ${slug}, ${data.description || null}, ${data.price}, ${data.promotional_price || null}, ${data.stock ?? 10}, ${data.image_url || null}, ${data.featured ?? false}, ${data.active ?? true})
          RETURNING id, category_id, name, slug, description, price, promotional_price, stock, image_url, featured, active
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return {
            ...r,
            price: Number(r.price),
            promotional_price: r.promotional_price ? Number(r.promotional_price) : null,
            stock: Number(r.stock)
          };
        }
      } catch (err) {
        console.warn('Erro ao criar produto no Neon:', err.message);
      }
    }

    const newProd = {
      id: String(Date.now()),
      category_id: data.category_id || null,
      name: data.name,
      slug,
      description: data.description || null,
      price: Number(data.price),
      promotional_price: data.promotional_price ? Number(data.promotional_price) : null,
      stock: Number(data.stock ?? 10),
      image_url: data.image_url || null,
      featured: Boolean(data.featured ?? false),
      active: Boolean(data.active ?? true)
    };
    localProducts.unshift(newProd);
    return newProd;
  },

  async updateProduct(id, data) {
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined);
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          UPDATE products
          SET category_id = ${data.category_id || null},
              name = ${data.name},
              slug = COALESCE(${slug}, slug),
              description = ${data.description || null},
              price = ${data.price},
              promotional_price = ${data.promotional_price || null},
              stock = ${data.stock ?? 10},
              image_url = ${data.image_url || null},
              featured = ${data.featured ?? false},
              active = ${data.active ?? true}
          WHERE id = ${id}
          RETURNING id, category_id, name, slug, description, price, promotional_price, stock, image_url, featured, active
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return {
            ...r,
            price: Number(r.price),
            promotional_price: r.promotional_price ? Number(r.promotional_price) : null,
            stock: Number(r.stock)
          };
        }
      } catch (err) {
        console.warn('Erro ao atualizar produto no Neon:', err.message);
      }
    }

    const idx = localProducts.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      localProducts[idx] = { ...localProducts[idx], ...data, price: Number(data.price) };
      return localProducts[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    const sql = getSql();
    if (sql) {
      try {
        await sql`DELETE FROM products WHERE id = ${id}`;
        return true;
      } catch (err) {
        console.warn('Erro ao deletar produto no Neon:', err.message);
      }
    }
    localProducts = localProducts.filter(p => String(p.id) !== String(id));
    return true;
  },

  // ---------------------------------------------------------------------------
  // ORDERS CRUD
  // ---------------------------------------------------------------------------
  async getOrders() {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, customer_name, customer_email, customer_phone, address, total_amount, status, payment_method, notes, created_at
          FROM orders
          ORDER BY created_at DESC
        `;
        if (rows) {
          return rows.map(r => ({
            ...r,
            total_amount: Number(r.total_amount)
          }));
        }
      } catch (err) {
        console.warn('Erro ao buscar pedidos no Neon:', err.message);
      }
    }
    return localOrders;
  },

  async getOrderById(id) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, customer_name, customer_email, customer_phone, address, total_amount, status, payment_method, notes, created_at
          FROM orders
          WHERE id = ${id}
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return { ...r, total_amount: Number(r.total_amount) };
        }
      } catch (err) {
        console.warn('Erro ao buscar pedido no Neon:', err.message);
      }
    }
    return localOrders.find(o => String(o.id) === String(id)) || null;
  },

  async createOrder(data) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO orders (customer_name, customer_email, customer_phone, address, total_amount, status, payment_method, notes)
          VALUES (${data.customer_name}, ${data.customer_email || null}, ${data.customer_phone}, ${data.address || null}, ${data.total_amount}, ${data.status || 'pending'}, ${data.payment_method}, ${data.notes || null})
          RETURNING id, customer_name, customer_email, customer_phone, address, total_amount, status, payment_method, notes, created_at
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return { ...r, total_amount: Number(r.total_amount) };
        }
      } catch (err) {
        console.warn('Erro ao criar pedido no Neon:', err.message);
      }
    }

    const newOrder = {
      id: 'ORD-' + Date.now(),
      customer_name: data.customer_name,
      customer_email: data.customer_email || null,
      customer_phone: data.customer_phone,
      address: data.address || null,
      total_amount: Number(data.total_amount),
      status: data.status || 'pending',
      payment_method: data.payment_method,
      notes: data.notes || null,
      created_at: new Date().toISOString()
    };
    localOrders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(id, status) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          UPDATE orders
          SET status = ${status}
          WHERE id = ${id}
          RETURNING id, customer_name, customer_email, customer_phone, address, total_amount, status, payment_method, notes, created_at
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return { ...r, total_amount: Number(r.total_amount) };
        }
      } catch (err) {
        console.warn('Erro ao atualizar status do pedido no Neon:', err.message);
      }
    }

    const order = localOrders.find(o => String(o.id) === String(id));
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  },

  async deleteOrder(id) {
    const sql = getSql();
    if (sql) {
      try {
        await sql`DELETE FROM orders WHERE id = ${id}`;
        return true;
      } catch (err) {
        console.warn('Erro ao deletar pedido no Neon:', err.message);
      }
    }
    localOrders = localOrders.filter(o => String(o.id) !== String(id));
    return true;
  },

  // ---------------------------------------------------------------------------
  // ORDER ITEMS CRUD
  // ---------------------------------------------------------------------------
  async getOrderItems(orderId) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, order_id, product_id, product_name, quantity, unit_price, subtotal, created_at
          FROM order_items
          WHERE order_id = ${orderId}
        `;
        if (rows) {
          return rows.map(r => ({
            ...r,
            quantity: Number(r.quantity),
            unit_price: Number(r.unit_price),
            subtotal: Number(r.subtotal)
          }));
        }
      } catch (err) {
        console.warn('Erro ao buscar itens do pedido no Neon:', err.message);
      }
    }
    return localOrderItems.filter(i => String(i.order_id) === String(orderId));
  },

  async createOrderItem(data) {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
          VALUES (${data.order_id}, ${data.product_id || null}, ${data.product_name}, ${data.quantity}, ${data.unit_price}, ${data.subtotal})
          RETURNING id, order_id, product_id, product_name, quantity, unit_price, subtotal, created_at
        `;
        if (rows && rows.length > 0) {
          const r = rows[0];
          return {
            ...r,
            quantity: Number(r.quantity),
            unit_price: Number(r.unit_price),
            subtotal: Number(r.subtotal)
          };
        }
      } catch (err) {
        console.warn('Erro ao criar item do pedido no Neon:', err.message);
      }
    }

    const newItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      order_id: data.order_id,
      product_id: data.product_id || null,
      product_name: data.product_name,
      quantity: Number(data.quantity),
      unit_price: Number(data.unit_price),
      subtotal: Number(data.subtotal)
    };
    localOrderItems.push(newItem);
    return newItem;
  },

  async deleteOrderItem(id) {
    const sql = getSql();
    if (sql) {
      try {
        await sql`DELETE FROM order_items WHERE id = ${id}`;
        return true;
      } catch (err) {
        console.warn('Erro ao deletar item do pedido no Neon:', err.message);
      }
    }
    localOrderItems = localOrderItems.filter(i => String(i.id) !== String(id));
    return true;
  },

  // ---------------------------------------------------------------------------
  // CATEGORIES CRUD
  // ---------------------------------------------------------------------------
  async getCategories() {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, name, slug, created_at
          FROM categories
          ORDER BY name ASC
        `;
        if (rows && rows.length > 0) return rows;
      } catch (err) {
        console.warn('Erro ao buscar categorias no Neon:', err.message);
      }
    }
    return localCategories;
  },

  async createCategory(data) {
    const slug = data.slug || data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`
          INSERT INTO categories (name, slug)
          VALUES (${data.name}, ${slug})
          RETURNING id, name, slug, created_at
        `;
        if (rows && rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('Erro ao criar categoria no Neon:', err.message);
      }
    }

    const newCat = {
      id: String(Date.now()),
      name: data.name,
      slug,
      created_at: new Date().toISOString()
    };
    localCategories.push(newCat);
    return newCat;
  },

  async deleteCategory(id) {
    const sql = getSql();
    if (sql) {
      try {
        await sql`DELETE FROM categories WHERE id = ${id}`;
        return true;
      } catch (err) {
        console.warn('Erro ao deletar categoria no Neon:', err.message);
      }
    }
    localCategories = localCategories.filter(c => String(c.id) !== String(id));
    return true;
  }
};
