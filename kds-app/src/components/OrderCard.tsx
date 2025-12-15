// src/components/OrderCard.tsx
import React from "react";
// 型のみインポート
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
  // ★ スタッフ呼び出し用（ステータス5）
  // 時刻や経過時間はバグの元になるので表示しません
  if (order.status === 5) {
    return (
      <div
        style={{
          backgroundColor: "#fee2e2", // 薄い赤
          border: "3px solid #ef4444", // 濃い赤枠
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "15px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          textAlign: "center",
          animation: "pulse 2s infinite", // 点滅アニメーション（CSSにあれば）
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🔔</div>
        <h2
          style={{
            color: "#b91c1c",
            fontSize: "1.4rem",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          スタッフ呼び出し
        </h2>
        <p
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Table {order.table}
        </p>

        {/* ボタン */}
        <button
          onClick={() => onDelete(order.id)}
          style={{
            width: "100%",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          対応完了
        </button>
      </div>
    );
  }

  // --- 通常の注文カード ---

  // 経過時間の計算（念のためNaN対策を入れる）
  const timeDiff = new Date().getTime() - new Date(order.time).getTime();
  const elapsedMinutes = isNaN(timeDiff) ? 0 : Math.floor(timeDiff / 60000);

  let buttonText = "次へ";
  let buttonColor = "#3b82f6"; // blue

  if (order.status === 0) buttonText = "調理開始";
  else if (order.status === 1) {
    buttonText = "調理完了";
    buttonColor = "#eab308";
  } // yellow
  else if (order.status === 2) {
    buttonText = "提供する";
    buttonColor = "#f97316";
  } // orange
  else if (order.status === 3) {
    buttonText = "確認済み";
    buttonColor = "#22c55e";
  } // green

  const handleButtonClick = () => {
    if (order.status === 3) {
      onDelete(order.id); // 完了して削除
    } else {
      onStatusChange(order.id); // ステータスを進める
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
        border: elapsedMinutes > 20 ? "2px solid #ef4444" : "1px solid #e5e7eb",
      }}
    >
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

      <ul style={{ paddingLeft: "20px", margin: "0 0 15px 0" }}>
        {order.items.map((item: any, idx: number) => (
          <li key={idx} style={{ marginBottom: "5px" }}>
            <span style={{ fontWeight: "bold" }}>{item.name}</span> x{" "}
            {item.quantity}
            {item.options && item.options.length > 0 && (
              <ul
                style={{ fontSize: "0.85rem", color: "#666", marginTop: "2px" }}
              >
                {item.options.map((opt: any, i: number) => (
                  <li key={i}>{opt.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleButtonClick}
          style={{
            flex: 1,
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
    </div>
  );
};

export default OrderCard;
