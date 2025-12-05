import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  Order,
  GroupedOrders,
  ApiOrderStatus,
  OrderStatus,
} from "../types/order";
import {
  fetchOrdersByTable,
  fetchTableNumbers,
  fetchKitchenOrders,
  updateOrderStatus,
} from "../api/backendapi";

const STATUS_MAP: Record<string, OrderStatus> = {
  注文受付: 0,
  調理中: 1,
  調理完了: 2,
  提供済み: 3,
  会計済み: 3,
  KDS完了: 4, // 画面から消えるステータス
  呼び出し: 0,
};

export const useOrders = (tableNumber?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTableNumbers = async () => {
      try {
        const tables = await fetchTableNumbers();
        setTableNumbers(tables);
      } catch (err) {
        console.error("テーブル番号取得失敗", err);
      }
    };
    loadTableNumbers();
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      let fetchedOrders: any[] = [];
      if (tableNumber && tableNumber !== "") {
        fetchedOrders = await fetchOrdersByTable(tableNumber);
      } else {
        fetchedOrders = await fetchKitchenOrders();
      }

      const convertedOrders: Order[] = fetchedOrders.map((o) => {
        let statusVal: OrderStatus = 0;
        if (typeof o.status === "number") {
          statusVal = o.status as OrderStatus;
        } else if (typeof o.status === "string") {
          statusVal = STATUS_MAP[o.status] ?? 0;
        }
        return {
          id: o.id,
          table: o.table_number || o.table || "不明",
          status: statusVal,
          items:
            typeof o.items === "string" ? JSON.parse(o.items) : o.items || [],
          time: new Date(o.timestamp || o.time),
        };
      });

      setOrders(convertedOrders);
      setError(null);
    } catch (err) {
      console.error(err);
      if (loading) setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tableNumber, loading]);

  useEffect(() => {
    loadOrders();
    const intervalId = setInterval(loadOrders, 5000);
    return () => clearInterval(intervalId);
  }, [loadOrders]);

  const deleteOrder = useCallback(
    async (orderId: number) => {
      // 削除ボタン(=強制完了)でもサーバー上のステータスを更新する
      try {
        await updateOrderStatus(orderId.toString(), "KDS完了");
        loadOrders();
      } catch (err) {
        console.error("削除失敗", err);
      }
    },
    [loadOrders]
  );

  const changeOrderStatus = useCallback(
    async (id: number) => {
      const targetOrder = orders.find((o) => o.id === id);
      if (!targetOrder) return;

      // 次のステータスへ (0->1->2->3->4)
      const nextStatusVal = (targetOrder.status + 1) as OrderStatus;

      // 4(KDS完了)以上になってもOK（サーバーから消えるだけ）

      // 楽観的更新
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: nextStatusVal } : o))
      );

      // API用文字列
      let statusToSend: ApiOrderStatus = "注文受付";
      if (nextStatusVal === 1) statusToSend = "調理中";
      else if (nextStatusVal === 2) statusToSend = "調理完了";
      else if (nextStatusVal === 3) statusToSend = "提供済み";
      else if (nextStatusVal >= 4) statusToSend = "KDS完了"; // これでリストから消える

      try {
        await updateOrderStatus(id.toString(), statusToSend);
        loadOrders();
      } catch (err) {
        console.error("ステータス更新失敗", err);
        loadOrders();
      }
    },
    [orders, loadOrders]
  );

  const groupedOrders: GroupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const key = order.status;
      // ステータス4(完了)は表示リストに入れない
      if (key >= 4) return acc;

      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {} as GroupedOrders);
  }, [orders]);

  return {
    orders,
    groupedOrders,
    loading,
    error,
    tableNumbers,
    changeOrderStatus,
    deleteOrder,
  };
};
