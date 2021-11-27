import express from "express";
import UsersController from "@controllers/UsersController";
import AuthController from "@controllers/AuthController";
import SendEmailController from "@controllers/SendEmailController";

const router = express.Router();

const usersController = new UsersController();
const authController = new AuthController();
const sendEmailController = new SendEmailController();

router.post("/register", usersController.create); // Create user
router.post("/login", authController.login); // Login
router.get("/me", authController.me); // Returns token decoded

router.post("/password-reset", sendEmailController.requestReset);
router.post(
  "/password-reset/:userId/:token",
  sendEmailController.resetPassword
);

export default router;
