import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  Order,
  GroupedOrders,
  ApiOrderStatus,
  OrderStatus,
} from "../types/order";
// fetchKitchenOrders を追加インポート
import {
  fetchOrdersByTable,
  fetchTableNumbers,
  fetchKitchenOrders,
  updateOrderStatus,
} from "../api/backendapi";

// APIから返ってくる型とフロントの型を合わせるためのマップ
// backendapi側ですでに変換されている場合は不要ですが、念のため
const STATUS_MAP: Record<string, OrderStatus> = {
  注文受付: 0,
  調理中: 1,
  調理完了: 2,
  提供済み: 3,
  会計済み: 3,
  呼び出し: 0, // 呼び出しは「注文受付」と同じ扱いにしてみる
};

export const useOrders = (tableNumber?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // テーブル番号一覧のロード（初回のみ）
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

  /** 注文データの取得関数 */
  const loadOrders = useCallback(async () => {
    try {
      let fetchedOrders: any[] = [];

      // テーブル番号があれば「そのテーブル」、なければ「キッチン全件」を取得
      if (tableNumber) {
        fetchedOrders = await fetchOrdersByTable(tableNumber);
      } else {
        fetchedOrders = await fetchKitchenOrders();
      }

      // データ変換処理
      const convertedOrders: Order[] = fetchedOrders.map((o) => {
        // ステータスが文字列で来る場合と数値で来る場合の両方に対応
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
          // JSON文字列ならパース、既に配列ならそのまま
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
          time: new Date(o.timestamp || o.time),
        };
      });

      // 重複や順序を考慮してセット（ReactのState更新）
      setOrders(convertedOrders);
      setError(null);
    } catch (err) {
      console.error(err);
      // ポーリング中はエラーを表示し続けると鬱陶しいので、初回のみあるいはコンソールだけにする
      if (loading) setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tableNumber, loading]);

  /** 初回実行 ＆ ポーリング（自動更新）設定 */
  useEffect(() => {
    // マウント時に即実行
    loadOrders();

    // 5秒ごとに更新 (ポーリング)
    const intervalId = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loadOrders]);

  /** 注文削除 (今回は使いませんが残します) */
  const deleteOrder = useCallback((orderId: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  /** ステータス変更 */
  const changeOrderStatus = useCallback(
    async (id: number) => {
      // 現在のステータスを探す
      const targetOrder = orders.find((o) => o.id === id);
      if (!targetOrder) return;

      // 次のステータスを決定 (0→1→2→3)
      // OrderStatusの定義: 0:注文受付, 1:調理中, 2:調理完了, 3:提供済み
      const nextStatusVal = (targetOrder.status + 1) as OrderStatus;
      if (nextStatusVal > 3) return; // これ以上進まない

      // 楽観的UI更新（APIを待たずに画面だけ先に変える）
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: nextStatusVal } : o))
      );

      // APIに送信するための文字列に変換
      // backendapi.tsx の updateOrderStatus は string のステータスを期待しているため
      const STATUS_STRINGS: Record<number, ApiOrderStatus> = {
        0: "注文受付",
        1: "調理中",
        2: "提供済み", // もしバックエンドに「調理完了」がないなら、ここを調整
        3: "提供済み", // 「会計済み」はKDSからは送らない（顧客側でやる）ため「提供済み」で止める
      };

      // バックエンドが "調理完了" ステータスを持っていない場合、
      // Frontendの "2" は "調理中" のままにするか、"提供済み" にするか決める必要があります。
      // ここでは便宜上、バックエンドAPIに合わせて文字列を送ります。
      let statusToSend: ApiOrderStatus = "調理中";
      if (nextStatusVal === 3) statusToSend = "提供済み";
      else if (nextStatusVal === 1 || nextStatusVal === 2)
        statusToSend = "調理中";

      try {
        await updateOrderStatus(id.toString(), statusToSend);
        // 成功したらリロードして最新状態と同期（念のため）
        loadOrders();
      } catch (err) {
        console.error("ステータス更新失敗", err);
        // 失敗したら元に戻す処理などを入れるのが理想
        loadOrders(); // リロードして正しい状態に戻す
      }
    },
    [orders, loadOrders]
  );

  /** ステータス別にグループ化 */
  const groupedOrders: GroupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const key = order.status;
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
    tableNumber,
    tableNumbers,
    selectedTable,
    setSelectedTable,
    changeOrderStatus,
    deleteOrder,
  };
};
