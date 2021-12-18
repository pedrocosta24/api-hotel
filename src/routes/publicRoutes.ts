import express from "express";
import RoomsController from "@controllers/RoomsController";

const router = express.Router();
const roomsController = new RoomsController();

router.get("/rooms", roomsController.findAll); // Get all rooms
router.get("/rooms/filter", roomsController.filterRooms); // Filter rooms via query params
router.get("/rooms/id/:id", roomsController.findByID); // Get room by room_no
router.get("/rooms/available", roomsController.findAvailableRooms); // Get available rooms outside a date range

export default router;
