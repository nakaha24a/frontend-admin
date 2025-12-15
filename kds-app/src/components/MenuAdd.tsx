//components/MenuAdd.tsx
import React from "react";
import { MenuForm } from "./MenuForm";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "320px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>メニュー追加</h2>
        <MenuForm
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
        <button
          onClick={onClose}
          style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
