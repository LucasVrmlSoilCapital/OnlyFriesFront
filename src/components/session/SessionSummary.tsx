import React from 'react';

interface SessionSummaryProps {
  grandTotal: number;
  orderCount: number;
  fritzyLink?: string;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  grandTotal,
  orderCount,
  fritzyLink
}) => {
  return (
    <div className="bg-gradient-to-br from-cream-100 to-secondary-100 p-6 rounded-lg shadow-md border border-cream-300">
      <h3 className="text-xl font-bold text-warm-800 mb-4">Résumé total</h3>
      <div className="text-center">
        <div className="text-3xl font-bold text-warm-900 mb-2">
          {grandTotal.toFixed(2)}€
        </div>
        <div className="text-sm text-neutral-700">
          {orderCount} commande{orderCount > 1 ? 's' : ''}
        </div>
      </div>
      
      {fritzyLink && (
        <a
          href={fritzyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          🍟 Commander sur Fritzy
        </a>
      )}
    </div>
  );
}; 