import { useParams } from "react-router-dom";
import { CartItem } from "../pages/Order";
import { setItems } from "../utils/order";

export const Cart = ({
  user,
  cart,
  onRemove,
}: {
  user: any;
  cart: CartItem[];
  onRemove: (itemId: string) => void;
}) => {
  const { sessionCode } = useParams();

  const total = cart.reduce(
    (sum, i) => sum + i.quantity * (i.item.price?.regular || 0),
    0
  );
  const order = async () => {
    const items = cart.map((i) => {
      return {
        uuid_fritzy: i.item.id,
        number: i.quantity,
        price: i.item.price?.regular || 0,
        name: i.item.name?.["fr"] || "",
      };
    });
    const res = await setItems(sessionCode ?? "", user, items);
    console.log("Order response:", res);
  };

  return (
    <div className="z-0 w-1/3 bg-[#FFEDCD] p-4 fixed right-0 h-[calc(100vh-80px)] top-20 shadow-lg overflow-auto">
      <h2 className="text-xl font-bold pb-4 text-br text-amber-950">Panier</h2>
      {cart.length === 0 ? (
        <>
          <p className="text-gray-500">Votre panier est vide.</p>
          <img
            src="./empty-order.png"
            alt="Empty Cart"
            className="w-32 mx-auto"
          />
        </>
      ) : (
        <ul className="space-y-3">
          {cart.map(({ item, quantity }) => (
            <li
              key={item.id}
              className="border p-2 rounded flex justify-between"
            >
              <div>
                <h3>{item.name?.["fr"]}</h3>
                <p className="text-sm">
                  {quantity} × {item.price?.regular?.toFixed(2)}€
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 text-sm"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="pt-16 font-semibold text-right pb-4">
        Total: {total.toFixed(2)}€
      </div>
      <button
        className="bg-red-600 p-2 rounded-md text-white w-full"
        onClick={order}
      >
        Commander
      </button>
    </div>
  );
};
