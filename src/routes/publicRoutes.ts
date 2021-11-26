import express from "express";
import RoomsController from "@controllers/RoomsController";

const router = express.Router();
const roomsController = new RoomsController();

router.get("/rooms", roomsController.findAll); // Get all rooms
router.get("/rooms/number/:number", roomsController.findByRoomNo); // Get room by room_no

export default router;
