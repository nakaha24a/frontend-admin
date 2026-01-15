// src/components/OrderColumn.tsx
import React from "react";
import type { Order, OrderStatus } from "../types/order";
import OrderCard from "./OrderCard";

interface OrderColumnProps {
  title: string;
  orders: Order[];
  status: OrderStatus;
  onStatusChange: (orderId: number) => void;
  onDelete: (orderId: number) => void;
  width?: number;
}

const OrderColumn: React.FC<OrderColumnProps> = ({
  title,
  orders,
  onStatusChange,
  onDelete,
  width,
}) => {
  return (
    <div
      style={{
        flexShrink: 0,
        width: `${width}px`,
        padding: "10px",
        border: "1px solid #eee",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2
        style={{
          fontSize: "1.2em",
          borderBottom: "2px solid #333",
          paddingBottom: "5px",
        }}
      >
        {title} ({orders.length})
      </h2>
      <div className="order-list">
        {[...orders]
          .sort((a, b) => a.time.getTime() - b.time.getTime())
          .map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default OrderColumn;
