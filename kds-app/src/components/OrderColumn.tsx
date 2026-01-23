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

 // 注文ステータスごとのカラム構築
const OrderColumn: React.FC<OrderColumnProps> = ({
  title,
  orders,
  onStatusChange,
  onDelete,
  width = 300,
}) => {
  return (
    <div
      style={{
        flexShrink: 0,
        width,
        padding: "10px",
        border: "1px solid #eee",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "1.2em",
          borderBottom: "2px solid #333",
          paddingBottom: "5px",
          marginBottom: "10px",
        }}
      >
        {title} ({orders.length})
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {orders.map((order) => (
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
