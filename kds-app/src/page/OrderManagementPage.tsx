import React, { useState, useEffect } from 'react';
import { useOrders } from '../hook/useOrders';
import OrderBoard from '../components/OrderBoard';
import { fetchTableNumbers } from '../api/backendapi';
import { useNavigate } from 'react-router-dom';

const OrderManagementPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | undefined>();
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const {groupedOrders, loading, error, changeOrderStatus, deleteOrder, setSelectedTable: setTable } = useOrders(selectedTable);
   const navigate = useNavigate();

  // 初回レンダーでテーブル番号一覧を取得
  useEffect(() => {
    fetchTableNumbers()
      .then((tables) => setTableNumbers(tables))
      .catch((err) => console.error('テーブル番号取得エラー:', err));
  }, []);

  // テーブル選択変更時に useOrders に伝える
  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const table = e.target.value;
    setSelectedTable(table); // local state
    setTable?.(table);       // useOrders 内の state に反映
  };

  return (
    <div className="kds-page-container">
      <header className="kds-header">
        <h1>🍕 注文管理ボード</h1>
        <div>
          <label>
            テーブル選択:
            <select value={selectedTable} onChange={handleTableChange}>
              <option value="">--選択してください--</option>
              {tableNumbers.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          style={{
            marginTop: '10px',
            padding: '6px 12px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          トップに戻る
        </button>
      
      </header>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}

      {!loading && !error && selectedTable && (
        <OrderBoard
          orders={groupedOrders}
          onStatusChange={changeOrderStatus}
          onDelete={deleteOrder}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;
