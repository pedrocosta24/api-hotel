import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import { UserModel as User } from "@models/User";
import { RoomModel as Room } from "@models/Room";
import RoomsController from "./RoomsController";

interface RequestWithToken extends Request {
  decoded: any;
}

const roomsController = new RoomsController();
const ITEMS_PER_PAGE = 10;
export default class UsersController {
  async create(req: Request, res: Response) {
    try {
      let { body } = req;

      if (!(body.email && body.password && body.name && body.phone_number)) {
        res.status(400).send("All input is required");
      }

      if (await User.findOne({ email: body.email })) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      const encryptedPassword = await bcrypt.hash(body.password, 10);

      body.password = encryptedPassword;

      User.create(body, (err: Error, newUser: any) => {
        if (newUser) {
          res.status(201).json(newUser);
        } else {
          res.sendStatus(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        res.status(400).send("All input is required");
      }

      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, email, role: user.role },
          process.env.SECRET,
          {
            expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
          }
        );

        res.json({ token });
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async verifyToken(req: RequestWithToken, res: Response, next: NextFunction) {
    try {
      let token =
        req.headers["x-access-token"] &&
        req.headers["x-access-token"].toString();

      if (!token) {
        return res.sendStatus(401);
      }

      jwt.verify(token, process.env.SECRET, (err: Error, decoded) => {
        if (err) {
          console.error(err.message);
          return res.sendStatus(403);
        }

        req.decoded = { auth: true, decoded };

        if (decoded.role != "ADMIN") {
          return res.sendStatus(403);
        }

        next();
      });
    } catch (err) {
      console.error(err);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const { page = 1 }: any = req.query;

      User.find({}, (err: Error, users) => {
        if (users) {
          res.status(200).json(users);
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

      User.findById(id, (err: Error, user: any) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getBookingsFromUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      User.findById(id, "bookings", (err: Error, bookings: any) => {
        if (bookings) {
          res.status(200).json(bookings);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      User.findByIdAndRemove(id, (err: Error, deletedUser: any) => {
        if (deletedUser) {
          res.status(200).json("User deleted successfully");
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

      User.findByIdAndUpdate(id, body, { new: true }, (err, updatedUser) => {
        if (updatedUser) {
          res.status(201);
          res.json(updatedUser);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async addBookingToUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const newBooking = req.body;

      Room.exists(
        { room_no: newBooking.room.room_no },
        async (err, roomExists) => {
          if (roomExists) {
            let newRoom = await Room.findOneAndUpdate(
              { room_no: newBooking.room.room_no },
              { $push: { reserved: newBooking.reserved } },
              { new: true }
            );

            let updatedRoom = {
              room_no: newRoom.room_no,
              type: newRoom.type,
              no_beds: newRoom.no_beds,
              capacity: newRoom.capacity,
              amenities: newRoom.amenities,
              price_night: newRoom.price_night,
              reserved: newRoom.reserved,
              images: newRoom.images,
            };

            newBooking.room = updatedRoom;

            User.findByIdAndUpdate(
              id,
              { $push: { bookings: newBooking } },
              { new: true },
              (err, updatedBookings) => {
                if (updatedBookings) {
                  res.status(201).json(updatedBookings);
                } else {
                  res.sendStatus(400);
                }
              }
            );
          } else {
            res.sendStatus(400);
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async getRoomsFromBookingsOfUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      User.findById(id, "bookings.room", (err: Error, rooms: any) => {
        if (rooms) {
          res.status(200).json(rooms);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getAllRoomsFromBookings(req: Request, res: Response) {
    try {
      User.distinct("bookings.room", (err: Error, rooms: any) => {
        if (rooms) {
          res.status(200).send(rooms);
        } else {
          res.status(400);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
