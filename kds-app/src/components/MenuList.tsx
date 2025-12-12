// components/MenuList.tsx
import React, { useEffect, useState } from "react";
import type { Menu, MenuResponse } from "../types/menu";
import { fetchMenuList, updateMenu, deleteMenu } from "../api/backendapi";
import { MenuEdit } from "./MenuEdit";

export const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [editTarget, setEditTarget] = useState<Menu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // メニュー一覧取得
  const loadMenus = async () => {
    setLoading(true);
    try {
      const res: MenuResponse = await fetchMenuList();
      const allMenus: Menu[] = res.categories
        .map((c) => c.items)
        .flat();
      setMenus(allMenus);
    } catch (err: any) {
      alert(err.message || "メニュー取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // 編集保存
  const handleSave = async (data: Partial<Menu>): Promise<void> => {
    if (!editTarget) return;
    try {
      await updateMenu(editTarget.id, data);
      alert("メニューを更新しました！");
      setEditTarget(null);
      await loadMenus();
    } catch (err: any) {
      alert(err.message || "更新に失敗しました");
    }
  };

  // 削除
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("このメニューを削除しますか？")) return;
    try {
      await deleteMenu(id);
      alert("削除しました！");
      setEditTarget(null);
      await loadMenus();
    } catch (err: any) {
      alert(err.message || "削除に失敗しました");
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <>
      <table className="menu-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>価格</th>
            <th>カテゴリ</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td>{menu.id}</td>
              <td>{menu.name}</td>
              <td>{menu.price}円</td>
              <td>{menu.category}</td>
              <td>
                <button onClick={() => setEditTarget(menu)}>編集</button>
                <button onClick={() => handleDelete(menu.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 編集モーダル */}
      {editTarget && (
        <MenuEdit
          menu={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave} // async 関数で Promise<void> 型
          onDelete={() => handleDelete(editTarget.id)}               />
      )}
    </>
  );
};
