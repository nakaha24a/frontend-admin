
// hook/useOrdersMock.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Order, GroupedOrders } from '../types/order';
import { getOrderStatus } from '../types/order';

export const useOrdersMock = (tableNumber?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableNumbers] = useState<string[]>(['T-1','T-2','T-3']);
  const [selectedTable, setSelectedTable] = useState<string | null>(tableNumber ?? 'T-1');
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // 選択テーブルが変わったらダミーデータをセット
  useEffect(() => {
    if (!selectedTable) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setOrders([
        { id: 101, table: selectedTable, status: 0, items: ['マルゲリータ x1'], time: new Date() },
        { id: 102, table: selectedTable, status: 1, items: ['パスタ x2'], time: new Date(Date.now() - 600000) },
      ]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedTable]);

  const deleteOrder = useCallback((orderId: number) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    console.log(`🗑️ 注文ID ${orderId} を削除しました`);
  }, []);

  const changeOrderStatus = useCallback((id: number) => {
    setOrders(prev =>
      prev
        .map(o => {
          if (o.id === id) {
            const nextStatus = getOrderStatus(o.status);
            if (nextStatus > 3) return null;
            return { ...o, status: nextStatus };
          }
          return o;
        })
        .filter((o): o is Order => o !== null)
    );
  }, []);

  const groupedOrders: GroupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const key = order.status;
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {} as GroupedOrders);
  }, [orders]);

  return { orders, groupedOrders, loading, error, tableNumbers, selectedTable, setSelectedTable, changeOrderStatus, deleteOrder };
};
