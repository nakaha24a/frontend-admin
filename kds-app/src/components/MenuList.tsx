// src/components/MenuList.tsx
import React, { useState } from "react";
import type { Menu } from "../types/menu";
import { MenuEdit } from "./MenuEdit";
import { updateMenu, deleteMenu } from "../api/backendapi";

type MenuListProps = {
  menus: Menu[];
  reload: () => Promise<void>;
};

export const MenuList: React.FC<MenuListProps> = ({ menus, reload }) => {
  const [editTarget, setEditTarget] = useState<Menu | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  return (
    <>
      <table className="menu-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>価格</th>
            <th>カテゴリ</th>
            <th>おすすめ</th>
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
              <td style={{ textAlign: "center" }}>
                {menu.isRecommended ? "✅" : "❌"}
              </td>
              <td>
                <button className="menu-edit"
                  onClick={() => setEditTarget(menu)}>編集</button>

                <button
                  className="menu-delete"
                  style={{ marginLeft: 4 }}
                  onClick={async () => {
                    if (!window.confirm("このメニューを削除しますか？")) return;
                    await deleteMenu(menu.id);
                    await reload();
                  }}
                >
                  削除
                </button>

                <button
                  className="menu-look"
                  style={{ marginLeft: 4 }}
                  onClick={() => {
                    if (!menu.image) {
                      alert("画像がありません");
                      return;
                    }
                    if (!/\.(jpe?g)$/i.test(menu.image)) {
                      alert("JPEG画像ではありません");
                      return;
                    }
                    console.log(menu.image);
                    setModalImageUrl(menu.image);
                  }}
                >
                  画像を見る
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editTarget && (
        <MenuEdit
          menu={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={async (data) => {
            await updateMenu(editTarget.id, data);
            setEditTarget(null);
            await reload();
          }}
          onDelete={async () => {
            await deleteMenu(editTarget.id);
            setEditTarget(null);
            await reload();
          }}
        />
      )}

      {modalImageUrl && (
        <div
          onClick={() => setModalImageUrl(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={modalImageUrl}
            alt="メニュー画像"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />
        </div>
      )}
    </>
  );
};
