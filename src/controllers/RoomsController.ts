import { Request, Response } from "express";
import { RoomModel as Room } from "../models/Room";

const ITEMS_PER_PAGE = 10;

export default class RoomsController {
  async create(req: Request, res: Response) {
    const { body } = req;
    const newRoom = await new Room(body);

    newRoom
      .save()
      .then(() => {
        res.status(201).json(newRoom);
      })
      .catch((err) => {
        res.status(400);
      });
  }

  async findAll(req: Request, res: Response) {
    const { page = 1 }: any = req.query;

    Room.find({}, (err, rooms) => {
      if (rooms) {
        res.status(200).json(rooms);
      } else {
        res.status(400);
      }
    })
      .sort([[req.query.orderBy, req.query.direction]])
      .limit(ITEMS_PER_PAGE)
      .skip((page - 1) * ITEMS_PER_PAGE);
  }

  async findByID(req: Request, res: Response) {
    const { id } = req.params;

    Room.find({ _id: id }, (err, room) => {
      if (room) {
        res.status(200).json(room);
      } else {
        res.status(400);
      }
    });
  }

  async findByRoomNo(req: Request, res: Response) {
    const { number }: any = req.params;

    Room.find({ room_no: number }, (err, room) => {
      if (room) {
        res.status(200).json(room);
      } else {
        res.status(400);
      }
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    Room.findByIdAndRemove(id, (err, deletedRoom) => {
      if (deletedRoom) {
        res.status(200).json("Room deleted successfully");
      } else {
        res.status(400);
      }
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    Room.findByIdAndUpdate(id, body, { new: true }, (err, updatedRoom) => {
      if (updatedRoom) {
        res.status(201);
        res.json(updatedRoom);
      } else {
        res.status(400);
      }
    });
  }
}
