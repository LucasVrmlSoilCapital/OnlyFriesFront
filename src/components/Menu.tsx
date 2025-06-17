import { useEffect, useMemo, useState } from "react";
import { MenuItemT } from "../types/menu";

export const Menu = ({
  onAddToCart,
}: {
  onAddToCart: (item: MenuItemT) => void;
}) => {
  const [menuData, setMenuData] = useState<null | MenuItemT[]>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const BASE_IMAGE_URL =
    "https://wmdadhuhhzahjdtmjqne.supabase.co/storage/v1/render/image/public/library/";

  useEffect(() => {
    fetch("https://api.fritzy.be/menu/b5ce1d14-b4b4-493c-846b-eaab8a464240")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setMenuData(data.data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const categories = useMemo(() => {
    if (!menuData) return [];
    const seen = new Map();
    for (const item of menuData) {
      if (item.category && item.category.id && !seen.has(item.category.id)) {
        seen.set(item.category.id, item.category.name.fr); // You can change .fr to dynamic language
      }
    }
    return Array.from(seen.entries()); // [ [id, name], ... ]
  }, [menuData]);

  return (
    <div className="p-4 max-w-[calc(100%*2/3)] w-full">
      {menuData ? (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded ${
                selectedCategory === null
                  ? "bg-red-600 text-white"
                  : "bg-[#FFEDCD] text-amber-950"
              }`}
            >
              Tous
            </button>
            {categories.map(([id, name]) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`px-3 py-1 rounded ${
                  selectedCategory === id
                    ? "bg-red-600 text-white"
                    : "bg-[#FFEDCD] text-amber-950"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <ul className="space-y-4">
            {menuData
              .filter((item) => item.active && !item.hidden)
              .filter(
                (item) =>
                  selectedCategory === null ||
                  item.category.id === selectedCategory
              )
              .map((item) => (
                <li key={item.id} className="border p-3 rounded shadow-sm flex">
                  <img
                    src={`${BASE_IMAGE_URL}${item.image}`}
                    alt={item.name?.["fr"] || "Menu item"}
                    className="w-32 rounded shadow"
                  />
                  <div className="ml-4 w-full flex flex-col items-start justify-between h-full">
                    <h3 className="text-lg font-semibold">
                      {item.name?.["fr"]}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.price?.regular?.toFixed(2)}€
                    </p>
                    {item.description?.["fr"] && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description["fr"]}
                      </p>
                    )}
                    <button
                      onClick={() => onAddToCart(item)}
                      className="mt-2 px-8 py-1 bg-red-600 text-white rounded"
                    >
                      Ajouter
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};
