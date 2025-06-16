"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "../ui/Spinner";

export default function ImagePreview({ source, onRemove }: ImagePreviewProps) {
  const [url, setUrl] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let blobUrl: string | null = null;

    if (source instanceof File) {
      // Если это файл, создаем для него blob URL
      blobUrl = URL.createObjectURL(source);
      setUrl(blobUrl);
    } else {
      // Если это строка, просто используем ее как URL
      setUrl(source);
    }

    // Эта функция очистки идеально парная с созданием URL
    return () => {
      // Отзываем URL только если мы его создали в этом эффекте
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [source]);

  // Если URL невалидный или произошла ошибка
  if (!url) {
    // Пока URL не установлен, можно показать спиннер
    return (
      <div className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative h-24 w-24">
      {/* Спиннер, который виден, пока isLoaded === false */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-200">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-100 text-xs text-red-500">
          Error
        </div>
      )}

      {/* Само изображение. Оно будет невидимым, пока не загрузится */}
      <Image
        src={url}
        alt="Product image preview"
        className={`rounded-lg object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        fill
        sizes="96px" // Помогает next/image оптимизировать загрузку
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />

      {/* Кнопка удаления, видна всегда */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white transition-opacity hover:opacity-80"
      >
        ✕
      </button>
    </div>
  );
}
