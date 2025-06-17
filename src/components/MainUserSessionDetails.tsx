import React, { useEffect, useState } from "react";
import { getAllItems } from "../utils/getAllItems";
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

export const MainUserSessionDetails = (userId: any) => {
  const { sessionCode } = useParams();
  const [aggregatedItems, setAggregatedItems] = useState<AggregatedItem[]>([]);

  useEffect(() => {
    const callGetAllItems = async () => {
      const response = await getAllItems(sessionCode as string, userId.userId);
      const items: Item[] = response.data;

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

      setAggregatedItems(Object.values(aggregated));
    };

    callGetAllItems();
  }, [sessionCode, userId]);

  return (
    <div className="p-4 bg-[#FFEDCD] h-fit">
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
        </div>
      </div>
    </div>
  );
};
