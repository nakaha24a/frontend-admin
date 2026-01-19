// src/components/OrderCard.tsx
import React from "react";
import type { Order } from "../types/order";

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: number) => void;
  onDelete: (id: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onDelete,
}) => {
  // ===== スタッフ呼び出し =====
  if (order.status === 5) {
    return (
      <div
        style={{
          backgroundColor: "#fee2e2",
          border: "3px solid #ef4444",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "pulse 2s infinite",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div
              style={{
                color: "#b91c1c",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              スタッフ呼出
            </div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Table {order.table}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(order.id)}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          対応完了
        </button>
      </div>
    );
  }

  // ===== 通常注文 =====
  const timeDiff = new Date().getTime() - new Date(order.time).getTime();
  const elapsedMinutes = isNaN(timeDiff) ? 0 : Math.floor(timeDiff / 60000);

  let buttonText = "次へ";
  let buttonColor = "#3b82f6";

  if (order.status === 0) buttonText = "調理開始";
  else if (order.status === 1) {
    buttonText = "調理完了";
    buttonColor = "#eab308";
  } else if (order.status === 2) {
    buttonText = "提供する";
    buttonColor = "#f97316";
  } else if (order.status === 3) {
    buttonText = "確認済み";
    buttonColor = "#22c55e";
  }

  const handleButtonClick = () => {
    if (order.status === 3) {
      onDelete(order.id);
    } else {
      onStatusChange(order.id);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        border:
          elapsedMinutes > 20 ? "2px solid #ef4444" : "1px solid #e5e7eb",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          Table {order.table}
        </span>
        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          {elapsedMinutes}分経過
        </span>
      </div>

      {/* 注文内容 */}
      <ul style={{ paddingLeft: "20px", margin: "0 0 15px 0" }}>
            {order.items.map((item: any, idx: number) => {
              const validOptions =
                item.options?.filter(
                  (opt: any) => typeof opt.name === "string" && opt.name.trim() !== ""
                ) ?? [];

              return (
                <li key={idx} style={{ marginBottom: "5px" }}>
                  <strong>{item.name}</strong> × {item.quantity}

                  {/* 有効な option がある時だけ表示 */}
                  {validOptions.length > 0 && (
                    <ul style={{ paddingLeft: "15px", marginTop: "5px" }}>
                      {validOptions.map((opt: any, oidx: number) => (
                        <li key={oidx}>・{opt.name}</li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
      </ul>

      {/* ステータス操作 */}
      <button
        onClick={handleButtonClick}
        style={{
          width: "100%",
          backgroundColor: buttonColor,
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default OrderCard;
