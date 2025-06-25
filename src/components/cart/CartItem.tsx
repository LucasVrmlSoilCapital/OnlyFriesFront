import React from 'react';
import { Button, Card } from '../ui';
import { CartItem as CartItemType } from '../../hooks/useCart';

interface CartItemProps {
  cartItem: CartItemType;
  onRemove: (uniqueId: string) => void;
  calculateItemPrice: (cartItem: CartItemType) => number;
}

export const CartItem: React.FC<CartItemProps> = ({
  cartItem,
  onRemove,
  calculateItemPrice
}) => {
  return (
    <Card 
      variant="elevated"
      padding="md"
      rounded="lg"
      className="bg-gradient-to-br from-white to-cream-50 hover:shadow-medium transition-all duration-200"
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 items-center gap-4">
          {/* Colonne 1: Nom de l'item */}
          <div className="flex flex-start">
            <h3 className="font-semibold text-neutral-800 whitespace-nowrap truncate">
              {cartItem.item.name?.["fr"]}
            </h3>
          </div>
          
          {/* Colonne 2: Quantité, prix et bouton supprimer */}
          <div className="flex items-center gap-3 justify-end">
            <span className="bg-primary-100 px-3 py-1 rounded-full text-primary-700 font-bold text-sm">
              {cartItem.quantity}x
            </span>
            <span className="font-medium text-sm text-neutral-600">
              {calculateItemPrice(cartItem).toFixed(2)}€
            </span>
            <Button
              onClick={() => onRemove(cartItem.uniqueId)}
              variant="ghost"
              size="sm"
              className="text-error-500 hover:text-error-600 hover:bg-error-50 p-2 rounded-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Options sélectionnées */}
        {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
          <div className="ml-4 space-y-1">
            {cartItem.selectedOptions.map((option, index) => (
              <div key={index} className="text-xs text-neutral-600">
                <span className="font-medium">{option.optionName}:</span>
                <span className="ml-1">
                  {option.choices.map(choice => choice.choiceName).join(", ")}
                </span>
                {option.choices.some(choice => choice.price > 0) && (
                  <span className="ml-1 text-green-600">
                    (+{option.choices.reduce((sum, choice) => sum + choice.price, 0).toFixed(2)}€)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}; 