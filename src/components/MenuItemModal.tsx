import { useState } from "react";
import { MenuItemT, MenuItemOptionT, OptionChoiceT, SelectedOption } from "../types/menu";
import { Button, Card } from "./ui";

interface MenuItemModalProps {
  item: MenuItemT;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItemT, selectedOptions: SelectedOption[]) => void;
}

export const MenuItemModal = ({ item, isOpen, onClose, onAddToCart }: MenuItemModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [optionId: string]: number[] }>({});
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

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

  const handleAddToCart = () => {
    if (!isValidSelection()) return;

    const formattedOptions: SelectedOption[] = Object.entries(selectedOptions).map(([optionId, choiceIds]) => {
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

    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, formattedOptions);
    }
    
    onClose();
    setSelectedOptions({});
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream-300 rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-medium border border-cream-400 flex flex-col">
        {/* Header */}
        <div className="relative bg-cream-300 rounded-t-2xl border-b border-cream-200 p-6 flex-shrink-0">
          <div className="flex justify-center items-center">
                          <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                  {item.name?.fr || item.name?.en || 'Item'}
                </h2>
                <p className="text-neutral-600">{item.description?.fr || item.description?.en || ''}</p>
              </div>
            <Button 
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-neutral-500 hover:text-neutral-700 p-2 h-auto absolute top-4 right-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Options Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {item.options.map((option) => (
            <div 
              key={option.id}
              className="bg-white rounded-xl border border-cream-200 p-5 shadow-soft"
            >
              <div className="space-y-4">
                                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-1">
                      {option.name?.fr || option.name?.en || 'Option'}
                      {option.required && <span className="text-error-500 ml-2">*</span>}
                    </h3>
                    
                    {option.description && (
                      <p className="text-sm text-neutral-600 mb-2">
                        {option.description?.fr || option.description?.en || ''}
                      </p>
                    )}

                  {option.max && option.max > 1 && (
                    <p className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-lg inline-block">
                      Maximum {option.max} choix
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {option.options
                    .filter(choice => choice.active)
                    .map((choice) => {
                      const isSelected = selectedOptions[option.id]?.includes(choice.id) || false;
                      const canSelect = canSelectMore(option) || isSelected;
                      
                      return (
                        <div
                          key={choice.id}
                          className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-cream-200 bg-cream-50 hover:bg-cream-100 hover:border-cream-300'
                          } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (canSelect || isSelected) {
                              handleOptionChange(option.id, choice.id, !isSelected);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected 
                                  ? 'border-primary-500 bg-primary-500' 
                                  : 'border-neutral-300 bg-white'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium text-neutral-800">
                                {choice.name?.fr || choice.name?.en || 'Choix'}
                              </span>
                            </div>
                            {choice.price.regular && (
                              <span className="text-success-600 font-bold text-sm">
                                +{parseFloat(choice.price.regular).toFixed(2)}€
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl border-t border-cream-200 py-3 px-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-neutral-800">Quantité:</span>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="secondary"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                  </svg>
                </Button>
                <span className="w-12 text-center font-bold text-lg text-neutral-800">
                  {quantity}
                </span>
                <Button 
                  onClick={() => setQuantity(quantity + 1)}
                  variant="secondary"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cream-100 to-cream-200 border border-cream-300 rounded-xl p-4 shadow-soft">
              <div className="text-right flex justify-center items-center gap-3">
                <div className="text-xl text-neutral-600">Total</div>
                <div className="text-xl font-bold text-primary-600">
                  {calculateTotalPrice().toFixed(2)}€
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddToCart}
              disabled={!isValidSelection()}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              {isValidSelection() 
                ? `Ajouter au panier ${quantity > 1 ? `(${quantity})` : ''}` 
                : 'Ajouter au panier'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 