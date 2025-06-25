import React from "react";
import { MenuItemT, SelectedOption } from "../../types/menu";
import { Button } from "../ui";
import { MenuItemModalOption } from "./MenuItemModalOption";
import { MenuItemModalFooter } from "./MenuItemModalFooter";
import { useMenuItemModal } from "../../hooks/useMenuItemModal";

interface MenuItemModalProps {
  item: MenuItemT;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItemT, selectedOptions: SelectedOption[]) => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onAddToCart 
}) => {
  const {
    selectedOptions,
    quantity,
    setQuantity,
    handleOptionChange,
    canSelectMore,
    isValidSelection,
    calculateTotalPrice,
    getFormattedOptions,
    resetModal
  } = useMenuItemModal(item);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!isValidSelection) return;

    const formattedOptions = getFormattedOptions();

    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, formattedOptions);
    }
    
    onClose();
    resetModal();
  };

  const handleClose = () => {
    onClose();
    resetModal();
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
              onClick={handleClose}
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
            <MenuItemModalOption
              key={option.id}
              option={option}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
              canSelectMore={canSelectMore}
            />
          ))}
        </div>

        {/* Footer */}
        <MenuItemModalFooter
          quantity={quantity}
          onQuantityChange={setQuantity}
          totalPrice={calculateTotalPrice()}
          onAddToCart={handleAddToCart}
          onClose={handleClose}
          isValidSelection={isValidSelection}
        />
      </div>
    </div>
  );
}; 