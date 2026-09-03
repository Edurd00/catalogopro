import { mockCategories, mockProducts } from '../data/mockData.js';
import { supabase } from './supabase.js';

const NEON_DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL || import.meta.env.VITE_DATABASE_URL || '';

/**
 * Utilitário para executar SQL diretamente no endpoint HTTP do Neon
 */
async function queryNeon(sqlText, params = []) {
  if (!NEON_DATABASE_URL) return null;

  try {
    // Extrai o host da URL do Postgres: postgresql://user:pass@host/db...
    const match = NEON_DATABASE_URL.match(/@([^/:?]+)/);
    const host = match ? match[1] : '';
    if (!host) return null;

    const response = await fetch(`https://${host}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': NEON_DATABASE_URL
      },
      body: JSON.stringify({ query: sqlText, params })
    });

    if (!response.ok) {
      console.warn('Neon HTTP SQL retornou status:', response.status);
      return null;
    }

    const json = await response.json();
    // O retorno do Neon pode vir em json.rows ou json directamente
    return json.rows || json || [];
  } catch (err) {
    console.warn('Falha na comunicação direta com o Neon HTTP:', err.message);
    return null;
  }
}

export const db = {
  /**
   * Busca todas as categorias
   */
  async getCategories() {
    // 1. Tenta Neon HTTP se configurado
    if (NEON_DATABASE_URL) {
      const rows = await queryNeon('SELECT id, name, description, created_at FROM categories ORDER BY name ASC');
      if (rows && rows.length > 0) return rows;
    }

    // 2. Tenta Supabase se configurado
    try {
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, description, created_at')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) return data;
      }
    } catch (e) {
      // Falha silenciosa para fallback
    }

    // 3. Fallback para Mock Data (Garante vitrine perfeita para o portfólio)
    return mockCategories;
  },

  /**
   * Busca produtos aplicando filtros
   */
  async getProducts({ categoryId = null, searchQuery = '', orderBy = 'featured' } = {}) {
    let products = null;

    // 1. Tenta Neon HTTP se configurado
    if (NEON_DATABASE_URL) {
      let query = `
        SELECT p.id, p.category_id, p.name, p.name AS title, p.description, p.price, p.image_url,
               p.stock_quantity, p.is_active, p.created_at, p.updated_at,
               c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE
      `;
      const params = [];

      if (categoryId) {
        params.push(Number(categoryId));
        query += ` AND p.category_id = $${params.length}`;
      }

      if (searchQuery) {
        params.push(`%${searchQuery.toLowerCase()}%`);
        query += ` AND (LOWER(p.name) LIKE $${params.length} OR LOWER(p.description) LIKE $${params.length})`;
      }

      if (orderBy === 'asc') query += ' ORDER BY p.price ASC';
      else if (orderBy === 'desc') query += ' ORDER BY p.price DESC';
      else query += ' ORDER BY p.created_at DESC';

      const rows = await queryNeon(query, params);
      if (rows && rows.length > 0) {
        products = rows.map(r => ({
          ...r,
          categories: { name: r.category_name || 'Geral' }
        }));
      }
    }

    // 2. Tenta Supabase se configurado
    if (!products) {
      try {
        if (supabase && import.meta.env.VITE_SUPABASE_URL) {
          let query = supabase
            .from('products')
            .select('*, categories(name)')
            .eq('is_active', true);

          if (categoryId) query = query.eq('category_id', categoryId);

          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            products = data.map(p => ({
              ...p,
              name: p.name || p.title,
              title: p.title || p.name
            }));
          }
        }
      } catch (e) {
        // Falha silenciosa para fallback
      }
    }

    // 3. Fallback inteligente com mockProducts
    if (!products) {
      products = mockProducts.map(p => {
        const cat = mockCategories.find(c => c.id === p.category_id);
        return {
          ...p,
          title: p.name,
          categories: { name: cat ? cat.name : 'Geral' }
        };
      });
    }

    // Aplica filtros no array resultante se necessário
    if (categoryId) {
      products = products.filter(p => String(p.category_id) === String(categoryId));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (orderBy === 'asc') {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (orderBy === 'desc') {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return products;
  },

  /**
   * Busca produto único por ID
   */
  async getProductById(id) {
    const all = await this.getProducts();
    return all.find(p => String(p.id) === String(id)) || null;
  }
};
