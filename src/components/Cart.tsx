import { CartItem } from "../pages/Order";

export const Cart = ({
  cart,
  onRemove,
}: {
  cart: CartItem[];
  onRemove: (itemId: string) => void;
}) => {
  const total = cart.reduce(
    (sum, i) => sum + i.quantity * (i.item.price?.regular || 0),
    0
  );

  return (
    <div className="w-1/3 bg-[#FFEDCD] p-4">
      <h2 className="text-xl font-bold mb-4">Panier</h2>
      {cart.length === 0 ? (
        <>
          <p className="text-gray-500">Votre panier est vide.</p>
          <img
            src="./empty-order.png"
            alt="Empty Cart"
            className="w-32 mx-auto mt-4"
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
                <p className="text-🍟sm">
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
      <div className="mt-4 font-semibold text-right">
        Total: {total.toFixed(2)}€
      </div>
      <button className="bg-red-600 p-2 rounded-md text-white w-full">
        Commander
      </button>
    </div>
  );
};
