import { Request, Response } from "express";
import { prisma } from "../db/postgres";

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
  res.json(users);
}
export async function getUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
}
export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name } = req.body;
  const user = await prisma.user.update({ where: { id }, data: { name }, select: { id: true, email: true, name: true } });
  res.json(user);
}
export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
}
