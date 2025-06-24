import React, { useEffect, useState } from "react";
import { getAllItemsPerUser } from "../utils/getAllItems";
import { getSessionUsers } from "../utils/getSessionUsers";
import { useParams } from "react-router-dom";
import { MenuItemT, MenuItemOptionT, OptionChoiceT } from "../types/menu";

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

interface ItemGroup {
  uuid_fritzy: string;
  name: string;
  totalQuantity: number;
  totalPrice: number;
}

interface User {
  id: string;
  email: string;
  has_ordered: boolean;
}

export const MainUserSessionDetails = (userId: any) => {
  const { sessionCode } = useParams();
  const [usersWithItems, setUsersWithItems] = useState<UserWithItems[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fritzyLink, setFritzyLink] = useState<string>("");
  const [menuData, setMenuData] = useState<MenuItemT[] | null>(null);

  useEffect(() => {
    const callData = async () => {
      try {
        // Récupérer les données du menu
        const menuResponse = await fetch(
          "https://api.fritzy.be/menu/b5ce1d14-b4b4-493c-846b-eaab8a464240"
        );
        const menuJson = await menuResponse.json();
        const currentMenuData = menuJson.data;
        setMenuData(currentMenuData);

        // Récupérer les données avec le nouveau format
        const itemsResponse = await getAllItemsPerUser(sessionCode as string, userId.userId);
        const usersWithItemsData: UserWithItems[] = itemsResponse.users;
        
        // Récupérer tous les utilisateurs de la session
        const usersResponse = await getSessionUsers(sessionCode as string);
        setAllUsers(usersResponse.users);
        setUsersWithItems(usersWithItemsData);

        // Créer les données pour le localStorage Fritzy
        const allItems: Item[] = usersWithItemsData.flatMap(userWithItems => userWithItems.items);
        
        if (allItems.length > 0 && currentMenuData) {
          const friterieId = "b5ce1d14-b4b4-493c-846b-eaab8a464240";

          const fritzyData = {
            value: [{
              id: friterieId,
              items: allItems.map(item => {
                // Trouver l'item du menu pour récupérer les infos complètes
                const menuItem = currentMenuData?.find((m: MenuItemT) => m.id === item.uuid_fritzy);
                
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
                        name: menuChoice?.name || extra.choice_name, // Utiliser les données du menu si disponibles
                        price: extra.price_unit > 0 ? {
                          regular: extra.price_unit.toFixed(2)
                        } : {}, // Objet vide si prix = 0
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

          try {
            const payload = encodeURIComponent(
              btoa(JSON.stringify(fritzyData))
            );
            const link = `https://app.fritzy.be/r?id=b5ce1d14-b4b4-493c-846b-eaab8a464240&prefill=${payload}`;
            setFritzyLink(link);
          } catch (e) {
            console.error("Failed to create Fritzy link", e);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    callData();
  }, [sessionCode, userId]);

  if (isLoading) {
    return (
      <div className="p-4 bg-cream-300 h-screen flex justify-start items-center flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-warm-600 mt-8"></div>
      </div>
    );
  }

  const orderedUsers = allUsers.filter(user => user.has_ordered);
  const pendingUsers = allUsers.filter(user => !user.has_ordered);

  // Calculer le total général
  const grandTotal = usersWithItems.reduce((total, userWithItems) => {
    return total + userWithItems.items.reduce((userTotal, item) => {
      return userTotal + item.price_total; // Utiliser price_total qui inclut les extras
    }, 0);
  }, 0);

  // Fonction pour calculer le total d'un utilisateur
  const getUserTotal = (items: Item[]) => {
    return items.reduce((total, item) => total + item.price_total, 0); // Utiliser price_total
  };

  // Fonction pour grouper les items d'un utilisateur
  const groupUserItems = (items: Item[]) => {
    const grouped = items.reduce((acc: { [key: string]: { name: string; items: Item[]; totalPrice: number; totalQuantity: number } }, item) => {
      if (!acc[item.uuid_fritzy]) {
        acc[item.uuid_fritzy] = {
          name: item.name,
          items: [],
          totalPrice: 0,
          totalQuantity: 0
        };
      }
      acc[item.uuid_fritzy].items.push(item);
      acc[item.uuid_fritzy].totalPrice += item.price_total; // Utiliser price_total
      acc[item.uuid_fritzy].totalQuantity += item.number;
      return acc;
    }, {});
    
    return Object.values(grouped);
  };

  return (
    <div className="bg-cream-300 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-warm-800">Récapitulatif de la session</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Colonne principale - Commandes par utilisateur */}
          <div className="lg:col-span-2 space-y-6">
            {usersWithItems.length === 0 ? (
              <div className="bg-cream-200 p-6 rounded-lg shadow border border-cream-400 text-center">
                <p className="text-neutral-800">Aucune commande pour le moment</p>
              </div>
            ) : (
              usersWithItems.map((userWithItems) => {
                const groupedItems = groupUserItems(userWithItems.items);
                const userTotal = getUserTotal(userWithItems.items);
                
                return (
                  <div key={userWithItems.user.id} className="bg-white rounded-lg shadow-md border border-cream-400 overflow-hidden">
                    {/* En-tête utilisateur */}
                    <div className="bg-warm-500 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{userWithItems.user.email}</h3>
                        <span className="bg-white text-warm-700 px-3 py-1 rounded-full font-bold">
                          {userTotal.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                    
                    {/* Items de l'utilisateur */}
                    <div className="p-4 space-y-3">
                      {groupedItems.map((group) => (
                        <div key={group.name} className="bg-cream-50 p-3 rounded-lg border border-cream-200">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col justify-center items-start gap-1">
                              <h4 className="font-medium text-neutral-800">{group.name}</h4>
                              <div className="text-sm text-neutral-600">
                                Quantité: <span className="font-medium">{group.totalQuantity}</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <span className="font-bold text-warm-700 text-lg">{group.totalPrice.toFixed(2)}€</span>
                            </div>
                          </div>
                          
                          {/* Détail des items avec extras */}
                          <div className="mt-3 pt-2 border-t border-cream-200 space-y-2">
                            {group.items.map((item) => (
                              <div key={item.id} className="text-xs">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-neutral-600">× {item.number} - {item.price.toFixed(2)}€ unitaire</span>
                                  <span className="font-medium text-neutral-800">{item.price_total.toFixed(2)}€</span>
                                </div>
                                
                                {/* Affichage des extras */}
                                {item.extras.length > 0 && (
                                  <div className="ml-4 space-y-1">
                                    {item.extras.map((extra, index) => (
                                      <div key={index} className="flex justify-between items-center text-neutral-500">
                                        <span className="flex items-center">
                                          <span className="w-1 h-1 bg-neutral-400 rounded-full mr-2"></span>
                                          {extra.choice_name.fr} ({extra.group_name.fr})
                                        </span>
                                        <span>+{extra.price_total.toFixed(2)}€</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {item.comment && (
                                  <div className="ml-4 text-neutral-500 italic">
                                    💬 {item.comment}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Colonne latérale - Résumé et statuts */}
          <div className="space-y-6">
            {/* Total général */}
            <div className="bg-gradient-to-br from-cream-100 to-secondary-100 p-6 rounded-lg shadow-md border border-cream-300">
              <h3 className="text-xl font-bold text-warm-800 mb-4">Résumé total</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-warm-900 mb-2">
                  {grandTotal.toFixed(2)}€
                </div>
                <div className="text-sm text-neutral-700">
                  {usersWithItems.length} commande{usersWithItems.length > 1 ? 's' : ''}
                </div>
              </div>
              
              {fritzyLink && (
                <a
                  href={fritzyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  🍟 Commander sur Fritzy
                </a>
              )}
            </div>

            {/* Statut des participants */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-cream-400">
              <h3 className="text-xl font-bold text-warm-800 mb-4">Statut des participants</h3>
              
              {/* Utilisateurs qui ont commandé */}
              <div className="mb-4">
                <h4 className="font-semibold text-success-700 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-success-500 rounded-full mr-2"></span>
                  Ont commandé ({orderedUsers.length})
                </h4>
                <div className="space-y-1">
                  {orderedUsers.map(user => (
                    <div key={user.id} className="text-sm text-success-800 bg-success-50 px-2 py-1 rounded border border-success-200">
                      {user.email}
                    </div>
                  ))}
                </div>
              </div>

              {/* Utilisateurs en attente */}
              <div>
                <h4 className="font-semibold text-warning-700 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-warning-500 rounded-full mr-2"></span>
                  En attente ({pendingUsers.length})
                </h4>
                <div className="space-y-1">
                  {pendingUsers.map(user => (
                    <div key={user.id} className="text-sm text-warning-800 bg-warning-50 px-2 py-1 rounded border border-warning-200">
                      {user.email}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
