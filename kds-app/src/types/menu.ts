// types/menu.ts
export interface Menu {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  options?: string[];
  isRecommended?: boolean;
}

export interface MenuCategory {
  name: string;
  items: Menu[];
}

export interface MenuResponse {
  categories: MenuCategory[];
}
