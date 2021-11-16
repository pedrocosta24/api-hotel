import express from "express";
import RoomsController from "@controllers/RoomsController";
import UsersController from "@controllers/UsersController";

export const router = express();

const usersController = new UsersController();

router.post("/register", usersController.create)
router.post("/login", usersController.login)
router.get("/users", usersController.findAll)
router.get("/users/:id", usersController.findByID)
router.put("/users/:id", usersController.update)
router.delete("/users/:id", usersController.delete)

const roomsController = new RoomsController();

router.post("/rooms", roomsController.create)
router.get("/rooms", roomsController.findAll)
router.get("/rooms/:id", roomsController.findByID)
router.put("/rooms/:id", roomsController.update)
router.delete("/rooms/:id", roomsController.delete)