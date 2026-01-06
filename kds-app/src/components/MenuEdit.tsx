// src/components/MenuEdit.tsx
import React, { useState } from "react";
import type { Menu } from "../types/menu";

interface Props {
  menu: Menu | null;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>; // ★ FormDataに変更
  onDelete: () => void;
}

export const MenuEdit: React.FC<Props> = ({ menu, onClose, onSave }) => {
  if (!menu) return null;

  const [form, setForm] = useState({
    name: menu.name,
    price: menu.price,
    description: menu.description ?? "",
    category: menu.category ?? "",
    imageFile: undefined as File | undefined,
    isRecommended: !!menu.isRecommended,
  });

  // 入力変更
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // おすすめ切替
  const handleRecommendedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      isRecommended: e.target.checked,
    }));
  };

  // 画像選択
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  // ★ 保存処理（FormDataで送信）
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", String(form.price));
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("isRecommended", String(form.isRecommended));

    if (form.imageFile) {
      formData.append("imageFile", form.imageFile);
    }

    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>メニュー編集</h2>

        <div className="modal-form-group">
          <label>名前</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label>価格</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label>説明</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label>カテゴリ</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label>画像</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="modal-form-group">
          <label>おすすめ</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={form.isRecommended}
              onChange={handleRecommendedChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="modal-actions">
          <button className="modal-button" onClick={onClose}>
            キャンセル
          </button>
          <button
            className="modal-button modal-save"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
