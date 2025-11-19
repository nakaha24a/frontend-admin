import React from 'react';
import type { GroupedOrders, OrderStatus } from '../types/order.ts';
import OrderColumn from './OrderColumn';

interface OrderBoardProps {
  orders: GroupedOrders;
  onStatusChange: (orderId: number) => void;
  onDelete: (orderId: number) => void;
}

const getColumnTitle = (status: OrderStatus): string => {
  switch (status) {
    case 0: return '注文受取';
    case 1: return '調理中';
    case 2: return '調理完了 (提供可能)';
    case 3: return '提供済み';
    default: return '不明';
  }
};

const STATUSES: readonly OrderStatus[] = [0, 1, 2, 3];

const OrderBoard: React.FC<OrderBoardProps> = ({ orders, onStatusChange ,onDelete}) => {
  return (
    <div className="kds-board">
      {STATUSES.map(status => (
        <OrderColumn
          key={status}
          status={status}
          title={getColumnTitle(status)}
          orders={orders[status] || []}
          onStatusChange={onStatusChange} 
          onDelete={onDelete}        />
      ))}
    </div>
  );
};

export default OrderBoard;