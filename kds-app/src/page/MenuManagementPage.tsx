/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { Menu, MenuResponse } from "../types/menu.ts";
import { fetchMenuList } from "../api/backendapi.tsx";
import { MenuForm } from "../components/MenuForm.tsx";
import { MenuList } from "../components/MenuList.tsx";

export const MenuManagementPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const data: MenuResponse = await fetchMenuList();
      const flatMenus: Menu[] = data.categories.flatMap((cat) => cat.items);
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

      <MenuForm onSuccess={loadMenus} />

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <MenuList menus={menus} reload={loadMenus} />
      )}
    </div>
  );
};

export default MenuManagementPage;
