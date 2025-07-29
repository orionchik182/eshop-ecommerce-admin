import Order from "@/lib/models/Order";
import { connectMongo } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    await connectMongo();
    const orders = await Order.find().sort({ createdAt: -1 });
    if (!orders) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
