// import db from '../data-source.tsx';

export type OrderStatus = 0 | 1 | 2 | 3; // 0:受取, 1:調理中, 2:完了, 3:提供済
export type ApiOrderStatus = "調理中" | "提供済み" | "会計済み" | "キャンセル" | "注文受付";

export interface Order {
  id: number;
  table: string;
  status: OrderStatus;
  items: string[];
  time: Date;
}

// 数値 ⇔ API文字列の変換マップ
export const STATUS_MAP_TO_API: Record<OrderStatus, ApiOrderStatus> = {
    0: "注文受付", 
    1: "調理中",
    2: "提供済み",
    3: "会計済み", 
};

export const STATUS_MAP_FROM_API: Record<ApiOrderStatus, OrderStatus> = {
    "注文受付": 0,
    "調理中": 1,
    "提供済み": 2, // APIから取得できるのは基本的に調理中(1)か提供済み(2)
    "会計済み": 3,
    "キャンセル": 3, // キャンセルも完了(3)として扱う
};

// 次の数値ステータスを取得する関数
export const getOrderStatus = (currentStatus: OrderStatus): OrderStatus => {
    return (currentStatus + 1) as OrderStatus;
};

export type GroupedOrders = Record<OrderStatus, Order[]>;

/*
export async function getAllOrders(): Promise<Order[]> {
  const sql = 'SELECT id, customer_name, order_date, total_amount, status FROM orders';

  // db.all のPromiseラッパーを作成していると仮定
  return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
          if (err) {
              reject(err);
          } else {
              // rows は Order[] 型として扱える
              resolve(rows as Order[]);
          }
      });
  });
}

*/