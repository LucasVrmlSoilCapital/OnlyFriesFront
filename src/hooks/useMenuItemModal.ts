import { useState } from 'react';
import { MenuItemT, MenuItemOptionT, SelectedOption } from '../types/menu';

export const useMenuItemModal = (item: MenuItemT) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [optionId: string]: number[] }>({});
  const [quantity, setQuantity] = useState(1);

  const handleOptionChange = (optionId: string, choiceId: number, isChecked: boolean) => {
    setSelectedOptions(prev => {
      const current = prev[optionId] || [];
      if (isChecked) {
        return { ...prev, [optionId]: [...current, choiceId] };
      } else {
        return { ...prev, [optionId]: current.filter(id => id !== choiceId) };
      }
    });
  };

  const canSelectMore = (option: MenuItemOptionT) => {
    const currentSelections = selectedOptions[option.id]?.length || 0;
    return option.max === null || currentSelections < option.max;
  };

  const isValidSelection = () => {
    return item.options.every(option => {
      const selections = selectedOptions[option.id]?.length || 0;
      if (option.required && selections === 0) return false;
      if (option.max !== null && selections > option.max) return false;
      return true;
    });
  };

  const calculateTotalPrice = () => {
    let total = item.price.regular;
    
    Object.entries(selectedOptions).forEach(([optionId, choiceIds]) => {
      const option = item.options.find(opt => opt.id === optionId);
      if (option) {
        choiceIds.forEach(choiceId => {
          const choice = option.options.find(choice => choice.id === choiceId);
          if (choice && choice.price.regular) {
            total += parseFloat(choice.price.regular);
          }
        });
      }
    });
    
    return total * quantity;
  };

  const getFormattedOptions = (): SelectedOption[] => {
    return Object.entries(selectedOptions).map(([optionId, choiceIds]) => {
      const option = item.options.find(opt => opt.id === optionId)!;
      return {
        optionId,
        optionName: option.name?.fr || option.name?.en || 'Option',
        choices: choiceIds.map(choiceId => {
          const choice = option.options.find(choice => choice.id === choiceId)!;
          return {
            choiceId,
            choiceName: choice.name?.fr || choice.name?.en || 'Choix',
            price: choice.price?.regular ? parseFloat(choice.price.regular) : 0
          };
        })
      };
    });
  };

  const resetModal = () => {
    setSelectedOptions({});
    setQuantity(1);
  };

  return {
    selectedOptions,
    quantity,
    setQuantity,
    handleOptionChange,
    canSelectMore,
    isValidSelection: isValidSelection(),
    calculateTotalPrice,
    getFormattedOptions,
    resetModal
  };
}; 