// MenuForm.tsx

import React, { useState } from "react";
import { createMenu } from "../api/backendapi";

// フォームの状態を定義
interface MenuFormState {
  id: string;
  name: string;
  description: string; // 説明を追加
  price: number | string; // フォーム入力のためstringも許可
  category: string;
  image: string; // 画像URLを追加
}

export const MenuForm: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const [menu, setMenu] = useState<MenuFormState>({
    id: "",
    name: "",
    description: "", // 初期値を設定
    price: 0,
    category: "",
    image: "", // 初期値を設定
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // すべてのフィールドは変更可能
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // サーバーへ送信する際に、priceを数値に変換し、その他の情報を送る
      await createMenu({
        // 必須フィールド
        id: menu.id,
        name: menu.name,
        price: Number(menu.price),
        category: menu.category,

        // 追加フィールド
        description: menu.description || "",
        image: menu.image || "",

        // その他のプロパティがMenu型にある場合を想定してダミーを設定
        options: [],
        isRecommended: false,
      });

      alert("メニューを追加しました！");
      // フォームをリセット
      setMenu({
        id: "",
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
      });
      onSuccess(); // メニュー一覧をリロード
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form
      className="menu-form"
      onSubmit={handleSubmit}
      style={{
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      {/* 1. ID (編集可能) */}
      <input
        name="id"
        value={menu.id}
        onChange={handleChange}
        placeholder="ID (例: item-001)"
        required
      />
      {/* 2. メニュー名 (編集可能) */}
      <input
        name="name"
        value={menu.name}
        onChange={handleChange}
        placeholder="メニュー名"
        required
      />
      {/* 3. 説明 (新規追加) */}
      <input
        name="description"
        value={menu.description}
        onChange={handleChange}
        placeholder="説明 (任意)"
      />
      {/* 4. 価格 (編集可能) */}
      <input
        name="price"
        type="number"
        value={menu.price}
        onChange={handleChange}
        placeholder="価格"
        required
      />
      {/* 5. カテゴリ (編集可能) */}
      <input
        name="category"
        value={menu.category}
        onChange={handleChange}
        placeholder="カテゴリ (例: Main)"
        required
      />
      {/* 6. 画像URL (新規追加) */}
      <input
        name="image"
        value={menu.image}
        onChange={handleChange}
        placeholder="画像URL (例: /assets/burger.jpg)"
      />

      <button
        type="submit"
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        メニューを追加
      </button>
    </form>
  );
};
