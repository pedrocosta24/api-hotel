const express = require("express");
import RoomsController from "@controllers/RoomsController";
import UsersController from "@controllers/UsersController";

const router = express.Router();

const usersController = new UsersController();
const roomsController = new RoomsController();

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

router.post("/rooms", roomsController.create);

router.get("/rooms", roomsController.findAll);

router
  .route("/rooms/:id")
  .get(roomsController.findByID)
  .put(roomsController.update)
  .delete(roomsController.delete);

export default router;
