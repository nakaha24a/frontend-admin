// src/components/OrderCard.tsx

import React from "react";
import type { Order, OrderStatus } from "../types/order.ts";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: number) => void;
  onDelete: (orderId: number) => void;
}

const getButtonText = (status: OrderStatus): string => {
  switch (status) {
    case 0:
      return "調理開始";
    case 1:
      return "調理完了";
    case 2:
      return "提供完了";
    default:
      return "完了";
  }
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onDelete,
}) => {
  const now = new Date();
  const elapsedMinutes = Math.floor(
    (now.getTime() - order.time.getTime()) / 60000
  );

  const isAlert = order.status === 1 && elapsedMinutes > 15;
  const timeColor = isAlert ? "red" : "#666";

  return (
    <div
      className={`order-card status-${order.status}`}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span className="table-number">テーブル: {order.table}</span>
        <span className="order-time" style={{ color: timeColor }}>
          {elapsedMinutes}分経過
        </span>
      </div>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {order.items.map((item, index) => (
          <li key={index} style={{ fontSize: "0.9em" }}>
            • {item.name} × {item.quantity}
          </li>
        ))}
      </ul>

      {order.status < 3 && (
        <button
          onClick={() => onStatusChange(order.id)}
          className={`order-button status-${order.status}-button`}
        >
          {getButtonText(order.status)}
        </button>
      )}

      {order.status === 3 && (
        <button
          onClick={() => onDelete(order.id)}
          className="order-button delete-button"
          style={{ backgroundColor: "#F44336" }}
        >
          確認済み
        </button>
      )}
    </div>
  );
};

export default OrderCard;
