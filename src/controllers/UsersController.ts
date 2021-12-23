import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel as User } from "@models/User";
import { RoomModel as Room } from "@models/Room";
import { isAfter, parseISO, areIntervalsOverlapping } from "date-fns";

interface RequestWithToken extends Request {
  decoded: any;
}

const ITEMS_PER_PAGE = 10;
export default class UsersController {
  async create(req: Request, res: Response) {
    try {
      let { body } = req;

      if (
        !(
          body.email &&
          body.password &&
          body.first_name &&
          body.last_name &&
          body.phone_number
        )
      ) {
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

      User.findByIdAndUpdate(
        id,
        body,
        { new: true },
        (err: Error, updatedUser) => {
          if (updatedUser) {
            res.status(201);
            res.json(updatedUser);
          } else {
            res.status(400);
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async addBookingToUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const newBooking = req.body;

      Room.findOne(
        { room_no: newBooking.room.room_no },
        async (err: Error, room) => {
          if (room) {
            if (
              isAfter(
                parseISO(newBooking.reserved[0].to),
                parseISO(newBooking.reserved[0].from)
              )
            ) {
              let validDate = true;

              for (const reserved of room.reserved) {
                if (
                  areIntervalsOverlapping(
                    { start: reserved.from, end: reserved.to },
                    {
                      start: parseISO(newBooking.reserved[0].from),
                      end: parseISO(newBooking.reserved[0].to),
                    }
                  )
                ) {
                  validDate = false;
                }
              }

              if (validDate) {
                let newRoom = await Room.findOneAndUpdate(
                  { room_no: newBooking.room.room_no },
                  { $push: { reserved: newBooking.reserved } },
                  { new: true }
                );

                newBooking.room = {
                  room_no: newRoom.room_no,
                  type: newRoom.type,
                  no_beds: newRoom.no_beds,
                  capacity: newRoom.capacity,
                  amenities: newRoom.amenities,
                  price_night: newRoom.price_night,
                  reserved: newRoom.reserved,
                  images: newRoom.images,
                };

                User.findByIdAndUpdate(
                  id,
                  { $push: { bookings: newBooking } },
                  { new: true },
                  (err: Error, updatedBookings) => {
                    if (updatedBookings) {
                      res.status(201).json(updatedBookings);
                    } else {
                      res.status(400).send("Error adding booking");
                    }
                  }
                );
              } else {
                res.status(400).send("Date error");
              }
            } else {
              res.status(400).send("Date error");
            }
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

  async myBookings(req: RequestWithToken, res: Response) {
    try {
      let token = req.decoded;
      const { page = 1 }: any = req.query;

      User.findById(
        token.decoded.user_id,
        "bookings",
        (err: Error, bookings: any) => {
          if (bookings) {
            res.status(200).json(bookings);
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

  async myRooms(req: RequestWithToken, res: Response) {
    try {
      let token = req.decoded;
      const { page = 1 }: any = req.query;

      User.distinct(
        "bookings.room",
        { _id: token.decoded.user_id },
        (err: Error, bookings: any) => {
          if (bookings) {
            res.status(200).json(bookings);
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

  async getMyInfo(req: RequestWithToken, res: Response) {
    try {
      let token = req.decoded;

      User.findById(
        token.decoded.user_id,
        "-_id -bookings -role -password -__v",
        (err: Error, user: any) => {
          if (user) {
            res.status(200).json(user);
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
