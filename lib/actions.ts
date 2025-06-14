"use server";

import { connectMongo } from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import { auth } from "@/lib/auth"; // если нужна авторизация
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deleteFile, uploadFile } from "./s3";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = Number(formData.get("price") || 0);
  const files = formData.getAll("images") as File[];

  const imageUrls: string[] = [];
  for (const file of files) {
    if (!file || typeof file === "string") continue;
    const url = await uploadFile(file); // 👈 AWS S3
    imageUrls.push(url);
  }

  await connectMongo();
  await Product.create({ title, description, price, images: imageUrls });

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  /** 1. значения из формы */
  const id = formData.get("id")?.toString(); // hidden input
  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const price = Number(formData.get("price") ?? 0);

  if (!id) throw new Error("Product ID missing");

  /** 2. БД-операция */
  await connectMongo();
  await Product.findByIdAndUpdate(
    id,
    { title, description, price },
    { new: true, runValidators: true },
  );

  /** 3. Инвалидация и редирект */
  revalidatePath("/products");
  redirect("/products");
}
export async function deleteProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Product ID missing");

  /* 1. Подключаемся и находим товар */
  await connectMongo();
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  /* 2. удаляем файлы из S3 */
  for (const url of product.images ?? []) {
    const key = url.split("/").pop()!; // "uuid-filename.jpg"
    await deleteFile(key);
  }

  /* 3. Удаляем документ */
  await product.deleteOne();

  /* 4. Инвалидация списка + редирект */
  revalidatePath("/products");
  return { ok: true };
}
