import { MenuItemT } from '../types/menu';

const FRITZY_MENU_URL = "https://api.fritzy.be/menu/b5ce1d14-b4b4-493c-846b-eaab8a464240";

/**
 * Récupère le menu complet depuis l'API Fritzy
 */
export const getMenu = async (): Promise<MenuItemT[]> => {
  try {
    const response = await fetch(FRITZY_MENU_URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const menuJson = await response.json();
    return menuJson.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    throw new Error('Impossible de charger le menu');
  }
};

/**
 * Récupère un item spécifique du menu par son ID
 */
export const getMenuItem = async (itemId: string): Promise<MenuItemT | null> => {
  try {
    const menuData = await getMenu();
    return menuData.find(item => item.id === itemId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'item:', error);
    throw new Error('Impossible de charger l\'item');
  }
}; 