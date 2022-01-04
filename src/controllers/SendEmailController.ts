import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";

import { UserModel } from "@models/User";
import { TokenModel } from "@models/Token";
import { sendEmail } from "../utils/sendEmail";

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
          token: Math.random(),
        }).save();
      }

      //https://golden-skin-hotel.vercel.app
      const link = `https://golden-skin-hotel.vercel.app/auth/password-reset/${user._id}/${token.token}`;
      await sendEmail(
        user.email,
        "Password reset - Golden Skin Hotel",
        "Click to reset your password " + link
      );

      res.send("password reset link sent to your email account");
    } catch (error) {
      res.status(400).send("An error occurred");
      console.log(error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const schema = Joi.object({ password: Joi.string().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      await UserModel.findById(req.params.userId).then((user: any) => {
        if (!user) return res.status(400).send("user not found");
        TokenModel.findOne({
          userId: user._id,
          token: req.params.token,
        }).then(async (token: any) => {
          if (!token) return res.status(400).send("Invalid link or expired");
          user.password = await bcrypt.hash(req.body.password, 10);
          await user.save();
          await token.delete();
          res.status(200).send("password reset successfully.");
        });
      });
    } catch (error) {
      res.status(400).send("An error occurred");
      console.log(error);
    }
  }
}
