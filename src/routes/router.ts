import express from "express";
import RoomsController from "@controllers/RoomsController";
import UsersController from "@controllers/UsersController";

export const router = express();

const usersController = new UsersController();

router.post("/register", usersController.create);
router.post("/login", usersController.login);
router.post("/me", usersController.verifyToken);
router.get("/users", usersController.findAll);
router
  .route("/users/:id")
  .get(usersController.findByID)
  .put(usersController.update)
  .delete(usersController.delete);
router
  .route("/users/:id/bookings")
  .get(usersController.getBookingsFromUser)
  .put(usersController.addBookingToUser);

const roomsController = new RoomsController();

router.post("/rooms", roomsController.create);
router.get("/rooms", roomsController.findAll);
router
  .route("/rooms/:id")
  .get(roomsController.findByID)
  .put(roomsController.update)
  .delete(roomsController.delete);
