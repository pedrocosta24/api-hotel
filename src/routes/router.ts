import express from "express";
import nodemailer from 'nodemailer'

import authRouter from "./authRoutes";
import adminRouter from "./adminRoutes";
import publicRouter from "./publicRoutes";
import { configMail } from "src/utils/emailData";

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
      user: configMail.mailUser,
      pass: configMail.mailPass,
    },
  });

  var mailOptions = {
    from: configMail.mailFrom,
    to: data.to,
    subject: data.subject,
    text: data.texts
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
      res.send("<b>Email enviado</b> <br>" + info.response);
    }
  });
});