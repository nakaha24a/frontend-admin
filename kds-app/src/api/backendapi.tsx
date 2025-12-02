import { STATUS_MAP_FROM_API, type ApiOrderStatus, type Order } from "../types/order";
import type { MenuResponse } from "../types/menu";
 
// サーバーから返される注文オブジェクトの型定義
export interface KitchenOrder {
  
  id: number;
  table_number: string; 
  items: string;
  status: "注文受付" | "提供済み";
  time: string;
  timestamp: string | number | Date;
}
 
export interface Menu {
  id: string;      
  name: string;    
  price: number;    
  category: string;
}
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
 

/* キッチン用の注文リスト（注文受付、提供済み）をサーバーから取得する */
export async function fetchKitchenOrders(): Promise<KitchenOrder[]> {
  const url = `${API_BASE_URL}/api/kitchen/orders`;
 
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch kitchen orders: ${response.status} - ${errorData.error || "Unknown error"}`
      );
    }
 
    const orders: KitchenOrder[] = await response.json();
    return orders;
  } catch (error) {
    console.error("Error during kitchen orders fetch:", error);
    throw error;
  }
}
 
export async function updateOrderStatus(
    orderId: string ,
    newStatus: ApiOrderStatus
): Promise<{ message: string; id: string; status: ApiOrderStatus }> {
    const url = `${API_BASE_URL}/api/orders/${orderId}/status`;
 
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        });
 
        const data = await response.json();
 
        if (!response.ok) {
            throw new Error(
                `API Error (${response.status}): ${data.error || 'Unknown error'}`
            );
        }
        return data;
 
    } catch (error) {
        console.error(`Error updating status for ID ${orderId}:`, error);
        throw error;
    }
}
 
/**
 * 特定テーブルの注文を取得
 */


export async function fetchOrdersByTable(tableNumber: string): Promise<Order[]> {
  const url = `${API_BASE_URL}/api/orders?tableNumber=${tableNumber}`;
 
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
 
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`注文取得失敗: ${res.status} - ${errorData.error || 'Unknown error'}`);
    }
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiOrders: any[] = await res.json();
 
    console.log("APIから取得した生データ:", apiOrders);
    // APIの文字列ステータス → 内部OrderStatusに変換
    return apiOrders.map(o => ({
      id: o.id,
      // ★ 修正: "T-" をつけず、そのまま使用する
      table: o.table_number.toString(),
      status: STATUS_MAP_FROM_API[o.status as ApiOrderStatus],
      items: o.items || [],
      time: new Date(o.timestamp),
    })) as Order[];
  } catch (err) {
    console.error('注文取得エラー:', err);
    throw err;
  }
}
 
// ✅ テーブル番号一覧を取得
export async function fetchTableNumbers(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/api/tables`);
  if (!res.ok) throw new Error("テーブル番号の取得に失敗しました");
  return res.json();
}
 
// ✅ 指定されたテーブル番号の注文を取得
export async function fetchOrderTableNumber(tableNumber: string): Promise<Order[]> {
  const url = `${API_BASE_URL}/api/orders?tableNumber=${tableNumber}`;
 
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`注文取得失敗: ${res.status} - ${err.error || "Unknown error"}`);
  }
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiOrders: any[] = await res.json();
  return apiOrders.map((o) => ({
    id: o.id,
    table: o.table_number.toString(),
    status: STATUS_MAP_FROM_API[o.status as ApiOrderStatus],
    items: Array.isArray(o.items) ? o.items : JSON.parse(o.items || "[]"),
    time: new Date(o.timestamp),
  })) as Order[];
}
 
// メニュー　API

export const fetchMenuList = async (): Promise<MenuResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/menu`);
  if (!res.ok) {
    throw new Error("メニュー一覧の取得に失敗しました。");
  }
  return res.json();
};
 
export const createMenu = async (menu: Menu): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/admin/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menu),
  });
 
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "メニューの追加に失敗しました。");
  }
};
 
export const updateMenu = async (id: string, menu: Partial<Menu>): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menu),
  });
 
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "メニューの更新に失敗しました。");
  }
};
 

export const deleteMenu = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
    method: "DELETE",
  });
 
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "メニューの削除に失敗しました。");
  }
};