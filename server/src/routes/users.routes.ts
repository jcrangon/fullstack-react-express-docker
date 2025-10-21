import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listUsers, getUser, updateUser, deleteUser } from "../controllers/users.controller";
const r = Router();
r.get("/", requireAuth, listUsers);
r.get("/:id", requireAuth, getUser);
r.put("/:id", requireAuth, updateUser);
r.delete("/:id", requireAuth, deleteUser);
export default r;
