import React from "react";
import OrderBoard from "../components/OrderBoard";
import { useOrders } from "../hook/useOrders";

const OrderManagementPage: React.FC = () => {
  // 引数なし = キッチンモード（全注文取得）
  const {
    groupedOrders,
    loading,
    error,
    changeOrderStatus,
    deleteOrder,
    selectedTable, // 特定のテーブルを見たい場合のUIがあれば使う
    setSelectedTable, // 同上
    tableNumbers, // 同上
  } = useOrders();

  if (loading && Object.keys(groupedOrders).length === 0) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="order-management-page h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">
          キッチンディスプレイ (KDS)
          {/* 開発用: 接続先確認 */}
          <span className="text-xs ml-4 font-normal text-gray-400">
            Server: {import.meta.env.VITE_API_BASE_URL}
          </span>
        </h1>

        {/* 必要であればここにテーブルフィルタ用のドロップダウンを配置 */}
        {/* <select 
          className="text-black p-1 rounded"
          onChange={(e) => setSelectedTable(e.target.value)}
          value={selectedTable || ""}
        >
          <option value="">全テーブル表示</option>
          {tableNumbers.map(num => (
            <option key={num} value={num}>Table {num}</option>
          ))}
        </select>
        */}
      </header>

      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <OrderBoard
          orders={groupedOrders}
          onStatusChange={changeOrderStatus}
          onDelete={deleteOrder}
        />
      </div>
    </div>
  );
};

export default OrderManagementPage;
