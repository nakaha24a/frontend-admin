// src/components/OrderBoard.tsx
import React from "react";
import type { GroupedOrders, OrderStatus } from "../types/order";
import OrderColumn from "./OrderColumn";

interface OrderBoardProps {
  orders: GroupedOrders;
  onStatusChange: (orderId: number) => void;
  onDelete: (orderId: number) => void;
}

// 注文ステータス表示
const getColumnTitle = (status: OrderStatus): string => {
  switch (status) {
    case 5:
      return "🔔 スタッフ呼出";
    case 0:
      return "注文受付";
    case 1:
      return "調理中";
    case 2:
      return "調理完了 (提供待ち)";
    case 3:
      return "提供済み";
    default:
      return "";
  }
};

// ステータスの順番
const STATUSES: readonly OrderStatus[] = [5, 0, 1, 2, 3];

// ステータスごとのカラム幅
const COLUMN_WIDTHS: Record<OrderStatus, number> = {
  5: 150, // 呼び出しだけ狭い
  0: 300,
  1: 300,
  2: 300,
  3: 300,
  4: 0, // ダミー　使わない
};

const OrderBoard: React.FC<OrderBoardProps> = ({
  orders,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div
      className="kds-board"
      style={{
        display: "flex",
        gap: "1rem",
        height: "100%",
        overflowX: "auto",
      }}
    >
      {STATUSES.map((status) => (
        <OrderColumn
          key={status}
          status={status}
          title={getColumnTitle(status)}
          orders={orders[status] || []}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          width={COLUMN_WIDTHS[status]}
        />
      ))}
    </div>
  );
};

export default OrderBoard;
