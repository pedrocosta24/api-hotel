import express from "express";
import UsersController from "@controllers/UsersController";

const router = express.Router();
const usersController = new UsersController();

router.post("/register", usersController.create);
router.post("/login", usersController.login);
router.post("/me", usersController.verifyToken);

export default router;
