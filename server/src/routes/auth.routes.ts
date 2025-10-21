import { Router } from "express";
import { register, login, refresh, me, logout } from "../controllers/auth.controller";
const r = Router();
r.post("/register", register);
r.post("/login", login);
r.post("/refresh", refresh);
r.get("/me", me);
r.post("/logout", logout);
export default r;
