import { dbService } from './dbService.js';

export const promotionService = {
  /**
   * Busca apenas produtos que estão com preço promocional preenchido e menor que o preço original
   */
  async getPromoProducts() {
    try {
      const products = await dbService.getProducts({ active: true });
      return products.filter(p => p.promotional_price && Number(p.promotional_price) < Number(p.price));
    } catch (error) {
      console.error('Erro no promotionService.getPromoProducts:', error.message);
      return [];
    }
  }
};
