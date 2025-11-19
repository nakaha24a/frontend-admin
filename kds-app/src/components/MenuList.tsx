/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import type { Menu } from "../types/menu.ts";
import { updateMenu, deleteMenu } from "../api/backendapi.tsx";

interface Props {
  menus: Menu[];
  reload: () => void;
}

export const MenuList: React.FC<Props> = ({ menus, reload }) => {
  const handleUpdate = async (menu: Menu) => {
    const newName = prompt("新しいメニュー名を入力してください", menu.name);
    if (!newName) return;
    try {
      await updateMenu(menu.id, { name: newName });
      alert("メニューを更新しました。");
      reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("このメニューを削除しますか？")) return;
    try {
      await deleteMenu(id);
      alert("削除しました。");
      reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <table border={1} style={{ width: "100%", textAlign: "left" }}>
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
              <button onClick={() => handleUpdate(menu)}>編集</button>
              <button onClick={() => handleDelete(menu.id)}>削除</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
