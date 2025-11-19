
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Order, ApiOrderStatus, GroupedOrders } from '../types/order';
import {fetchOrdersByTable,fetchTableNumbers} from '../api/backendapi';
import {STATUS_MAP_FROM_API, getOrderStatus} from '../types/order';


/* 仮の初期データ
const initialOrders: Order[]initialOrders: Order[] = [
  { id: 101, table: 'T-5', status: 0, items: ['マルゲリータ x 1', '生ビール x 2'], time: new Date() },
  { id: 102, table: 'T-2', status: 1, items: ['特製ハンバーグ x 1', 'ライス(大) x 1'], time: new Date(Date.now() - 600000) },
];


let orderIdCounter = 102;
*/

export interface ApiOrder {
  id: number;
  table: string;
  status: ApiOrderStatus; // "調理中" | "提供済み" | "会計済み" | "キャンセル" | "新規受付"
  items: string[];        // DBでJSON文字列の場合はJSON.parseが必要
  timestamp: string;      // ISO文字列
}


export const useOrders = (tableNumber?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const loadTableNumbers = async () => {
      try {
        const tables = await fetchTableNumbers(); // ← /api/tables を叩いて取得する関数
        setTableNumbers(tables);

        // 最初のテーブルを自動で選択（必要に応じて変更）
        if (tables.length > 0) {
          setSelectedTable(tables[0]);
        }
      } catch (err) {
        setError('テーブル番号の取得に失敗しました。');
        console.error(err);
      }
    };

    loadTableNumbers();
  }, []);


  /** 初回レンダーでAPIを叩いて注文を取得 */
  useEffect(() => {
    if (!tableNumber) return;

    setLoading(true);
    fetchOrdersByTable(tableNumber)
      .then(fetchedOrders => {
        const convertedOrders: Order[] = fetchedOrders.map(o => ({
          id: o.id,
          table: o.table,
          status: STATUS_MAP_FROM_API[o.status as unknown as ApiOrderStatus],
          items: o.items,
          time: new Date(o.time),
        }));
        setOrders(convertedOrders);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [tableNumber]);


  /** 注文削除 */
  const deleteOrder = useCallback((orderId: number) => {
    setOrders(prev => prev?.filter(o => o.id !== orderId) ?? []);
    console.log(`🗑️ 注文ID ${orderId} を削除しました`);
  }, []);

  /** ステータス変更 */
  const changeOrderStatus = useCallback((id: number) => {
    setOrders(prev =>
      prev
        .map(order => {
          if (order.id === id) {
            const nextStatus = getOrderStatus(order.status);
            if (nextStatus > 3) return null;
            return { ...order, status: nextStatus };
          }
          return order;
        })
        .filter((o): o is Order => o !== null)
    );
  }, []);

  /** 1分ごとに再描画 */
  useEffect(() => {
    const interval = setInterval(() => setOrders(prev => [...prev]), 60000);
    return () => clearInterval(interval);
  }, []);

  /** ステータス別にグループ化 */
  const groupedOrders: GroupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const key = order.status;
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {} as GroupedOrders);
  }, [orders]);

  return { orders, groupedOrders, loading, error,tableNumber,tableNumbers,selectedTable,setSelectedTable,changeOrderStatus, deleteOrder };
};