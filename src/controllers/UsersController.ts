import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import { UserModel as User } from "@models/User";

const ITEMS_PER_PAGE = 10;
export default class UsersController {
  async create(req: Request, res: Response) {
    // Our register logic starts here
    try {
      // Get user input
      let { body } = req;

      // Validate user input
      if (!(body.email && body.password && body.name && body.phone_number)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email: body.email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(body.password, 10);

      // Create user in our database

      body.password = encryptedPassword;

      let user = await User.create(body);

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email: body.email },
        process.env.SECRET,
        {
          expiresIn: `${process.env.EXPIRESPASSWORD}`,
        }
      );
      // save user token
      //user.token = token;

      // return new user
      res.status(201).json(token);
    } catch (err) {
      console.log(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.SECRET,
          {
            expiresIn: `${process.env.EXPIRESPASSWORD}`,
          }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json(token);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(req: Request, res: Response) {
    const { page = 1 }: any = req.query;

    User.find({}, (err, users) => {
      if (users) {
        res.status(200).json(users);
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

    User.findById(id, (err: Error, user: any) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400);
      }
    });
  }

  async getBookingsFromUser(req: Request, res: Response) {
    const { id } = req.params;

    User.findById(id, "bookings", (err: Error, bookings: any) => {
      if (bookings) {
        res.status(200).json(bookings);
      } else {
        res.status(400);
      }
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    User.findByIdAndRemove(id, (err: Error, deletedUser: any) => {
      if (deletedUser) {
        res.status(200).json("User deleted successfully");
      } else {
        res.status(400);
      }
    });
  }

  async update(req: Request, res: Response) {
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
  }

  async addBookingToUser(req: Request, res: Response) {
    const { id } = req.params;
    const newBooking = req.body;

    User.findByIdAndUpdate(
      id,
      { $push: { bookings: newBooking } },
      { new: true },
      (err, updatedBookings) => {
        if (updatedBookings) {
          res.status(201).json(updatedBookings);
        } else {
          res.status(400);
        }
      }
    );
  }

  verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers["x-access-token"].toString();

    if (!token) {
      return res.status(401);
    }

    verify(token, process.env.SECRET, (err, decoded) => {
      res.status(202).send({ auth: true, decoded });
    });
  }

  async getRoomsFromBookingsOfUser(req: Request, res: Response) {
    const { id } = req.params;

    User.findById(id, "bookings.room", (err: Error, rooms: any) => {
      if (rooms) {
        res.status(200).json(rooms);
      } else {
        res.status(400);
      }
    });
  }

  async getAllRoomsFromBookings(req: Request, res: Response) {
    User.distinct("bookings.room", (err: Error, rooms: any) => {
      if (rooms) {
        res.status(200).send(rooms);
      } else {
        res.status(400);
      }
    });
  }
}
