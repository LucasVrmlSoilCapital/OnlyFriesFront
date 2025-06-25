import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from './useCart';
import { setItems } from '../api/orders';

export const useOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submitOrder = useCallback(async (
    sessionCode: string, 
    user: any, 
    cart: CartItem[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const items = cart.map((cartItem) => {
        const extras = cartItem.selectedOptions?.flatMap(option => 
          option.choices.map(choice => ({
            group_uuid: option.optionId,
            group_name: { fr: option.optionName },
            option_uuid: option.optionId,
            selection_id: choice.choiceId,
            choice_name: { fr: choice.choiceName },
            qty: 1,
            price_unit: choice.price
          }))
        ) || [];

        return {
          uuid_fritzy: cartItem.item.id,
          name: cartItem.item.name?.["fr"] || "",
          price: cartItem.item.price?.regular || 0,
          number: cartItem.quantity,
          comment: "",
          extras: extras,
        };
      });

      await setItems(sessionCode, user, items);
      navigate(`/session/${sessionCode}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la validation de la commande');
      console.error('Erreur lors de la soumission de la commande:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return {
    submitOrder,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}; 