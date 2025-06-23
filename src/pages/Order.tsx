import { Menu } from "../components/Menu";
import { useEffect, useState } from "react";
import { Cart } from "../components/Cart";
import { MenuItemT } from "../types/menu";
import { getItems } from "../utils/getItems";
import { useParams } from "react-router-dom";

export type CartItem = {
  item: MenuItemT;
  quantity: number;
};

interface FetchedItem {
  id: number;
  created_at: string;
  command_id: number;
  uuid_fritzy: string;
  price: number;
  number: number;
  name: string;
}

export const Order = ({ user }: { user: any }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuData, setMenuData] = useState<MenuItemT[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { sessionCode } = useParams();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const menuResponse = await fetch(
          "https://api.fritzy.be/menu/b5ce1d14-b4b4-493c-846b-eaab8a464240"
        );
        const menuJson = await menuResponse.json();
        const currentMenuData = menuJson.data;
        setMenuData(currentMenuData);

        if (user && sessionCode && currentMenuData) {
          const response = await getItems(sessionCode, user.id);
          const items: FetchedItem[] = response.data;

          if (items) {
            const cartItems: CartItem[] = items
              .map((item) => {
                const menuItem = currentMenuData.find(
                  (m: MenuItemT) => m.id === item.uuid_fritzy
                );
                if (menuItem) {
                  return {
                    quantity: item.number,
                    item: menuItem,
                  };
                }
                return null;
              })
              .filter((i): i is CartItem => i !== null);

            setCart(cartItems);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user, sessionCode]);

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
      <Menu onAddToCart={addToCart} menuData={menuData} isLoading={isLoading} />
      <Cart
        cart={cart}
        onRemove={removeFromCart}
        user={user}
        isLoading={isLoading}
      />
    </div>
  );
};
