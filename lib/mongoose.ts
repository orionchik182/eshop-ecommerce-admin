import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("❌  MONGODB_URI not set");

const g = globalThis as GlobalCache;

if (!g._mongoose) {
  g._mongoose = { conn: null, promise: null };
}

export async function connectMongo(): Promise<Mongoose> {
  if (g._mongoose!.conn) return g._mongoose!.conn;

  if (!g._mongoose!.promise) {
    g._mongoose!.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  g._mongoose!.conn = await g._mongoose!.promise;
  return g._mongoose!.conn;
}
