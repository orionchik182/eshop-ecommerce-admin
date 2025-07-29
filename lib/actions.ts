"use server";

import { connectMongo } from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import { auth } from "@/lib/auth"; // если нужна авторизация
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deleteFile, uploadFile } from "./s3";
import Category from "./models/Category";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const title = formData.get("title")?.toString();

  if (!title) {
    throw new Error("Title is required.");
  }

  const props = parseProps(formData);

  const description = formData.get("description")?.toString() || "";
  const category = formData.get("category")?.toString() || null;
  const price = Number(formData.get("price") || 0);
  const files = formData.getAll("images") as File[];

  const imageUrls: string[] = [];
  for (const file of files) {
    if (!file || typeof file === "string") continue;
    const url = await uploadFile(file); // 👈 AWS S3
    imageUrls.push(url);
  }

  await connectMongo();
  await Product.create({
    title,
    description,
    category,
    price,
    images: imageUrls,
    props,
  });

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  /** 1. Значения из формы */
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Product ID missing");

  const props = parseProps(formData);

  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const price = Number(formData.get("price") ?? 0);
  const category = formData.get("category")?.toString() ?? "";

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
    { title, description, price, category, images: finalImageUrls, props },
    { new: true, runValidators: true },
  );

  /** 4. Инвалидация и редирект */
  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
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
}

function parseProps(formData: FormData) {
  const obj: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    const m = key.match(/^props\[(.+)]$/); // props[Color] → Color
    if (!m) continue;
    const name = m[1];
    const val = value.toString().trim();
    if (val) obj[name] = val;
  }
  return obj; // { Color: "red", Size: "XL" }
}

function parseProperties(formData: FormData) {
  // { "0": {name:"Color", value:"Red"}, "1": {...} }
  const map: Record<string, { name?: string; value?: string[] }> = {};

  for (const [key, value] of formData.entries()) {
    const m = key.match(/^properties\[(\d+)\]\.(name|value)$/);
    if (!m) continue;
    const [, idx, field] = m;
    map[idx] ??= {};

    if (field === "name") {
      map[idx].name = value.toString().trim();
    } else {
      // split по запятой, trim, убираем пустые элементы
      map[idx].value = value
        .toString()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return Object.values(map).filter((p) => p.name && p.value?.length); // без name игнорируем
}

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const name = formData.get("name")?.toString() || "";
  let parentCategory: string | null =
    formData.get("parentCategory")?.toString() || "";

  if (parentCategory === "") {
    parentCategory = null;
  }

  const properties = parseProperties(formData);

  await connectMongo();
  await Category.create({ name, parent: parentCategory, properties });

  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Category ID missing");

  /* 1. Подключаемся и находим товар */
  await connectMongo();
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  /* 3. Удаляем документ */
  await category.deleteOne();

  /* 4. Инвалидация списка + редирект */
  revalidatePath("/category");
}

export async function updateCategory(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  /** 1. Значения из формы */
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Category ID missing");

  const name = formData.get("name")?.toString() ?? "";
  const parentCategory = formData.get("parentCategory")?.toString() ?? "";
  const properties = parseProperties(formData);

  await connectMongo();
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  /** 2. Обновляем документ в БД */
  await Category.findByIdAndUpdate(
    id,
    { name, parentCategory, properties },
    { new: true, runValidators: true },
  );

  /** 3. Инвалидация и редирект */
  revalidatePath("/categories");
  redirect("/categories");
}
