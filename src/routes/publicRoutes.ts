import express from "express";
import RoomsController from "@controllers/RoomsController";

const router = express.Router();
const roomsController = new RoomsController();

router.get("/rooms", roomsController.findAll); // Get all rooms

export default router;
