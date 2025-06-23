import React, { useEffect, useState } from "react";
import { getAllItems } from "../utils/getAllItems";
import { getSessionUsers } from "../utils/getSessionUsers";
import { useParams } from "react-router-dom";

interface Item {
  id: number;
  created_at: string;
  command_id: number;
  uuid_fritzy: string;
  price: number;
  number: number;
  name: string;
}

interface AggregatedItem {
  uuid_fritzy: string;
  name: string;
  items: Item[];
  totalPrice: number;
  totalNumber: number;
}

interface User {
  id: string;
  email: string;
  has_ordered: boolean;
}

export const MainUserSessionDetails = (userId: any) => {
  const { sessionCode } = useParams();
  const [aggregatedItems, setAggregatedItems] = useState<AggregatedItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fritzyLink, setFritzyLink] = useState<string>("");

  useEffect(() => {
    const callData = async () => {
      try {
        const itemsResponse = await getAllItems(sessionCode as string, userId.userId);
        const items: Item[] = itemsResponse.data;

        const usersResponse = await getSessionUsers(sessionCode as string);
        setUsers(usersResponse.users);

        // Agréger les items par uuid_fritzy
        const aggregated = items.reduce((acc: { [key: string]: AggregatedItem }, item) => {
          if (!acc[item.uuid_fritzy]) {
            acc[item.uuid_fritzy] = {
              uuid_fritzy: item.uuid_fritzy,
              name: item.name,
              items: [],
              totalPrice: 0,
              totalNumber: 0
            };
          }
          acc[item.uuid_fritzy].items.push(item);
          acc[item.uuid_fritzy].totalPrice += item.price * item.number;
          acc[item.uuid_fritzy].totalNumber += item.number;
          return acc;
        }, {});

        const aggregatedData = Object.values(aggregated);
        setAggregatedItems(aggregatedData);

        if (aggregatedData.length > 0) {
          const friterieId = "b5ce1d14-b4b4-493c-846b-eaab8a464240";

          const payloadObj = {
            value: [{
              id: friterieId,
              items: aggregatedData.map(group => ({
                id: group.uuid_fritzy,
                uuid: `${Date.now()}-${group.uuid_fritzy}`,
                qty: group.totalNumber,
                extras: [],
                comment: ''
              })),
              meta: { payment_type: 2, pickup_at: null }
            }]
          };

          try {
            const payload = encodeURIComponent(
              btoa(JSON.stringify(payloadObj))
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
      <div className="p-4 bg-[#FFEDCD] h-screen flex justify-start items-center flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-950 mt-8"></div>
      </div>
    );
  }

  const orderedUsers = users.filter(user => user.has_ordered);
  const pendingUsers = users.filter(user => !user.has_ordered);

  return (
    <div className="p-4 bg-[#FFEDCD] h-fit min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-amber-950">Détails de la commande</h2>
          <div className="space-y-4">
            {aggregatedItems.map((group) => (
              <div key={group.uuid_fritzy} className="bg-[#FFF5E6] p-4 rounded-lg shadow border border-amber-200 h-fit">
                <h3 className="font-semibold mb-2 text-amber-900">{group.name}</h3>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-amber-800">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-amber-600">Quantité: {item.number}</span>
                      </div>
                      <span>{item.price.toFixed(2)}€</span>
                    </div>
                  ))}
                  <div className="border-t border-amber-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-amber-950">
                      <span>Total</span>
                      <span>{group.totalPrice.toFixed(2)}€</span>
                    </div>
                    <div className="text-sm text-amber-700">
                      Nombre total d'articles: {group.totalNumber}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-[#FFF5E6] p-4 rounded-lg shadow border border-amber-200 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-amber-950">Total Général</span>
                <span className="text-xl font-bold text-amber-950">
                  {aggregatedItems.reduce((sum, group) => sum + group.totalPrice, 0).toFixed(2)}€
                </span>
              </div>
              {fritzyLink && (
                <a
                  href={fritzyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Commander sur Fritzy
                </a>
              )}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-amber-950">Statut des participants</h2>
          <div className="bg-[#FFF5E6] p-4 rounded-lg shadow border border-amber-200">
            <h3 className="font-semibold mb-2 text-amber-900">Ont commandé</h3>
            <ul>
              {orderedUsers.map(user => (
                <li key={user.id} className="text-green-700">{user.email}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#FFF5E6] p-4 rounded-lg shadow border border-amber-200 mt-4">
            <h3 className="font-semibold mb-2 text-amber-900">En attente</h3>
            <ul>
              {pendingUsers.map(user => (
                <li key={user.id} className="text-red-700">{user.email}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
