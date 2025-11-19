// src/components/OrderCard.tsx

import React from 'react';
import type { Order, OrderStatus } from '../types/order.ts';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: number) => void;
  onDelete: (orderId:  number) => void;
  
}

const getButtonText = (status: OrderStatus): string => {
  switch (status) {
    case 0: return '調理開始';
    case 1: return '調理完了';
    case 2: return '提供完了';
    default: return '完了';
  }
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange ,onDelete}) => {
  const now = new Date();
  // 経過時間計算
  const elapsedMinutes = Math.floor((now.getTime() - order.time.getTime()) / 60000);
  
  // アラート色ロジック
  const isAlert = order.status === 1 && elapsedMinutes > 15;
  const timeColor = isAlert ? 'red' : '#666';

  return (
    <div className={`order-card status-${order.status}`} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span className="table-number">テーブル: {order.table}</span>
        <span className="order-time" style={{ color: timeColor }}>
          {elapsedMinutes}分経過
        </span>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {order.items.map((item, index) => (
          <li key={index} style={{ fontSize: '0.9em' }}>• {item}</li>
        ))}
      </ul>
      
      {order.status < 3 && ( // 提供済み(3)でなければボタンを表示
        <button 
          onClick={() => onStatusChange(order.id)}
          className={`order-button status-${order.status}-button`}
        >
          {getButtonText(order.status)}
        </button>
      )}

      {order.status === 3 && ( // ステータスが3（提供済み）の場合、削除ボタンを表示
        <button 
        // ★ボタンクリック時に、親から渡された onDelete 関数を order.id を引数にして呼び出す★
          onClick={() => onDelete(order.id)} 
    
        // CSSクラスを適用
          className="order-button delete-button" 
    
        // インラインスタイルで一時的に赤色を適用（index.cssに移動推奨）
          style={{ backgroundColor: '#F44336' }} >
          確認済み
        </button>
      )}
    </div>
  );
};

export default OrderCard;