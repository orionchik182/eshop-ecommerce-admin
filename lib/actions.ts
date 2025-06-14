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

  /** 1. Значения из формы */
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Product ID missing");

  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const price = Number(formData.get("price") ?? 0);

  // Новые файлы для загрузки
  const newImageFiles = formData.getAll("images") as File[];
  // Старые URL, которые пользователь решил оставить
  const keptImageUrls = formData.getAll("keptImages") as string[];

  await connectMongo();
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  /** 2. Работа с изображениями */
  // Определяем, какие из старых изображений нужно удалить
  const imagesToDelete = product.images.filter(
    (url: string) => !keptImageUrls.includes(url),
  );

  // Удаляем их из S3
  for (const url of imagesToDelete) {
    const key = url.split("/").pop()!;
    if (key) {
      await deleteFile(key);
    }
  }

  // Загружаем новые изображения в S3
  const newImageUrls: string[] = [];
  for (const file of newImageFiles) {
    if (file && file.size > 0) {
      const url = await uploadFile(file);
      newImageUrls.push(url);
    }
  }

  // Формируем финальный список изображений для БД
  const finalImageUrls = [...keptImageUrls, ...newImageUrls];

  /** 3. Обновляем документ в БД */
  await Product.findByIdAndUpdate(
    id,
    { title, description, price, images: finalImageUrls },
    { new: true, runValidators: true },
  );

  /** 4. Инвалидация и редирект */
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
