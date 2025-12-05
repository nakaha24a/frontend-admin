// src/page/OrderManagementPage.tsx

import React, { useState } from "react";
import OrderBoard from "../components/OrderBoard";
import { useOrders } from "../hook/useOrders";

interface OrderManagementPageProps {
  onBack: () => void;
}

const OrderManagementPage: React.FC<OrderManagementPageProps> = ({
  onBack,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>("");

  const {
    groupedOrders,
    loading,
    error,
    changeOrderStatus,
    deleteOrder,
    tableNumbers,
  } = useOrders(selectedTable);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ヘッダー */}
      <header
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* 戻るボタン */}
          <button
            onClick={onBack}
            style={{
              backgroundColor: "#4b5563",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← トップへ
          </button>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            キッチンディスプレイ
          </h1>
        </div>

        {/* ドロップダウン */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label
            htmlFor="table-select"
            style={{ fontSize: "0.9rem", fontWeight: "bold" }}
          >
            表示:
          </label>
          <select
            id="table-select"
            onChange={(e) => setSelectedTable(e.target.value)}
            value={selectedTable}
            style={{
              padding: "0.3rem",
              borderRadius: "0.25rem",
              color: "black",
              border: "1px solid #ccc",
            }}
          >
            <option value="">全テーブル (一括)</option>
            {tableNumbers.map((num) => (
              <option key={num} value={num}>
                Table {num}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* メインエリア */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
          backgroundColor: "#f3f4f6",
        }}
      >
        {loading && Object.keys(groupedOrders).length === 0 && !error ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            注文を読み込んでいます...
          </div>
        ) : error ? (
          <div
            style={{
              padding: "1rem",
              color: "#dc2626",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            エラーが発生しました: {error}
          </div>
        ) : (
          <OrderBoard
            orders={groupedOrders}
            onStatusChange={changeOrderStatus}
            onDelete={deleteOrder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;
