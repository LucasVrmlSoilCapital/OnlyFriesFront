import { useMemo, useState } from "react";
import { MenuItemT } from "../types/menu";
import { Button, LoadingSpinner, Card } from "./ui";

export const Menu = ({
  onAddToCart,
  menuData,
  isLoading,
}: {
  onAddToCart: (item: MenuItemT) => void;
  menuData: MenuItemT[] | null;
  isLoading: boolean;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const BASE_IMAGE_URL =
    "https://wmdadhuhhzahjdtmjqne.supabase.co/storage/v1/render/image/public/library/";

  const categories = useMemo(() => {
    if (!menuData) return [];
    const seen = new Map();
    for (const item of menuData) {
      if (item.category && item.category.id && !seen.has(item.category.id)) {
        seen.set(item.category.id, item.category.name?.fr || item.category.name?.en || 'Catégorie'); // Sécurisé
      }
    }
    return Array.from(seen.entries()); // [ [id, name], ... ]
  }, [menuData]);

  return (
    <div className="p-4 max-w-[calc(100%*2/3)] w-full bg-cream-300">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-[85vh] gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-neutral-600 text-sm">Chargement du menu...</p>
        </div>
      ) : menuData ? (
        <>
          {/* Category Filters */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? "primary" : "secondary"}
              size="md"
              className="rounded-full"
            >
              Tous
            </Button>
            {categories.map(([id, name]) => (
              <Button
                key={id}
                onClick={() => setSelectedCategory(id)}
                variant={selectedCategory === id ? "primary" : "secondary"}
                size="md"
                className="rounded-full"
              >
                {name}
              </Button>
            ))}
          </div>
          
          {/* Menu Items */}
          <div className="grid gap-4">
            {menuData
              .filter((item) => item.active && !item.hidden)
              .filter(
                (item) =>
                  selectedCategory === null ||
                  item.category?.id === selectedCategory
              )
              .map((item) => (
                <Card 
                  key={item.id} 
                  variant="elevated"
                  padding="none" 
                  rounded="lg"
                  className="bg-white border border-neutral-100 shadow-soft"
                >
                  <div className="py-4 pr-4 pl-4 grid grid-cols-3 items-center gap-4">
                    {/* Partie 1: Titre et prix à gauche */}
                    <div className="flex flex-row gap-8 items-center justify-start">
                      <img
                          src={`${BASE_IMAGE_URL}${item.image}`}
                          alt={item.name?.["fr"] || "Item du menu"}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex flex-col justify-center items-start">
                      <h3 className="text-xl font-bold text-neutral-800 mb-1 whitespace-nowrap truncate">
                        {item.name?.["fr"] || item.name?.["en"] || 'Item'}
                      </h3>
                      <div className="text-xl font-bold text-primary-600">
                        {item.price?.regular?.toFixed(2)}€
                      </div>
                    </div>
                    </div>
                    
                    {/* Partie 2: Espace vide */}
                    <div></div>
                    
                    {/* Partie 3: Image et bouton à droite */}
                    <div className="flex items-center gap-4 justify-end">
                      <Button
                        onClick={() => onAddToCart(item)}
                        variant="primary"
                        size="md"
                        disabled={isLoading}
                        className="w-12 h-12 rounded-lg p-0 flex items-center justify-center"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </>
      ) : (
        <Card variant="outlined" padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 className="text-base font-semibold text-neutral-700 mb-1">Menu indisponible</h3>
              <p className="text-sm text-neutral-600">Le menu n'a pas pu être chargé.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
