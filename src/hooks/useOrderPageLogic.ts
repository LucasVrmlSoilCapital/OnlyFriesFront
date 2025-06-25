import { useEffect, useState } from "react";
import { MenuItemT, SelectedOption } from "../types/menu";
import { getItems } from "../api/orders";
import { useParams } from "react-router-dom";
import { useCart, useMenu, CartItem } from "../hooks";

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

export const useOrderPageLogic = (user: any) => {
  const { sessionCode } = useParams();
  const [modalItem, setModalItem] = useState<MenuItemT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { menuData, isLoading: isMenuLoading } = useMenu();
  const { cart, setCart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user || !sessionCode || !menuData) return;

      try {
        setIsLoading(true);
        const response = await getItems(sessionCode, user.id);
        const items: FetchedItem[] = response.data;

        if (items) {
          const cartItems: CartItem[] = [];
          
          items.forEach((item) => {
            const menuItem = menuData.find(
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

              cartItems.push({
                quantity: item.number,
                item: menuItem,
                uniqueId: `${item.uuid_fritzy}-${item.id}-${Date.now()}`,
                selectedOptions: selectedOptions,
              });
            }
          });

          setCart(cartItems);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user, sessionCode, menuData, setCart]);

  const handleAddToCart = (item: MenuItemT) => {
    // Vérifier si l'item a des options
    if (item.options && item.options.length > 0) {
      setModalItem(item);
      setIsModalOpen(true);
    } else {
      // Ajouter directement au panier si pas d'options
      addToCart(item);
    }
  };

  const handleAddToCartWithOptions = (item: MenuItemT, selectedOptions: SelectedOption[]) => {
    addToCart(item, selectedOptions);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItem(null);
  };

  return {
    // State
    modalItem,
    isModalOpen,
    isLoading,
    menuData,
    isMenuLoading,
    cart,
    
    // Actions
    handleAddToCart,
    handleAddToCartWithOptions,
    closeModal,
    removeFromCart,
  };
}; 