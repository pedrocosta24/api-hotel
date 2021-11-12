import { Request, Response } from "express";
import { UserModel as User } from "../models/User";

export default class UsersController {
  async create(req: Request, res: Response) {
    const { body } = req;
    const newUser = await new User(body);

    newUser
      .save()
      .then(() => {
        res.status(201).json(newUser);
      })
      .catch(res.status(400));
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

    User.findByIdAndUpdate(id,body, { new: true }, (err, updatedUser) => {
        if (updatedUser) {
          res.status(201);
          res.json(updatedUser);
        } else {
          res.status(400);
        }
      }
    );
  }
}
