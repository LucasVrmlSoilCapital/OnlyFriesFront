import React from "react";
import { LoadingSpinner } from "../ui";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { useCart, useOrder, type CartItem as CartItemType } from "../../hooks";
import { useParams } from "react-router-dom";

interface CartProps {
  user: any;
  cart: CartItemType[];
  onRemove: (uniqueId: string) => void;
  isLoading: boolean;
}

export const Cart: React.FC<CartProps> = ({
  user,
  cart,
  onRemove,
  isLoading,
}) => {
  const { sessionCode } = useParams();
  const { calculateItemPrice } = useCart();
  const { submitOrder, isLoading: isLoadingOrder } = useOrder();

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * calculateItemPrice(item),
    0
  );

  const handleOrder = async () => {
    if (sessionCode && user) {
      await submitOrder(sessionCode, user, cart);
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
        <EmptyCart />
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3 flex-1">
            {cart.map((cartItem) => (
              <CartItem
                key={cartItem.uniqueId}
                cartItem={cartItem}
                onRemove={onRemove}
                calculateItemPrice={calculateItemPrice}
              />
            ))}
          </div>

          <CartSummary
            total={total}
            onOrder={handleOrder}
            isLoadingOrder={isLoadingOrder}
          />
        </>
      )}
    </div>
  );
}; 