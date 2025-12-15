// components/MenuForm.tsx
import React, { useState } from "react";
import { createMenu } from "../api/backendapi";

interface MenuFormState {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image: string;
}

export const MenuForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [menu, setMenu] = useState<MenuFormState>({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMenu({
        id: menu.id,
        name: menu.name,
        price: Number(menu.price),
        category: menu.category,
        description: menu.description || "",
        image: menu.image || "",
        options: [],
        isRecommended: false,
      });
      alert("メニューを追加しました！");
      setMenu({ id: "", name: "", description: "", price: "", category: "", image: "" });
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input name="id" value={menu.id} onChange={handleChange} placeholder="ID" required />
      <input name="name" value={menu.name} onChange={handleChange} placeholder="メニュー名" required />
      <input name="description" value={menu.description} onChange={handleChange} placeholder="説明 (任意)" />
      <input name="price" type="number" value={menu.price} onChange={handleChange} placeholder="価格" required />
      <input name="category" value={menu.category} onChange={handleChange} placeholder="カテゴリ" required />
      <input name="image" value={menu.image} onChange={handleChange} placeholder="画像URL (任意)" />
      <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>
        メニューを追加
      </button>
    </form>
  );
};
