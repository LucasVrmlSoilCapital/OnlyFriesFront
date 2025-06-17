import { useEffect, useState } from "react";
import { MenuItemT } from "../types/menu";

export const Menu = () => {
  const [menuData, setMenuData] = useState<null | MenuItemT[]>(null);
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
  return (
    <div className="p-4 max-w-xl mx-auto">
      {menuData ? (
        <ul className="space-y-4">
          {menuData
            .filter((item) => item.active && !item.hidden)
            .map((item) => (
              <li
                key={item.id}
                className="border p-3 rounded shadow-sm flex flex-col items-center"
              >
                <img
                  src={`${BASE_IMAGE_URL}${item.image}`}
                  alt={item.name?.["fr"] || "Menu item"}
                  className="w-full max-w-xs rounded shadow"
                />
                <h3 className="text-lg font-semibold">{item.name?.["fr"]}</h3>
                <p className="text-sm text-gray-600">
                  {item.price?.regular?.toFixed(2)}€
                </p>
                {item.description?.["fr"] && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.description["fr"]}
                  </p>
                )}
              </li>
            ))}
        </ul>
      ) : (
        <div></div>
      )}
    </div>
  );
};
