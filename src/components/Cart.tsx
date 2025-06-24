import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartItem } from "../pages/Order";
import { setItems } from "../utils/order";
import { Button, LoadingSpinner, Card } from "./ui";

export const Cart = ({
  user,
  cart,
  onRemove,
  isLoading,
}: {
  user: any;
  cart: CartItem[];
  onRemove: (uniqueId: string) => void;
  isLoading: boolean;
}) => {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  const calculateItemPrice = (cartItem: CartItem) => {
    let price = cartItem.item.price?.regular || 0;
    if (cartItem.selectedOptions) {
      cartItem.selectedOptions.forEach(option => {
        option.choices.forEach(choice => {
          price += choice.price;
        });
      });
    }
    return price;
  };

  const total = cart.reduce(
    (sum, i) => sum + i.quantity * calculateItemPrice(i),
    0
  );
  const order = async () => {
    setIsLoadingOrder(true);
    const items = cart.map((i) => {
      // Transformer les selectedOptions en extras
      const extras = i.selectedOptions?.flatMap(option => 
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
        uuid_fritzy: i.item.id,
        name: i.item.name?.["fr"] || "",
        price: i.item.price?.regular || 0, // Prix unitaire de base, pas le total
        number: i.quantity,
        comment: "", // Facultatif, vide pour l'instant
        extras: extras,
      };
    });
    try {
      await setItems(sessionCode ?? "", user, items, (data) => {
        navigate(`/session/${sessionCode}/confirmation`);
      });
    } finally {
      setIsLoadingOrder(false);
    }
  };

  if (isLoading && cart.length === 0) {
    return (
      <div className="z-0 w-1/3 bg-cream-300 p-6 fixed right-0 h-[calc(100vh-84px)] top-[84px] shadow-medium border-l border-cream-400 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-neutral-600 font-medium">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="z-0 w-1/3 bg-cream-300 p-6 fixed right-0 h-[calc(100vh-84px)] top-[84px] shadow-medium border-l border-cream-400 overflow-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center shadow-soft">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-800">Mon Panier</h2>
      </div>

      {/* Cart Content */}
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <img
            src="/empty-order.png"
            alt="Panier vide"
            className="w-40 h-40 object-contain mb-4"
          />
          <h3 className="text-lg font-bold text-neutral-700 mb-2">Votre panier est vide</h3>
          <p className="text-neutral-600">Ajoutez des délicieuses frites du menu pour commencer votre commande ! 🍟</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3 flex-1">
            {cart.map((cartItem) => (
              <Card 
                key={cartItem.uniqueId}
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
                      <span className="font-medium text-sm text-neutral-600">{calculateItemPrice(cartItem).toFixed(2)}€</span>
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
            ))}
          </div>

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
              onClick={order}
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
      )}
    </div>
  );
};
