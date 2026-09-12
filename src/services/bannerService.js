import { dbService } from './dbService.js';

export const bannerService = {
  /**
   * Retorna informações de banner da loja
   */
  async getActiveBanners() {
    try {
      const settings = await dbService.getStoreSettings();
      if (settings && settings.banner_url) {
        return [{ id: '1', image_url: settings.banner_url, active: true }];
      }
      return [];
    } catch (error) {
      console.error('Erro no bannerService.getActiveBanners:', error.message);
      return [];
    }
  }
};
