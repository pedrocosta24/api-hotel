import express from "express";

import authRouter from "./authRoutes";
import adminRouter from "./adminRoutes";
import publicRouter from "./publicRoutes";
import guestRouter from "./guestRoutes";

export const router = express();

router.use("/auth", authRouter); // Routes for authentication
router.use("/", publicRouter); // Public routes
router.use("/admin", adminRouter); // Routes only accessible by admin
router.use("/me", guestRouter); // Routes accessible by guests (logged in)
