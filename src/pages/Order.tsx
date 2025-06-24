import { Menu } from "../components/Menu";
import { useEffect, useState } from "react";
import { Cart } from "../components/Cart";
import { MenuItemT, SelectedOption } from "../types/menu";
import { getItems } from "../utils/getItems";
import { useParams } from "react-router-dom";
import { MenuItemModal } from "../components/MenuItemModal";

export type CartItem = {
  item: MenuItemT;
  quantity: number;
  selectedOptions?: SelectedOption[];
  uniqueId: string; // Pour différencier les items avec différentes options
};

interface FetchedItem {
  id: number;
  uuid_fritzy: string;
  name: string;
  price: number;
  number: number;
  comment: string;
  price_total: number;
  extras: FetchedExtra[];
}

interface FetchedExtra {
  group_uuid: string;
  group_name: { [lang: string]: string };
  option_uuid: string;
  selection_id: number;
  choice_name: { [lang: string]: string };
  qty: number;
  price_unit: number;
  price_total: number;
}

export const Order = ({ user }: { user: any }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuData, setMenuData] = useState<MenuItemT[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalItem, setModalItem] = useState<MenuItemT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
                  // Reconstituer les selectedOptions à partir des extras
                  const selectedOptionsMap = new Map<string, SelectedOption>();
                  
                  item.extras.forEach(extra => {
                    const optionId = extra.group_uuid;
                    const optionName = extra.group_name.fr || extra.group_name.en || '';
                    
                    if (!selectedOptionsMap.has(optionId)) {
                      selectedOptionsMap.set(optionId, {
                        optionId,
                        optionName,
                        choices: []
                      });
                    }
                    
                    selectedOptionsMap.get(optionId)!.choices.push({
                      choiceId: extra.selection_id,
                      choiceName: extra.choice_name.fr || extra.choice_name.en || '',
                      price: extra.price_unit
                    });
                  });

                  const selectedOptions = Array.from(selectedOptionsMap.values());

                  return {
                    quantity: item.number,
                    item: menuItem,
                    uniqueId: `${item.uuid_fritzy}-${item.id}-${Date.now()}`,
                    selectedOptions: selectedOptions,
                  } as CartItem;
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
    // Vérifier si l'item a des options
    if (item.options && item.options.length > 0) {
      setModalItem(item);
      setIsModalOpen(true);
    } else {
      // Ajouter directement au panier si pas d'options
      const newCartItem: CartItem = {
        item,
        quantity: 1,
        uniqueId: `${item.id}-${Date.now()}-${Math.random()}`,
        selectedOptions: [],
      };
      setCart((prev) => [...prev, newCartItem]);
    }
  };

  const addToCartWithOptions = (item: MenuItemT, selectedOptions: SelectedOption[]) => {
    const newCartItem: CartItem = {
      item,
      quantity: 1,
      uniqueId: `${item.id}-${Date.now()}-${Math.random()}`,
      selectedOptions,
    };
    setCart((prev) => [...prev, newCartItem]);
  };

  const removeFromCart = (uniqueId: string) => {
    setCart((prev) => prev.filter((i) => i.uniqueId !== uniqueId));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItem(null);
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
      
      {modalItem && (
        <MenuItemModal
          item={modalItem}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={addToCartWithOptions}
        />
      )}
    </div>
  );
};
