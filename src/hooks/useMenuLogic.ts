import { useMemo, useState } from "react";
import { MenuItemT } from "../types/menu";

export const useMenuLogic = (menuData: MenuItemT[] | null) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!menuData) return [];
    
    const categoryMap = new Map();
    menuData.forEach(item => {
      if (item.category && item.category.id && !categoryMap.has(item.category.id)) {
        categoryMap.set(item.category.id, item.category);
      }
    });
    return Array.from(categoryMap.values());
  }, [menuData]);

  const filteredItems = useMemo(() => {
    if (!menuData) return [];
    
    return selectedCategory 
      ? menuData.filter(item => item.category.id === selectedCategory)
      : menuData;
  }, [menuData, selectedCategory]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return {
    // State
    selectedCategory,
    categories,
    filteredItems,
    
    // Actions
    handleCategorySelect,
  };
}; 