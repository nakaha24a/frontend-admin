// components/MenuEdit.tsx
import React, { useState } from "react";
import type { Menu } from "../types/menu";

interface Props {
  menu: Menu | null;
  onClose: () => void;
  onSave: (data: Partial<Menu>) => Promise<void>; // 親でAPI呼び出し
  onDelete: () => Promise<void>;                  // 親でAPI呼び出し
}

export const MenuEdit: React.FC<Props> = ({ menu, onClose, onSave, onDelete }) => {
  if (!menu) return null;

  const [form, setForm] = useState({
    name: menu.name,
    price: menu.price,
    description: menu.description ?? "",
    category: menu.category ?? "",
    imageUrl: menu.image ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label>画像URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-button" onClick={onClose}>キャンセル</button>
          <button className="modal-button modal-save"
            onClick={() =>
              onSave({
                name: form.name,
                price: Number(form.price),
                description: form.description,
                category: form.category,
                image: form.imageUrl,
              }).then(onClose)
            }
          >
            保存
          </button>
          <button className="modal-button modal-delete"
            onClick={() => onDelete().then(onClose)}
            style={{ color: "red" }}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};
