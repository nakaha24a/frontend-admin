//MenuForm.tsx

import React, { useState } from "react";
import { createMenu } from "../api/backendapi";


export const MenuForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [menu, setMenu] = useState({ id: "", name: "", price: 0, category: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMenu({ ...menu, price: Number(menu.price) });

      alert("メニューを追加しました！");
      setMenu({ id: "", name: "", price: 0, category: "" });
      onSuccess(); // リロード
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form className="menu-form" onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input name="id" value={menu.id} onChange={handleChange} placeholder="ID" required />
      <input name="name" value={menu.name} onChange={handleChange} placeholder="メニュー名" required />
      <input
        name="price"
        type="number"
        value={menu.price}
        onChange={handleChange}
        placeholder="価格"
        required
      />
      <input
        name="category"
        value={menu.category}
        onChange={handleChange}
        placeholder="カテゴリ"
        required
      />
      <button type="submit">追加</button>
    </form>
  );
};
