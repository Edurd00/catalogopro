import { dbService } from './dbService.js';

export const categoryService = {
  /**
   * Retorna todas as categorias ativas
   */
  async getAllActive() {
    try {
      const categories = await dbService.getCategories();
      return categories || [];
    } catch (error) {
      console.error('Erro no categoryService.getAllActive:', error.message);
      return [];
    }
  },

  /**
   * Cria uma nova categoria
   */
  async create(data) {
    return await dbService.createCategory(data);
  },

  /**
   * Exclui uma categoria por ID
   */
  async delete(id) {
    return await dbService.deleteCategory(id);
  }
};
