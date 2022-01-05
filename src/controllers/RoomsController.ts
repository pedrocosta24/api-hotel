import { Request, Response } from "express";
import { RoomModel as Room } from "@models/Room";
import { IRoom } from "src/utils/IRoom";
import { Error } from "mongoose";

let ITEMS_PER_PAGE: number = 6;

export default class RoomsController {
  async create(req: Request, res: Response) {
    try {
      const { body } = req;

      Room.create(body, (err: Error, newRoom: IRoom) => {
        if (newRoom) {
          res.status(201).json(newRoom);
        } else {
          res.sendStatus(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const { body } = req && req;
      let page: number = req.query.page
        ? parseInt(req.query.page.toString())
        : 1;

      let count = await Room.countDocuments({});

      if (req.query.noLimit == "true") {
        ITEMS_PER_PAGE = count;
      } else {
        ITEMS_PER_PAGE = req.query.limit
          ? parseInt(req.query.limit.toString())
          : ITEMS_PER_PAGE;
      }

      Room.find(body, (err: Error, rooms: IRoom[]) => {
        if (rooms) {
          res.setHeader("x-total-count", count.toString());
          res.status(200).json(rooms);
        } else {
          res.status(400);
        }
      })
        .sort([[req.query.orderBy, req.query.direction]])
        .limit(ITEMS_PER_PAGE)
        .skip((page - 1) * ITEMS_PER_PAGE);
    } catch (err) {
      console.error(err);
    }
  }

  async findByID(req: Request, res: Response) {
    try {
      const { id } = req.params;

      Room.findById(id, (err: Error, room: IRoom) => {
        if (room) {
          res.status(200).json(room);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async findByRoomNo(req: Request, res: Response) {
    try {
      const { number }: any = req.params;

      Room.find({ room_no: number }, (err: Error, room: IRoom) => {
        if (room) {
          res.status(200).json(room);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async findAvailableRooms(req: Request, res: Response) {
    try {
      const { checkIn, checkOut }: any = req.query;
      let page: number = req.query.page
        ? parseInt(req.query.page.toString())
        : 1;
      ITEMS_PER_PAGE = req.query.limit
        ? parseInt(req.query.limit.toString())
        : ITEMS_PER_PAGE;

      let count = await Room.countDocuments({
        $or: [
          {
            $nor: [
              {
                "reserved.to": {
                  $gte: new Date(checkIn),
                },
                "reserved.from": {
                  $lte: new Date(checkOut),
                },
              },
            ],
          },
          {
            reserved: { $eq: [] },
          },
        ],
      });

      Room.find(
        {
          $or: [
            {
              $nor: [
                {
                  "reserved.to": {
                    $gte: new Date(checkIn),
                  },
                  "reserved.from": {
                    $lte: new Date(checkOut),
                  },
                },
              ],
            },
            {
              reserved: { $eq: [] },
            },
          ],
        },
        (err: Error, rooms: IRoom[]) => {
          if (rooms) {
            res.setHeader("x-total-count", count.toString());
            res.status(200).json(rooms);
          } else {
            res.status(400);
          }
        }
      )
        .sort([[req.query.orderBy, req.query.direction]])
        .limit(ITEMS_PER_PAGE)
        .skip((page - 1) * ITEMS_PER_PAGE);
    } catch (err) {
      console.error(err);
    }
  }

  async filterRooms(req: Request, res: Response) {
    try {
      const q = req.query;
      let page: number = req.query.page
        ? parseInt(req.query.page.toString())
        : 1;
      ITEMS_PER_PAGE = req.query.limit
        ? parseInt(req.query.limit.toString())
        : ITEMS_PER_PAGE;
      const { checkIn, checkOut }: any = q;

      let orders: any = [];
      if (q.orderByPrice) {
        orders.push(["price_night", req.query.orderByPrice]);
      }
      if (q.orderByArea) {
        orders.push(["area", q.orderByArea]);
      }

      let filter = {};

      if (q.checkIn && q.checkOut) {
        filter = {
          ...filter,
          $or: [
            {
              $nor: [
                {
                  "reserved.to": {
                    $gte: new Date(checkIn),
                  },
                  "reserved.from": {
                    $lte: new Date(checkOut),
                  },
                },
              ],
            },
            {
              reserved: { $eq: [] },
            },
          ],
        };
      }

      if (q.type) {
        let types: any = q.type;

        filter = {
          ...filter,
          type: {
            $in: types.split(","),
          },
        };
      }

      if (q.capacityLT || q.capacityGT) {
        filter = {
          ...filter,
          capacity: {
            $gte: q.capacityGT ? q.capacityGT : 0,
            $lte: q.capacityLT ? q.capacityLT : 100,
          },
        };
      }

      if (q.no_bedsLT || q.no_bedsGT) {
        filter = {
          ...filter,
          no_beds: {
            $gte: q.no_bedsGT ? q.no_bedsGT : 1,
            $lte: q.no_bedsLT ? q.no_bedsLT : 100,
          },
        };
      }

      if (q.priceLT || q.priceGT) {
        filter = {
          ...filter,
          price_night: {
            $gte: q.priceGT ? q.priceGT : 0,
            $lte: q.priceLT ? q.priceLT : 999999,
          },
        };
      }

      if (q.amenities) {
        let amenities: any = q.amenities;

        filter = {
          ...filter,
          $expr: {
            $and: amenities.split(",").map((amenity: any) => {
              return {
                $eq: [`$amenities.${amenity}`, true],
              };
            }),
          },
        };
      }

      let count = await Room.countDocuments(filter);

      Room.find(filter, (err: Error, rooms: IRoom[]) => {
        if (rooms) {
          res.setHeader("x-total-count", count.toString());
          res.status(200).json(rooms);
        } else {
          res.status(400);
        }
      })
        .sort(orders)
        .limit(ITEMS_PER_PAGE)
        .skip((page - 1) * ITEMS_PER_PAGE);
    } catch (err) {
      console.error(err);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      Room.findByIdAndRemove(id, (err: Error, deletedRoom: IRoom) => {
        if (deletedRoom) {
          res.status(200).json("Room deleted successfully");
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { body } = req;

      Room.findByIdAndUpdate(
        id,
        body,
        { new: true },
        (err: Error, updatedRoom: IRoom) => {
          if (updatedRoom) {
            res.status(201);
            res.json(updatedRoom);
          } else {
            res.status(400);
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
}
