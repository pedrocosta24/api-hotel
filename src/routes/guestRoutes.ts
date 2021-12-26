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

router.get("/rooms", usersController.myRooms); // Get rooms from bookings of logged in user
router.get("/bookings", usersController.myBookings); // Get bookings of logged in user

export default router;
