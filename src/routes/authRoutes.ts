import express from "express";
import UsersController from "@controllers/UsersController";
import SendEmailController from "@controllers/SendEmailController";

const router = express.Router();

const usersController = new UsersController();
const sendEmailController = new SendEmailController();

router.post("/register", usersController.create);
router.post("/login", usersController.login);
router.get("/me", usersController.me);

router.post("/password-reset", sendEmailController.requestReset);
router.post(
  "/password-reset/:userId/:token",
  sendEmailController.resetPassword
);

export default router;
