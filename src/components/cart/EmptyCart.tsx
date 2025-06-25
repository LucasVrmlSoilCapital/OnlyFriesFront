import React from 'react';

export const EmptyCart: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <img
        src="/empty-order.png"
        alt="Panier vide"
        className="w-40 h-40 object-contain mb-4"
      />
      <h3 className="text-lg font-bold text-neutral-700 mb-2">Votre panier est vide</h3>
      <p className="text-neutral-600">
        Ajoutez des délicieuses frites du menu pour commencer votre commande ! 🍟
      </p>
    </div>
  );
}; 