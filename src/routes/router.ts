import express from "express";
import nodemailer from 'nodemailer'

import authRouter from "./authRoutes";
import adminRouter from "./adminRoutes";
import publicRouter from "./publicRoutes";

export const router = express();

router.use("/auth", authRouter);

router.use("/admin", adminRouter);

// Teste 

router.post("/reset", function (req, res, next) {
  const data = req.body;
  console.log(data);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  var mailOptions = {
    from: process.env.MAIL_FROM,
    to: data.to,
    subject: data.subject,
    text: data.text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.json("E-mail sent successfully");
    }
  });
});