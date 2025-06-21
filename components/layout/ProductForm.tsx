"use client";

import { createProduct, updateProduct } from "@/lib/actions";

import { useEffect, useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import SubmitButton from "./SubmitButton";
import { ReactSortable } from "react-sortablejs";

// Функция для инициализации состояния
const getInitialItems = (product: ProductType | null): SortableImageItem[] => {
  if (!product?.images) return [];
  return product.images.map((url) => ({ id: url, source: url }));
};

export default function ProductForm({
  product,
  categories,
}: {
  product?: ProductType | null;
  categories: CategoryType[];
}) {
  const action = product ? updateProduct : createProduct;
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<SortableImageItem[]>(() =>
    getInitialItems(product ?? null),
  );

  const keptImages = items
    .map((item) => item.source)
    .filter((source): source is string => typeof source === "string");

  useEffect(() => {
    const dataTransfer = new DataTransfer();
    items.forEach((item) => {
      if (item.source instanceof File) {
        dataTransfer.items.add(item.source);
      }
    });
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
  }, [items]);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newItems: SortableImageItem[] = files.map((file) => ({
      // Генерируем уникальный ID для новых файлов
      id: `file-${file.name}-${Math.random()}`,
      source: file,
    }));

    e.target.value = "";
    setItems((prev) => [...prev, ...newItems]);
  }

  function handleRemove(idToRemove: string) {
    setItems((prev) => prev.filter((item) => item.id !== idToRemove));
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {/* hidden поля для update */}
      {product && (
        <input type="hidden" name="id" value={product._id.toString()} />
      )}

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

      {/* ── Категория ── */}
      <label>Category</label>
      <select name="category" defaultValue={product?.category ?? ""}>
        <option value="">Uncategorized</option>
        {categories?.length > 0 &&
          categories.map((c) => (
            <option value={c._id.toString()} key={c._id.toString()}>
              {c.name}
            </option>
          ))}
      </select>
      {/* ── Фото ── */}
      <label>Photos</label>
      <div className="flex flex-wrap gap-2">
        <ReactSortable
          list={items}
          setList={setItems}
          className="flex flex-wrap gap-1"
        >
          {items.map((item) => (
            <ImagePreview
              key={item.id}
              source={item.source}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </ReactSortable>

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

      <SubmitButton />
    </form>
  );
}
