import "../lib/env";
import { connect } from "mongoose";

connect(`${process.env.DATABASE_URL}`)
  .then(() => {
    console.log("DB connected successfully 🟢");
  })
  .catch((err) => {
    console.error(err);
  });
