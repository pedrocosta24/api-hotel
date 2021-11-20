import express from "express";
import RoomsController from "@controllers/RoomsController";
import UsersController from "@controllers/UsersController";

const router = express.Router();
const usersController = new UsersController();
const roomsController = new RoomsController();

router.get("/users", usersController.findAll); // Get a list of all users

router
  .route("/users/:id")
  .get(usersController.findByID) // Get a user by ID
  .put(usersController.update) // Update a user by ID
  .delete(usersController.delete); // Delete a user by ID

router
  .route("/users/:id/bookings")
  .get(usersController.getBookingsFromUser) // Get all bookings from a user by ID
  .put(usersController.addBookingToUser); // Push a booking to bookings of a user by its ID

router.get(
  "/users/:id/bookings/rooms",
  usersController.getRoomsFromBookingsOfUser
); // Get all rooms from all bookings of a user

router.get("/users/bookings/rooms", usersController.getAllRoomsFromBookings); // Gell all rooms from all bookings

router
  .route("/rooms")
  .post(roomsController.create) // Create a room
  .get(roomsController.findAll); // Get all rooms

router
  .route("/rooms/:id")
  .get(roomsController.findByID) // Get a room by ID
  .put(roomsController.update) // Update a room by ID
  .delete(roomsController.delete); // Delete a room by ID

router.get("/rooms/number/:number", roomsController.findByRoomNo);

export default router;
