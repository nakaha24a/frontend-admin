export interface OrderItem {
  name: string;
  quantity: number;
  // ...
}

// ステータスID: 0:受付, 1:調理中, 2:調理完了, 3:提供済み, 4:KDS完了(非表示)
export type OrderStatus = 0 | 1 | 2 | 3 | 4;

// APIでやり取りする文字列
export type ApiOrderStatus =
  | "注文受付"
  | "調理中"
  | "調理完了"
  | "提供済み"
  | "会計済み"
  | "キャンセル"
  | "呼び出し"
  | "KDS完了";

export interface Order {
  id: number;
  table: string;
  status: OrderStatus;
  items: any[];
  time: Date;
}

export type GroupedOrders = Record<OrderStatus, Order[]>;
