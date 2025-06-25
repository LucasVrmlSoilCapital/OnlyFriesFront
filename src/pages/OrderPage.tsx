import React from "react";
import { Menu, MenuItemModal } from "../components/menu";
import { Cart } from "../components/cart";
import { useOrderPageLogic } from "../hooks";

export const OrderPage: React.FC<{ user: any }> = ({ user }) => {
  const {
    modalItem,
    isModalOpen,
    isLoading,
    menuData,
    isMenuLoading,
    cart,
    handleAddToCart,
    handleAddToCartWithOptions,
    closeModal,
    removeFromCart,
  } = useOrderPageLogic(user);

  return (
    <div className="flex w-full justify-between pt-20">
      <Menu 
        onAddToCart={handleAddToCart} 
        menuData={menuData} 
        isLoading={isMenuLoading} 
      />
      <Cart
        cart={cart}
        onRemove={removeFromCart}
        user={user}
        isLoading={isLoading}
      />
      
      {modalItem && (
        <MenuItemModal
          item={modalItem}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={handleAddToCartWithOptions}
        />
      )}
    </div>
  );
}; 