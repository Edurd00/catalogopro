import { db } from '../config/db.js';

export const categoryService = {
  /**
   * Retorna todas as categorias do catálogo
   */
  async getAllActive() {
    try {
      const categories = await db.getCategories();
      return categories || [];
    } catch (error) {
      console.error('Erro no categoryService.getAllActive:', error.message);
      return [];
    }
  }
};