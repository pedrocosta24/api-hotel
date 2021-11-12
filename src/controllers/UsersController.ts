import { Request, Response } from "express";
import User from "../models/User";

export default class UsersController {
  async create(req: Request, res: Response) {
    const { body } = req;
    const newUser = await new User(body);

    newUser
      .save()
      .then(() => {
        res.status(201).send(newUser);
      })
      .catch(res.status(400));
  }
}
