"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  /** показывать / скрыть */
  open: boolean;
  /** нажали «крестик» или за пределами окна */
  onClose: () => void;
  /** содержимое модального окна */
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  // блокируем скролл, пока модалка открыта
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose} /* клик по фону закрывает */
    >
      {/* останавливем всплытие, чтобы не закрываться по клику внутри */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
      >
        {children}
      </div>
    </div>,
    document.body, // портал в <body>, чтобы перекрывать всё
  );
}
