import { dbService } from '../services/dbService.js';

export const db = {
  async getCategories() {
    return await dbService.getCategories();
  },

  async getProducts({ categoryId = null, searchQuery = '', orderBy = 'featured' } = {}) {
    let products = await dbService.getProducts({ categoryId, searchQuery, active: true });

    if (orderBy === 'asc') {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (orderBy === 'desc') {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return products;
  },

  async getProductById(id) {
    return await dbService.getProductById(id);
  }
};
