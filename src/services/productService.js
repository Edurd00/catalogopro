import { db } from '../config/db.js';

export const productService = {
  /**
   * Busca produtos aplicando filtros dinâmicos (Categoria, Busca, Ordenação)
   */
  async getProducts({ categoryId, searchQuery, orderBy = 'featured' } = {}) {
    return await db.getProducts({ categoryId, searchQuery, orderBy });
  },

  /**
   * Busca um produto específico através do ID
   */
  async getById(id) {
    return await db.getProductById(id);
  }
};