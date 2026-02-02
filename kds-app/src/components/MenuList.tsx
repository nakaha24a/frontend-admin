// src/components/MenuList.tsx
import React, { useMemo, useState } from "react";
import type { Menu } from "../types/menu";
import { MenuEdit } from "./MenuEdit";
import { updateMenu, deleteMenu } from "../api/backendapi";
import { getConfig } from "../config/runTimeconfig";



type MenuListProps = {
  menus: Menu[];
  reload: () => Promise<void>;
};

export const MenuList: React.FC<MenuListProps> = ({ menus, reload }) => {
  const [editTarget, setEditTarget] = useState<Menu | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const API_BASE_URL = getConfig().apiBaseUrl;

  const CATEGORY_COLORS = [
    "#E3F2FD",
    "#FFF3E0",
    "#E8F5E9",
    "#FCE4EC",
    "#F3E5F5",
    "#FFFDE7",
  ];

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let index = 0;

    menus.forEach((menu) => {
      if (!map[menu.category]) {
        map[menu.category] =
          CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        index++;
      }
    });

    return map;
  }, [menus]);

  const filteredMenus = useMemo(() => {
    if (!search) return menus;
    const keyword = search.toLowerCase();

    return menus.filter(
      (menu) =>
        menu.name.toLowerCase().includes(keyword) ||
        menu.category.toLowerCase().includes(keyword) ||
        menu.id.toString().includes(keyword)
    );
  }, [menus, search]);

  return (
    <>
      {/* ===== 検索バー ===== */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="名前・カテゴリ・IDで検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320, padding: "6px 8px", fontSize: 14 }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ marginLeft: 8 }}>
            クリア
          </button>
        )}
      </div>

      {/* ===== メニュー一覧 ===== */}
      <table className="menu-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ textAlign: "center" }}>名前</th>
            <th style={{ textAlign: "center" }}>価格</th>
            <th style={{ textAlign: "center" }}>カテゴリ</th>
            <th style={{ textAlign: "center" }}>おすすめ</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenus.map((menu) => (
            <tr
              key={menu.id}
              style={{
                backgroundColor: categoryColorMap[menu.category],
                borderTop: "2px solid #ddd",
              }}
            >
              <td style={{ textAlign: "center" }}>{menu.id}</td>
              <td style={{ textAlign: "center" }}>{menu.name}</td>
              <td style={{ textAlign: "center" }}>{menu.price}円</td>
              <td style={{ textAlign: "center" }}>{menu.category}</td>
              <td style={{ textAlign: "center" }}>
                {menu.isRecommended ? "✅" : "❌"}
              </td>

              {/* ===== 操作（アイコン化） ===== */}
              <td style={{ whiteSpace: "nowrap" }}>
                {/* 編集 */}
                <button className="menu-edit"
                  title="編集"
                  onClick={() => setEditTarget(menu)}
                >
                  編集
                </button>

                {/* 削除 */}
                <button className="menu-delete"
                  title="削除"
                  style={{ marginLeft: 6 }}
                  onClick={async () => {
                    if (!window.confirm("このメニューを削除しますか？")) return;
                    await deleteMenu(menu.id);
                    await reload();
                  }}
                >
                  削除
                </button>

                {/* 画像 */}
                <button className="menu-look"
                  title="画像を見る"
                  style={{ marginLeft: 6 }}
                  onClick={() => {
                    if (!menu.image) {
                      alert("画像がありません");
                      return;
                    }
                    setModalImageUrl(menu.image);
                    
                  }}
                >
                  画像
                </button>
              </td>
            </tr>
          ))}

          {filteredMenus.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                該当するメニューがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== 編集モーダル ===== */}
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

      {/* ===== 画像モーダル ===== */}
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
            src={`${API_BASE_URL}${modalImageUrl}`}
            alt="メニュー画像"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />
        </div>
      )}
    </>
  );
};
