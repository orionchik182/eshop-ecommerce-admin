interface GlobalCache {
  _mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

interface ProductType {
  _id: string;
  title: string;
  description?: string;
  price: number;
}
