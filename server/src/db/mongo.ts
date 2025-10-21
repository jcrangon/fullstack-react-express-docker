import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.MONGO_URL);
  console.log("[mongo] connected");
}

const AuditSchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  userId: Number,
  action: String,
  meta: mongoose.Schema.Types.Mixed
});

export const AuditLog = mongoose.model("AuditLog", AuditSchema);
