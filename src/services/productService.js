import { dbService } from './dbService.js';

export const productService = {
  /**
   * Busca produtos aplicando filtros dinâmicos
   */
  async getProducts({ categoryId = null, searchQuery = '', featured = null, active = true, orderBy = 'featured' } = {}) {
    let products = await dbService.getProducts({ categoryId, searchQuery, featured, active });

    if (orderBy === 'asc') {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (orderBy === 'desc') {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return products;
  },

  /**
   * Busca um produto específico através do ID
   */
  async getById(id) {
    return await dbService.getProductById(id);
  },

  /**
   * Cria um novo produto
   */
  async create(data) {
    return await dbService.createProduct(data);
  },

  /**
   * Atualiza um produto existente
   */
  async update(id, data) {
    return await dbService.updateProduct(id, data);
  },

  /**
   * Remove um produto
   */
  async delete(id) {
    return await dbService.deleteProduct(id);
  }
};
