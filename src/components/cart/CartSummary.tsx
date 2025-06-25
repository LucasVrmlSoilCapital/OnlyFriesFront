import React from 'react';
import { Button, Card } from '../ui';

interface CartSummaryProps {
  total: number;
  onOrder: () => void;
  isLoadingOrder: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  total,
  onOrder,
  isLoadingOrder
}) => {
  return (
    <>
      {/* Total */}
      <Card 
        variant="elevated" 
        padding="lg" 
        rounded="lg"
        className="mt-6 bg-gradient-to-r from-secondary-50 to-warning-50 border-secondary-200"
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-neutral-700">Total</span>
          <span className="text-2xl font-bold text-primary-600">{total.toFixed(2)}€</span>
        </div>
      </Card>

      {/* Order Button */}
      <div className="mt-6 space-y-3">
        <Button
          onClick={onOrder}
          loading={isLoadingOrder}
          size="xl"
          className="w-full"
          variant="primary"
        >
          {isLoadingOrder ? "Validation en cours..." : "Valider ma commande"}
        </Button>
        <p className="text-xs text-center text-neutral-600 bg-warning-50 p-3 rounded-xl border border-warning-200">
          ⚠️ Passer une nouvelle commande écrasera la précédente
        </p>
      </div>
    </>
  );
}; 