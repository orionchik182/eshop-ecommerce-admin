import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  const body = await req.json();
  await connectMongo();
  const doc = await Product.create(body);
  return NextResponse.json(doc, { status: 201 });
}
