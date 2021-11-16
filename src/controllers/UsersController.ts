import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel as User } from "../models/User";

export default class UsersController {
  async create(req: Request, res: Response) {
    // Our register logic starts here
    try {
      // Get user input
      const { body } = req;

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

      console.log(encryptedPassword);

      // Create user in our database

      body.password = encryptedPassword;

      const user = await User.create(body);

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email: body.email },
        process.env.SECRET,
        {
          expiresIn: `${process.env.EXPIRESPASSWORD}`,
        }
      );
      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  }

  async login(req: Request, res:Response){
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
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(req: Request, res: Response) {
    User.find({}, (err, users) => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(400);
      }
    });
  }

  async findByID(req: Request, res: Response) {
    const { id } = req.params;

    User.find({ _id: id }, (err, user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400);
      }
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    User.findByIdAndRemove(id, (err, deletedUser) => {
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
}
