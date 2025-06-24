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
  allow_comment?: boolean;
};

type MenuItemCategoryT = {
  id: string;
  name: { [lang: string]: string };
  shorten: boolean;
};

export type MenuItemOptionT = {
  id: string;
  restaurant: string;
  name: { [lang: string]: string };
  description?: { [lang: string]: string };
  type: number;
  options: OptionChoiceT[];
  active: boolean;
  sort: number;
  max: number | null;
  required: boolean;
  shorten: boolean;
};

export type OptionChoiceT = {
  id: number;
  name: { [lang: string]: string };
  price: {
    regular?: string;
    discounted?: string;
  };
  active: boolean;
};

type PriceT = {
  regular: number;
  discounted: number;
};

export type SelectedOption = {
  optionId: string;
  optionName: string;
  choices: {
    choiceId: number;
    choiceName: string;
    price: number;
  }[];
};
