interface GlobalCache {
  _mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

type Props = {
  params: Promise<{ id: string }>;
};



interface ProductType {
  _id: string;
  title: string;
  images: string[];
  description?: string;
  category: string;
  price: number;
}

type Property = { name: string; value: string[] };

type AddPropertyButtonProps = { initial?: Property[] };

type CategoryType = {
  _id: string;
  name: string;
  parent: { _id: string; name: string } | null;
  properties: Property[];
  createdAt: string;
  updatedAt: string;
};

interface CategoryFormType {
  action: (formData: FormData) => Promise<void>;
  categories: CategoryType[];
  category?: CategoryType | null;
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

type DeleteAction = (formData: FormData) => Promise<void>;
