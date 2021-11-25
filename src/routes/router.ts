import express from "express";

import authRouter from "./authRoutes";
import adminRouter from "./adminRoutes";
import publicRouter from "./publicRoutes";

export const router = express();

router.use("/auth", authRouter);
router.use("/", publicRouter);
router.use("/admin", adminRouter);
