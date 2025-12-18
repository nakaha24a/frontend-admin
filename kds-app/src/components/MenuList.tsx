// src/components/MenuList.tsx
import React, { useState} from "react";
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

              {/* おすすめ表示 */}
              <td style={{ textAlign: "center" }}>
                {menu.isRecommended ? "✅" : "❌"}
              </td>

              {/* 操作 */}
              <td>
                <button className="menu-edit" onClick={() => setEditTarget(menu)}>
                  編集
                </button>
                <button
                  className="menu-delete"
                  onClick={async () => {
                    if (!window.confirm("このメニューを削除しますか？")) return;
                    try {
                      await deleteMenu(menu.id);
                      await reload();
                    } catch {
                      alert("削除に失敗しました");
                    }
                  }}
                  style={{ marginLeft: 4 }}
                >
                  削除
                </button>
                <button
                  className="menu-look"
                  onClick={() => {
                    if (!menu.image) {
                      alert("画像がありません");
                      return;
                    }
                    // jpeg または jpg を判定
                    const isJpeg = /\.(jpe?g)$/i.test(menu.image); 
                    if (!isJpeg) {
                      alert("JPEG画像ではありません");
                      return;
                    }
                    setModalImageUrl(menu.image);
                  }}
                  style={{ marginLeft: 4 }}
                >
                    画像を見る
                </button>
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
          onSave={async (data) => {
            if (!editTarget) return;
            await updateMenu(editTarget.id, data);
            setEditTarget(null);
            await reload();
          }}
          onDelete={async () => {
            if (!editTarget) return;
            await deleteMenu(editTarget.id);
            setEditTarget(null);
            await reload();
          }}
        />
      )}

      {/* 画像モーダル */}
      {modalImageUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalImageUrl(null)}
        >
          <div
            style={{ position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImageUrl(null)}
              style={{
                position: "absolute",
                top: "-30px",
                right: "0",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ×
            </button>
            <img
              src={modalImageUrl}
              alt="メニュー画像"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
