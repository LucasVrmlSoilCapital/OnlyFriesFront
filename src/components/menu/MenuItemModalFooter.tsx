import React from 'react';
import { Button } from '../ui';

interface MenuItemModalFooterProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  totalPrice: number;
  onAddToCart: () => void;
  onClose: () => void;
  isValidSelection: boolean;
}

export const MenuItemModalFooter: React.FC<MenuItemModalFooterProps> = ({
  quantity,
  onQuantityChange,
  totalPrice,
  onAddToCart,
  onClose,
  isValidSelection
}) => {
  return (
    <div className="bg-white rounded-b-2xl border-t border-cream-200 py-3 px-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-neutral-800">Quantité:</span>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
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
              onClick={() => onQuantityChange(quantity + 1)}
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
              {totalPrice.toFixed(2)}€
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
          onClick={onAddToCart}
          disabled={!isValidSelection}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          {isValidSelection 
            ? `Ajouter au panier ${quantity > 1 ? `(${quantity})` : ''}` 
            : 'Ajouter au panier'
          }
        </Button>
      </div>
    </div>
  );
}; 