import { connectMongo } from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export async function getProducts() {
  await connectMongo();
  return Product.find().lean<ProductType[]>();
}

export async function getProductById(id: string) {
  await connectMongo();
  return Product.findById(id).lean<ProductType>();
}

export async function getCategories() {
  await connectMongo();
  const docs = (await Category.find()
    .lean<CategoryLean>()
    .exec()) as unknown as CategoryLean[];

  return docs.map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    parent: c.parent
      ? { _id: c.parent._id.toString(), name: c.parent.name }
      : null,
    properties: c.properties,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}
