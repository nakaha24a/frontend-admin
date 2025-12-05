import React from "react";
import type { GroupedOrders, OrderStatus } from "../types/order.ts";
import OrderColumn from "./OrderColumn";

interface OrderBoardProps {
  orders: GroupedOrders;
  onStatusChange: (orderId: number) => void;
  onDelete: (orderId: number) => void;
}

const getColumnTitle = (status: OrderStatus): string => {
  switch (status) {
    case 0:
      return "注文受付";
    case 1:
      return "調理中";
    case 2:
      return "調理完了 (提供待ち)"; // ここで止まる
    case 3:
      return "提供済み";
    default:
      return "";
  }
};

// 表示するカラムのリスト (4:KDS完了 は表示しないので含めない)
const STATUSES: readonly OrderStatus[] = [0, 1, 2, 3];

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
        />
      ))}
    </div>
  );
};

export default OrderBoard;
