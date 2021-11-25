import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";

import { UserModel } from "@models/User";
import { TokenModel } from "@models/Token";
import { sendEmail } from "src/utils/sendEmail";

export default class SendEmailController {
  async requestReset(req: Request, res: Response) {
    try {
      const schema = Joi.object({ email: Joi.string().email().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await UserModel.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).send("user with given email doesn't exist");

      let token = await TokenModel.findOne({ userId: user._id });
      if (!token) {
        token = await new TokenModel({
          userId: user._id,
          // token: crypto.randomBytes(32).toString("hex"),
          token: "asdasd",
        }).save();
      }

      const link = `http://localhost:3333/auth/password-reset/${user._id}/${token.token}`;
      await sendEmail(user.email, "Password reset", link);

      res.send("password reset link sent to your email account");
    } catch (error) {
      res.send("An error occured");
      console.log(error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const schema = Joi.object({ password: Joi.string().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await UserModel.findById(req.params.userId);
      if (!user) return res.status(400).send("invalid link or expired");

      const token = await TokenModel.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link or expired");

      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();
      await token.delete();

      res.send("password reset successfully.");
    } catch (error) {
      res.send("An error occurred");
      console.log(error);
    }
  }
}
