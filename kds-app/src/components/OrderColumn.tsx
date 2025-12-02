// src/components/OrderColumn.tsx

import React from 'react';
import type { Order, OrderStatus } from '../types/order.ts';
import OrderCard from '../components/OrderCard.tsx';

interface OrderColumnProps {
  title: string;
  orders: Order[];
  onStatusChange: (orderId: number) => void;
  status: OrderStatus;
  onDelete: (orderId: number) => void;
}

const OrderColumn: React.FC<OrderColumnProps> = ({ title, orders,onStatusChange,onDelete}) => {
  console.log('OrderColumn orders:', orders);
  return (
    
    <div style={{ flexShrink: 0, width: '300px', padding: '10px', border: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ fontSize: '1.2em', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
        {title} ({orders.length})
      </h2>
      <div className="order-list">
        {orders.sort((a, b) => a.time.getTime() - b.time.getTime()).map(order => ( // 古い注文を上にソート
          <OrderCard 
            key={order.id}
            order={order}
            
            onStatusChange={onStatusChange} 
            onDelete={onDelete}
                  />
            
        ))}
        
      </div>
        
    </div>
  );
  
};



export default OrderColumn;