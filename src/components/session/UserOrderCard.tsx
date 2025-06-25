import React from 'react';

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

interface ItemGroup {
  name: string;
  items: Item[];
  totalPrice: number;
  totalQuantity: number;
}

interface UserOrderCardProps {
  userEmail: string;
  userId: string;
  items: Item[];
}

export const UserOrderCard: React.FC<UserOrderCardProps> = ({
  userEmail,
  userId,
  items
}) => {
  // Calculer le total d'un utilisateur
  const getUserTotal = (items: Item[]) => {
    return items.reduce((total, item) => total + item.price_total, 0);
  };

  // Grouper les items d'un utilisateur
  const groupUserItems = (items: Item[]): ItemGroup[] => {
    const grouped = items.reduce((acc: { [key: string]: ItemGroup }, item) => {
      if (!acc[item.uuid_fritzy]) {
        acc[item.uuid_fritzy] = {
          name: item.name,
          items: [],
          totalPrice: 0,
          totalQuantity: 0
        };
      }
      acc[item.uuid_fritzy].items.push(item);
      acc[item.uuid_fritzy].totalPrice += item.price_total;
      acc[item.uuid_fritzy].totalQuantity += item.number;
      return acc;
    }, {});
    
    return Object.values(grouped);
  };

  const groupedItems = groupUserItems(items);
  const userTotal = getUserTotal(items);

  return (
    <div className="bg-white rounded-lg shadow-md border border-cream-400 overflow-hidden">
      {/* En-tête utilisateur */}
      <div className="bg-warm-500 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{userEmail}</h3>
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
}; 