interface GlobalCache {
  _mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

interface ProductType {
  _id: string;
  title: string;
  images: string[];
  description?: string;
  price: number;
}

type ImagePreviewProps = {
  source: string | File;
  onRemove: () => void;
};

type SortableImageItem = {
  id: string; // Уникальный ID для ключа и сортировки
  source: string | File; // Либо URL, либо сам Файл
};

type NewFileItem = { file: File; preview: string };
