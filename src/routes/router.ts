import express from "express";
import RoomsController from "@controllers/RoomsController";
import UsersController from "@controllers/UsersController";

export const router = express();

const usersController = new UsersController();

router.post("/users", usersController.create)
router.get("/users", usersController.findAll)
router.get("/users/:id", usersController.findByID)
router.put("/users/:id", usersController.update)
router.delete("/users/:id", usersController.delete)

const roomsController = new RoomsController();

router.post("/rooms", usersController.create)
// router.get("/rooms", usersController.findAll)