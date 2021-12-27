import express from "express";
import UsersController from "@controllers/UsersController";
import AuthController from "@controllers/AuthController";

const router = express.Router();
const usersController = new UsersController();
const authController = new AuthController();

router.use(authController.verifyTokenLoggedIn);

router
  .route("/myInfo")
  .get(usersController.getMyInfo) // Get my info"
  .put(usersController.updateMyInfo); // Update my info

router
  .route("/favRooms")
  .get(usersController.getFavRooms) // Get my favorite rooms
  .put(usersController.addFavRoom) // Add a room to my favorite rooms
  .delete(usersController.removeFavRoom); // Remove a room from my favorite rooms

router.get("/rooms", usersController.myRooms); // Get rooms from bookings of logged in user

router
  .route("/bookings")
  .get(usersController.myBookings) // Get bookings of logged in user
  .put(usersController.addBooking); // Add a booking to logged in user

export default router;
