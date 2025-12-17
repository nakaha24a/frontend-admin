// src/types/menuimage.ts

import type { Menu } from "./menu";

export interface MenuImage extends Omit<Menu, "image"> {
  imageFile?: File; // ← アップロード用
}
