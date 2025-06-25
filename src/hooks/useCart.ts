import { useState, useCallback } from 'react';
import { MenuItemT, SelectedOption } from '../types/menu';

export interface CartItem {
  item: MenuItemT;
  quantity: number;
  selectedOptions?: SelectedOption[];
  uniqueId: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const calculateItemPrice = useCallback((cartItem: CartItem): number => {
    let price = cartItem.item.price?.regular || 0;
    if (cartItem.selectedOptions) {
      cartItem.selectedOptions.forEach(option => {
        option.choices.forEach(choice => {
          price += choice.price;
        });
      });
    }
    return price;
  }, []);

  const calculateTotal = useCallback((): number => {
    return cart.reduce((sum, item) => sum + item.quantity * calculateItemPrice(item), 0);
  }, [cart, calculateItemPrice]);

  const addToCart = useCallback((item: MenuItemT, selectedOptions?: SelectedOption[], quantity: number = 1) => {
    const newCartItem: CartItem = {
      item,
      quantity,
      uniqueId: `${item.id}-${Date.now()}-${Math.random()}`,
      selectedOptions: selectedOptions || [],
    };
    setCart(prev => [...prev, newCartItem]);
  }, []);

  const removeFromCart = useCallback((uniqueId: string) => {
    setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateCartItem = useCallback((uniqueId: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => 
      item.uniqueId === uniqueId ? { ...item, ...updates } : item
    ));
  }, []);

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    calculateItemPrice,
    calculateTotal,
    itemCount: cart.length,
    isEmpty: cart.length === 0,
  };
}; 