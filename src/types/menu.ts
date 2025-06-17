export type MenuItemT = {
  active: boolean;
  category: MenuItemCategoryT;
  category_sort: string;
  description: { [lang: string]: string };
  hidden: boolean;
  id: string;
  image: string;
  name: { [lang: string]: string };
  options: MenuItemOptionT[];
  price: PriceT;
  sort: string;
};

type MenuItemCategoryT = {
  id: string;
  name: { [lang: string]: string };
  shorten: boolean;
};

type MenuItemOptionT = {
  id: string;
  restaurant: string;
  name: { [lang: string]: string };
  options: OptionsT[];
};

type OptionsT = {
  id: string;
  name: { [lang: string]: string };
  price: {};
  active: boolean;
};

type PriceT = {
  regular: number;
  discounted: number;
};
