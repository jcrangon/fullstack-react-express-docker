import { Request, Response } from "express";
import { prisma } from "../db/postgres";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt";
import { addDays } from "../utils/addDays";
import { env } from "../config/env";

function setAuthCookies(res: Response, access: string, refresh: string) {
  const common = {
    httpOnly: true,
    secure: false, // mettre true en prod (HTTPS)
    sameSite: "lax" as const,
    domain: env.COOKIE_DOMAIN,
    path: "/"
  };
  res.cookie("access_token", access, { ...common, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", refresh, { ...common, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function register(req: Request, res: Response) {
  const { email, name, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });
  const user = await prisma.user.create({
    data: { email, name, password: await hashPassword(password) },
    select: { id: true, email: true, name: true }
  });
  return res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const access = signAccess({ sub: user.id, email: user.email });
  const refresh = signRefresh({ sub: user.id });

  await prisma.refreshToken.create({
    data: { token: refresh, userId: user.id, expiresAt: addDays(new Date(), 7) }
  });

  setAuthCookies(res, access, refresh);
  return res.json({ ok: true });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    return res.status(401).json({ error: "Invalid refresh" });
  }

  let payload: any;
  try {
    payload = verifyRefresh(token);
  } catch {
    return res.status(401).json({ error: "Invalid refresh" });
  }

  await prisma.refreshToken.update({ where: { token }, data: { revoked: true } });

  const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
  if (!user) return res.status(401).json({ error: "User not found" });

  const access = signAccess({ sub: user.id, email: user.email });
  const refresh2 = signRefresh({ sub: user.id });

  await prisma.refreshToken.create({
    data: { token: refresh2, userId: user.id, expiresAt: addDays(new Date(), 7) }
  });

  setAuthCookies(res, access, refresh2);
  return res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  const access = req.cookies?.access_token;
  if (!access) return res.status(401).json({ error: "Unauthenticated" });
  const payload: any = (await import("jsonwebtoken")).verify(access, env.JWT_ACCESS_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: true, email: true, name: true }
  });
  return res.json(user);
}

export async function logout(req: Request, res: Response) {
  const r = req.cookies?.refresh_token;
  if (r) await prisma.refreshToken.updateMany({ where: { token: r }, data: { revoked: true } });
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.json({ ok: true });
}
