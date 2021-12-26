import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { UserModel as User } from "@models/User";

interface RequestWithToken extends Request {
  decoded: any;
}

export default class AuthController {
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
        res.status(401).json("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async verifyTokenAdmin(
    req: RequestWithToken,
    res: Response,
    next: NextFunction
  ) {
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

  async verifyTokenLoggedIn(
    req: RequestWithToken,
    res: Response,
    next: NextFunction
  ) {
    try {
      let token =
        req.headers["x-access-token"] &&
        req.headers["x-access-token"].toString();

      if (!token) {
        return res.sendStatus(401);
      }

      jwt.verify(
        token,
        process.env.SECRET,
        (err: JsonWebTokenError, decoded) => {
          if (err) {
            console.error(err.message);
            return res.sendStatus(403);
          }

          req.decoded = { auth: true, decoded };

          next();
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async me(req: Request, res: Response) {
    try {
      let token = req.headers["x-access-token"].toString();

      jwt.verify(
        token,
        process.env.SECRET,
        (err: JsonWebTokenError, decoded) => {
          res.status(200).send(decoded);
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
}
