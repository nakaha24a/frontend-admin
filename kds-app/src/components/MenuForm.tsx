// src/components/MenuForm.tsx
import React, { useState, useEffect } from "react";
import { createMenu } from "../api/backendapi";
import type { MenuImage } from "../types/menuimage";

export const MenuForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [menu, setMenu] = useState<MenuImage & {price: string | number}>({
    id: "",
    name: "",
    description: "",
    price: "", // 初期値は空欄
    category: "",
    options: [],
    isRecommended: false,
    isAvailable:true,
  });

  const [preview, setPreview] = useState<string | null>(null);
  

  // 入力変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenu({
      ...menu,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  // 画像選択
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
      setMenu({ ...menu, imageFile: e.target.files[0] });
    }
  };

  // プレビュー
  useEffect(() => {
    if (!menu.imageFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(menu.imageFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [menu.imageFile]);

  // 送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 必須項目チェック
    if (
      !menu.id.trim() ||
      !menu.name.trim() ||
      menu.price === "" ||
      Number(menu.price) <= 0 ||
      !menu.imageFile
    ) {
      alert("ID・メニュー名・価格・画像は必須項目です");
      return; // ← 追加処理を止める
    }

    try {
      const menuToSend: MenuImage = {
        ...menu,
        price: Number(menu.price), // 数値に変換
      };

      console.log("送信するメニュー:", menuToSend);
      
      await createMenu(menuToSend);

      alert("メニューを追加しました！");
      setMenu({
        id: "",
        name: "",
        description: "",
        price: "", // 初期値空欄に戻す
        category: "",
        options: [],
        isRecommended: false,
        isAvailable:true,
      });
      setPreview(null);
      onSuccess();
    } catch (err: any) {
        if (err.response?.data?.error) {
        alert(err.response.data.error || "同名のファイルがすでに存在します"); 
      } else {
        alert(err.message || "登録に失敗しました");
      }
    }
  };

  // メニュー項目
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <input
        name="id"
        value={menu.id}
        onChange={handleChange}
        placeholder="ID"
        required
      />
      <input
        name="name"
        value={menu.name}
        onChange={handleChange}
        placeholder="メニュー名"
        required
      />
      <input
        name="description"
        value={menu.description}
        onChange={handleChange}
        placeholder="説明 (任意)"
      />
      <input
        name="price"
        type="number"
        value={menu.price === "" ? "" : menu.price}
        onChange={handleChange}
        placeholder="0" // グレーアウト表示
        required
      />
      <input
        name="category"
        value={menu.category}
        onChange={handleChange}
        placeholder="カテゴリ"
        required
      />

      {/* 画像アップロード */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      

      {/* プレビュー */}
      {preview && (
        <img
          src={preview}
          alt="プレビュー"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            marginTop: "5px",
          }}
        />
      )}

      <button
        type="submit"
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        メニューを追加
      </button>
    </form>
  );
};
