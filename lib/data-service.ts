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
  return Category.find().populate("parent").lean<CategoryType[]>();
}

export async function getCategoryById(id: string) {
  await connectMongo();
  return Category.findById(id).lean<CategoryType>();
}
