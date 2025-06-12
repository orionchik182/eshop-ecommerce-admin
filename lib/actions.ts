"use server";

import { connectMongo } from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import { auth } from "@/lib/auth"; // если нужна авторизация
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = Number(formData.get("price") || 0);

  await connectMongo();
  await Product.create({ title, description, price });

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

  await connectMongo();
  await Product.findByIdAndDelete(id);

  revalidatePath("/products"); // сбросим кеш списка
  redirect("/products"); // вернём пользователя на список
}
