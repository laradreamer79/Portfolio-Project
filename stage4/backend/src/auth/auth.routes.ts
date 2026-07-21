# يحدد روابط المصادقة
import { Router } from "express";
import { login, me, register } from "./auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
# التسجيل والدخول مايحتاجون اوثنتيكشن لأنه المستخدم لسه ماسجل
authRouter.get("/me", authenticate, me);
# يحتاج اوثنتكيشن لأنه يعرض المستخدم الحالي بناء على التوكن 
