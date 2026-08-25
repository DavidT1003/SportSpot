import mongoose from "mongoose";

// Na serverlessu se modul može učitati više puta, pa konekciju keširamo
// globalno da svaki zahtjev ne otvara novu vezu prema Atlasu.
const cached = globalThis._mongoose ?? (globalThis._mongoose = { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI nije postavljen.");
    }
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Da neuspjeli pokušaj ne ostane zapamćen zauvijek
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
