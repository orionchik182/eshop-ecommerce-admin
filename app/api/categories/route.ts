import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Category from "@/lib/models/Category";

export async function POST(req: Request) {
  const body = await req.json();
  await connectMongo();
  const doc = await Category.create(body);
  return NextResponse.json(doc, { status: 201 });
}
