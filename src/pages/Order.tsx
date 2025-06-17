import { Menu } from "../components/Menu";
import { useState } from "react";
import { Cart } from "../components/Cart";
import { MenuItemT } from "../types/menu";

export type CartItem = {
  item: MenuItemT;
  quantity: number;
};
export const Order = ({ user }: { user: any }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItemT) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  return (
    <div className="flex w-full justify-between pt-20">
      <Menu onAddToCart={addToCart} />
      <Cart cart={cart} onRemove={removeFromCart} user={user} />
    </div>
  );
};
