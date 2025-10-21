import { Request, Response } from "express";
import { prisma } from "../db/postgres";
import { AuditLog } from "../db/mongo";

export async function listPosts(_req: Request, res: Response) {
  const posts = await prisma.post.findMany({ include: { author: { select: { id: true, name: true } } } });
  res.json(posts);
}
export async function getPost(req: Request, res: Response) {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({ where: { id }, include: { author: { select: { id: true, name: true } } } });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
}
export async function createPost(req: Request, res: Response) {
  const userId = Number((req as any).user.sub);
  const { title, content } = req.body;
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const post = await prisma.post.create({ data: { title, content, authorId: userId, coverUrl } });
  await AuditLog.create({ userId, action: "POST_CREATED", meta: { postId: post.id } });
  res.status(201).json(post);
}
export async function updatePost(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const post = await prisma.post.update({
    where: { id },
    data: { title, content, ...(coverUrl ? { coverUrl } : {}) }
  });
  res.json(post);
}
export async function deletePost(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.post.delete({ where: { id } });
  res.json({ ok: true });
}
