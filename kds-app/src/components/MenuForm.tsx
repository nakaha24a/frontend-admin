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
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>(""); // 保存時の名前

  // 入力変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenu({
      ...menu,
      [name]: value, // price も文字列で保持
    });
  };

  // 画像選択
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMenu({ ...menu, imageFile: e.target.files[0] });
      if (!imageName) setImageName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
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

    if (menu.imageFile && !imageName.trim()) {
      alert("画像名を入力してください");
      return;
    }

    try {
      const menuToSend: MenuImage = {
        ...menu,
        price: Number(menu.price), // 数値に変換
      };

      if (menu.imageFile) {
        // 常に .jpeg 拡張子に変換
        menuToSend.imageFile = new File([menu.imageFile], `${imageName}.jpeg`, {
          type: "image/jpeg",
        });
      }

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
      });
      setPreview(null);
      setImageName("");
      onSuccess();
    } catch (err: any) {
      alert(err.message || "登録に失敗しました");
    }
  };

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
