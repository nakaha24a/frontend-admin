import { useState } from "react";
import "./App.css";
import TopPage from "./page/TopPage";
import OrderManagementPage from "./page/OrderManagementPage";
import MenuManagementPage from "./page/MenuManagementPage";

function App() {
  const [currentPage, setCurrentPage] = useState<"top" | "order" | "menu">(
    "top"
  );

  return (
    <div className="app-container">
      {currentPage === "top" && (
        <TopPage
          onNavigateOrder={() => setCurrentPage("order")}
          onNavigateMenu={() => setCurrentPage("menu")}
        />
      )}

      {currentPage === "order" && (
        <OrderManagementPage onBack={() => setCurrentPage("top")} />
      )}

      {currentPage === "menu" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "auto",
            backgroundColor: "#f3f4f6",
          }}
        >
          {/* ヘッダー */}
          <div
            style={{
              backgroundColor: "#1f2937",
              color: "white",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => setCurrentPage("top")}
              style={{
                backgroundColor: "#4b5563",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "1rem",
              }}
            >
              ← トップへ
            </button>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
              メニュー管理
            </h1>
          </div>

          {/* メイン内容 */}
          <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
            <MenuManagementPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
