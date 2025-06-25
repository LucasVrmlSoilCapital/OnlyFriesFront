import { MenuItemT, MenuItemOptionT, OptionChoiceT } from '../types/menu';

interface Item {
  id: number;
  uuid_fritzy: string;
  name: string;
  price: number;
  number: number;
  comment: string;
  price_total: number;
  extras: ItemExtra[];
}

interface ItemExtra {
  group_uuid: string;
  group_name: { [lang: string]: string };
  option_uuid: string;
  selection_id: number;
  choice_name: { [lang: string]: string };
  qty: number;
  price_unit: number;
  price_total: number;
}

interface UserWithItems {
  user: {
    id: string;
    email: string;
  };
  items: Item[];
}

/**
 * Génère un lien Fritzy avec les commandes pré-remplies
 */
export const generateFritzyLink = (usersWithItems: UserWithItems[], menuData: MenuItemT[]): string | null => {
  try {
    const allItems: Item[] = usersWithItems.flatMap(userWithItems => userWithItems.items);
    
    if (allItems.length === 0 || !menuData) {
      return null;
    }

    const friterieId = "b5ce1d14-b4b4-493c-846b-eaab8a464240";

    const fritzyData = {
      value: [{
        id: friterieId,
        items: allItems.map(item => {
          // Trouver l'item du menu pour récupérer les infos complètes
          const menuItem = menuData?.find((m: MenuItemT) => m.id === item.uuid_fritzy);
          
          return {
            id: item.uuid_fritzy,
            uuid: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            qty: item.number,
            extras: item.extras.map(extra => {
              // Trouver l'option et le choix dans le menu pour avoir tous les champs
              const menuOption = menuItem?.options.find((opt: MenuItemOptionT) => opt.id === extra.group_uuid);
              const menuChoice = menuOption?.options.find((choice: OptionChoiceT) => choice.id === extra.selection_id);
              
              return {
                option_id: extra.group_uuid,
                selection: {
                  id: extra.selection_id,
                  name: menuChoice?.name || extra.choice_name,
                  price: extra.price_unit > 0 ? {
                    regular: extra.price_unit.toFixed(2)
                  } : {},
                  active: true
                },
                qty: extra.qty
              };
            }),
            comment: item.comment || ''
          };
        })
      }]
    };

    const payload = encodeURIComponent(btoa(JSON.stringify(fritzyData)));
    return `https://app.fritzy.be/r?id=b5ce1d14-b4b4-493c-846b-eaab8a464240&prefill=${payload}`;
  } catch (e) {
    console.error("Failed to create Fritzy link", e);
    return null;
  }
}; 