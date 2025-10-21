import "dotenv/config";

const required = [
  "DATABASE_URL",
  "MONGO_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "UPLOAD_DIR"
] as const;

for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 8080),
  DATABASE_URL: process.env.DATABASE_URL!,
  MONGO_URL: process.env.MONGO_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || "7d",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || "localhost",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  UPLOAD_DIR: process.env.UPLOAD_DIR!
};
