import { useState, useEffect } from 'react';
import { MenuItemT } from '../types/menu';
import { getMenu } from '../api/menu';

export const useMenu = () => {
  const [menuData, setMenuData] = useState<MenuItemT[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMenu();
        setMenuData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du menu');
        console.error('Erreur lors de la récupération du menu:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const getItemById = (id: string): MenuItemT | undefined => {
    return menuData?.find(item => item.id === id);
  };

  const getItemsByCategory = (categoryId: string): MenuItemT[] => {
    return menuData?.filter(item => item.category.id === categoryId) || [];
  };

  const searchItems = (query: string): MenuItemT[] => {
    if (!menuData || !query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return menuData.filter(item => 
      item.name?.fr?.toLowerCase().includes(lowerQuery) ||
      item.name?.en?.toLowerCase().includes(lowerQuery) ||
      item.description?.fr?.toLowerCase().includes(lowerQuery) ||
      item.description?.en?.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    menuData,
    isLoading,
    error,
    getItemById,
    getItemsByCategory,
    searchItems,
    refetch: () => {
      setMenuData(null);
      setIsLoading(true);
      setError(null);
    }
  };
}; 