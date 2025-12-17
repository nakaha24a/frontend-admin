// src/api/backendapi.tsx

import type { ApiOrderStatus, Order } from "../types/order";
import type { MenuResponse, Menu } from "../types/menu";
import type { MenuImage } from "../types/menuimage";

export interface KitchenOrder {
  id: number;
  table_number: string;
  items: string;
  status: ApiOrderStatus;
  time: string;
  timestamp: string | number | Date;
}

// 環境変数 (ここは .env の設定、つまり ...16:3000 が使われます)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function fetchKitchenOrders(): Promise<KitchenOrder[]> {
  const url = `${API_BASE_URL}/api/kitchen/orders`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch kitchen orders");
  return response.json();
}

// 注文API呼び出し関数

export async function updateOrderStatus(
  orderId: string,
  newStatus: ApiOrderStatus
) {
  const url = `${API_BASE_URL}/api/orders/${orderId}/status`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) throw new Error("API Error");
  return response.json();
}

// テーブル番号取得API呼び出し関数

export async function fetchOrdersByTable(
  tableNumber: string
): Promise<Order[]> {
  const url = `${API_BASE_URL}/api/orders?tableNumber=${tableNumber}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("注文取得失敗");
  const apiOrders: any[] = await res.json();

  return apiOrders.map((o) => ({
    id: o.id,
    table: o.table_number.toString(),
    status: o.status,
    items: typeof o.items === "string" ? JSON.parse(o.items) : o.items || [],
    time: new Date(o.timestamp),
  })) as unknown as Order[];
}

export async function fetchTableNumbers(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/api/tables`);
  if (!res.ok) throw new Error("テーブル番号取得失敗");
  return res.json();
}

// メニュー関連
// メニュー一覧取得API呼び出し関数

export const fetchMenuList = async (): Promise<MenuResponse> => {

  const res = await fetch(`${API_BASE_URL}/api/menu`);
  if (!res.ok) throw new Error("メニュー一覧取得失敗");
  return res.json();
};


// メニュー追加API呼び出し関数

export const createMenu = async (menu: MenuImage): Promise<void> => {
  const formData = new FormData();
  formData.append("id", menu.id);
  formData.append("name", menu.name);
  formData.append("description", menu.description || "");
  formData.append("price", String(menu.price));
  formData.append("category", menu.category);
  formData.append("isRecommended", String(menu.isRecommended));
  formData.append("options", JSON.stringify(menu.options || []));

  // 画像ファイルがある場合のみ追加
  if (menu.imageFile) {
    formData.append("imageFile", menu.imageFile);
  }

  const res = await fetch(`${API_BASE_URL}/api/menu`, {
    method: "POST",
    body: formData, // ★Content-Type はブラウザが自動で multipart/form-data に設定
  });

  if (!res.ok) throw new Error("メニュー作成失敗");
};

// メニュー更新
export const updateMenu = async (
  id: string,
  menu: Partial<Menu>
): Promise<void> => {
  // 修正後: /api/menu/${id}
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menu),
  });
  if (!res.ok) throw new Error("メニュー更新失敗");
};

// メニュー削除
export const deleteMenu = async (id: string): Promise<void> => {
  // 修正後: /api/menu/${id}
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("メニュー削除失敗");
};
