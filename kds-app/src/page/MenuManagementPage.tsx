/* eslint-disable @typescript-eslint/no-explicit-any */
// src/page/MenuManagementPage.tsx
import React, { useEffect, useState } from "react";
import type { Menu, MenuResponse } from "../types/menu.ts";
import { fetchMenuList } from "../api/backendapi.tsx";
import { MenuList } from "../components/MenuList.tsx";
import { MenuModal } from "../components/MenuAdd.tsx";

export const MenuManagementPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 

  const loadMenus = async () => {
    setLoading(true);
    try {
      const data: MenuResponse = await fetchMenuList();

      

      const flatMenus: Menu[] = data.categories.flatMap((cat) =>
          cat.items.map((menu) => {
            const filename = menu.image?.split("/").pop();
            const safeFilename = filename ? filename.toLowerCase() : undefined;
            return {
              ...menu,
              image: safeFilename ? `/assets/${safeFilename}` : undefined,
            };
          })
      );


      
      setMenus(flatMenus);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "blue" }}>メニュー管理</h1>

      {/* メニュー追加ボタン */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        メニュー追加
      </button>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <MenuList menus={menus} reload={loadMenus} />
      )}

      {/* メニュー追加モーダル */}
      {isAddModalOpen && (
        <MenuModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={loadMenus} // 追加成功後に一覧更新
        />
      )}
    </div>
  );
};

export default MenuManagementPage;