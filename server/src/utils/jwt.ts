import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signAccess = (payload: object) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL || "15m" });

export const signRefresh = (payload: object) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL || "7d" });

export const verifyAccess = (t: string) => jwt.verify(t, env.JWT_ACCESS_SECRET);
export const verifyRefresh = (t: string) => jwt.verify(t, env.JWT_REFRESH_SECRET);
