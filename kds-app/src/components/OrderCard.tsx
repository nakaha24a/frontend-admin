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
  // ★ 調理チェック（UI用）
  const [cookStates, setCookStates] = React.useState<number[]>(
    order.items.map(() => 0)
  );

  React.useEffect(() => {
    setCookStates(order.items.map(() => 0));
  }, [order.id]);

  const isCookingColumn = order.status === 1;

  const allFinished =
    cookStates.length > 0 && cookStates.every((s) => s === 2);

  const isButtonEnabled =
    order.status === 5 ? true : isCookingColumn ? allFinished : true;

  // ボタン表示テキスト
  let buttonText = "次へ";
  if (order.status === 0) buttonText = "調理開始";
  else if (order.status === 1) buttonText = "調理完了";
  else if (order.status === 2) buttonText = "提供する";
  else if (order.status === 3) buttonText = "確認済み";
  else if (order.status === 5) buttonText = "対応完了";

  // ボタン色ステータス別
  const getButtonColor = (status: number) => {
    switch (status) {
      case 0:
        return "#3b82f6";
      case 1:
        return "#eab308";
      case 2:
        return "#f97316";
      case 3:
        return "#22c55e";
      case 5:
        return "#ef4444"; // 呼出は赤
      default:
        return "#9ca3af"; // 非活性はグレー
    }
  };

  // 呼出注文用スタイル
  if (order.status === 5) {
    return (
      <div
        style={{
          backgroundColor: "#fee2e2",
          border: "3px solid #ef4444",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          animation: "pulse 2s infinite",
        }}
      >
        <div>
          <div style={{ fontWeight: "bold", fontSize: 16, color: "#b91c1c" }}>
            店員呼出
          </div>
          <div style={{ fontSize: 18, fontWeight: "bold" }}>
            Table {order.table}
          </div>
        </div>
        <button
          onClick={() => onDelete(order.id)}
          style={{
            backgroundColor: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "12px 16px",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          対応完了
        </button>
      </div>
    );
  }

  // 通常注文カード
  return (
    <div style={{ background: "#fff", padding: 12, marginBottom: 10 }}>
      <strong>Table {order.table}</strong>

      <ul style={{ paddingLeft: 20, marginTop: 8 }}>
        {order.items.map((item: any, idx: number) => {
          const state = cookStates[idx];

          return (
            <li key={idx} style={{ marginBottom: 10 }}>
              <div>
                {item.name} × {item.quantity}
                {state === 2 && " ✅"}
              </div>


              {/* ★ options が配列かつ中身があれば表示 */}
              {Array.isArray(item.options) && item.options.length > 0 && (
                <ul style={{ paddingLeft: 16, marginTop: 4, fontSize: 13 }}>
                  {item.options.map(
                    (opt: { name: string }, oidx: number) => (
                      <li key={oidx}>・{opt.name}</li>
                    )
                  )}
                 {console.log("item.options:", item.options)}
                 

                </ul>
              )}

              {/* 調理チェック */}
              {/* トグルで調理開始完了を操作 */}
              {isCookingColumn && (
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() =>
                    setCookStates((prev) =>
                      prev.map((s, i) =>
                        i === idx ? Math.min(s + 1, 2) : s
                      )
                    )
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "none",
                    fontWeight: "bold",
                    fontSize: 13,
                    cursor: "pointer",
                    background:
                      state === 0 ? "#3b82f6" :
                      state === 1 ? "#eab308" :
                      "#22c55e",
                    color: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {state === 0 && "🔥 調理開始"}
                  {state === 1 && "⏳ 調理中"}
                  {state === 2 && "✅ 完了"}
                </button>
              </div>
            )}
                        </li>
                      );
                    })}
      </ul>

      {/* 全ての完了が入るまでボタンは非活性 */}
      <button
        disabled={!isButtonEnabled}
        onClick={() =>
          order.status === 3
            ? onDelete(order.id)
            : onStatusChange(order.id)
        }
        style={{
          width: "100%",
          background: isButtonEnabled ? getButtonColor(order.status) : "#9ca3af",
          color: "#fff",
          border: "none",
          padding: 8,
          cursor: isButtonEnabled ? "pointer" : "not-allowed",
        }}
      >
        {buttonText}
      </button>

      {isCookingColumn && !allFinished && (
        <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
          
        </div>
      )}
    </div>
  );
};

export default OrderCard;
