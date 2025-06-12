import { connectMongo } from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export async function getProducts() {
  await connectMongo();
  return Product.find().lean<ProductType[]>();
}

export async function getProductById(id: string) {
  await connectMongo();
  return Product.findById(id).lean<ProductType>();
}
