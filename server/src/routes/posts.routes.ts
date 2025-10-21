import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/multer";
import { createPost, listPosts, getPost, updatePost, deletePost } from "../controllers/posts.controller";

const r = Router();
r.get("/", listPosts);
r.get("/:id", getPost);
r.post("/", requireAuth, upload.single("cover"), createPost);
r.put("/:id", requireAuth, upload.single("cover"), updatePost);
r.delete("/:id", requireAuth, deletePost);
export default r;
