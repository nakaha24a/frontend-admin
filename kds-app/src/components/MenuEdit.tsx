// src/components/MenuEdit.tsx
import React, { useState } from "react";
import type { Menu } from "../types/menu";

interface Props {
  menu: Menu | null;
  onClose: () => void;
  onSave: (data: Partial<Menu> & { imageFile?: File }) => Promise<void>;
  onDelete: () => void;
}

export const MenuEdit: React.FC<Props> = ({ menu, onClose, onSave }) => {
  if (!menu) return null;

  const [form, setForm] = useState<{
    name: string;
    price: number | string;
    description: string;
    category: string;
    imageFile?: File;
    isRecommended: boolean;
  }>({
    name: menu.name,
    price: menu.price,
    description: menu.description ?? "",
    category: menu.category ?? "",
    imageFile: undefined, 
    isRecommended: menu.isRecommended ?? false,
  });

  // 入力変更
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price" ? Number(value) : value });
  };

  // おすすめ切替
  const handleRecommendedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, isRecommended: e.target.checked });
  };

  // 画像選択
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, imageFile: file ?? undefined }));
  };

  // 編集項目
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>メニュー編集</h2>

        <div className="modal-form-group">
          <label>名前</label>
          <input name="name" value={form.name} onChange={handleChange} />
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
          <input name="category" value={form.category} onChange={handleChange} />
        </div>

        <div className="modal-form-group">
          <label>画像</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="modal-form-group">
          <label>おすすめ</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={form.isRecommended}
              onChange={handleRecommendedChange}
              style={{ marginLeft: 8 }}
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
            onClick={() =>
              onSave({
                name: form.name,
                price: Number(form.price),
                description: form.description,
                category: form.category,
                isRecommended: form.isRecommended,
                imageFile: form.imageFile,
              }).then(onClose)
            }
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
