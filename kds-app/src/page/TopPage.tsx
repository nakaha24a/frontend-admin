// src/page/TopPage.tsx

import React from "react";

interface TopPageProps {
  onNavigateOrder: () => void;
  onNavigateMenu: () => void;
}

const TopPage: React.FC<TopPageProps> = ({
  onNavigateOrder,
  onNavigateMenu,
}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        {/* 不要な (KDS) を削除 */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          店舗管理
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button
            onClick={onNavigateOrder}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "none",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>🍳 注文管理画面</span>
          </button>

          <button
            onClick={onNavigateMenu}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "none",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>📝 メニュー管理画面</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPage;
