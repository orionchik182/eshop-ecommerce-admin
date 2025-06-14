"use client";

import { createProduct, updateProduct } from "@/lib/actions";
import { useEffect, useRef, useState } from "react";

export default function ProductForm({
  product,
}: {
  product?: ProductType | null;
}) {
  const action = product ? updateProduct : createProduct;
  const formRef = useRef<HTMLFormElement>(null);

  const [keptImages, setKeptImages] = useState<string[]>(product?.images ?? []);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>(
    [],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dataTransfer = new DataTransfer();
    newFiles.forEach((item) => dataTransfer.items.add(item.file));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
  }, [newFiles]);

  useEffect(() => {
    const previews = newFiles.map((item) => item.preview);
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [newFiles]);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewFiles((prev) => [...prev, ...newItems]);
    // Сбрасываем значение инпута, чтобы можно было выбрать те же файлы снова
    e.target.value = "";
  }

  function handleRemoveNewFile(previewUrl: string) {
    setNewFiles((prev) => prev.filter((item) => item.preview !== previewUrl));
  }

  function handleRemoveKeptImage(url: string) {
    setKeptImages((prev) => prev.filter((u) => u !== url));
  }

  const allPreviews = [...keptImages, ...newFiles.map((item) => item.preview)];

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {/* hidden поля для update */}
      {product && <input type="hidden" name="id" value={product._id} />}

      {keptImages.map((url) => (
        <input key={url} type="hidden" name="keptImages" value={url} />
      ))}

      <h2 className="text-xl text-blue-900">
        {product ? "Edit product" : "New Product"}
      </h2>

      {/* ── Название ── */}
      <label htmlFor="title">Product name</label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Product name"
        defaultValue={product?.title ?? ""}
      />

      {/* ── Фото ── */}
      <label>Photos</label>
      <div className="flex flex-wrap gap-2">
        {allPreviews.map((url) => (
          <div key={url} className="relative h-24 w-24">
            <img
              src={url}
              className="h-full w-full rounded object-cover"
              alt="Preview"
            />
            <button
              type="button"
              onClick={() => {
                // Определяем, какой обработчик вызывать
                if (url.startsWith("blob:")) {
                  handleRemoveNewFile(url);
                } else {
                  handleRemoveKeptImage(url);
                }
              }}
              className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Кнопка Upload  */}
        <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded bg-gray-200 text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <span>Upload</span>
          <input
            ref={inputRef}
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelect}
          />
        </label>
      </div>

      {/* ── Описание ── */}
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Description"
        defaultValue={product?.description ?? ""}
      />

      {/* ── Цена ── */}
      <label htmlFor="price">Price (USD)</label>
      <input
        id="price"
        name="price"
        type="number"
        step="0.01"
        placeholder="0.00"
        defaultValue={product?.price ?? ""}
      />

      <button type="submit" className="btn-primary self-start">
        Save
      </button>
    </form>
  );
}
