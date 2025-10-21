import fs from "node:fs";
import app from "./app";
import { prisma } from "./db/postgres";
import { connectMongo } from "./db/mongo";
import { env } from "./config/env";

if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

await prisma.$connect();
await connectMongo();

app.listen(env.PORT, () => {
  console.log(`✅ API listening on :${env.PORT}`);
});
