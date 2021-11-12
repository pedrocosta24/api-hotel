import "../lib/env";
import { connect } from "mongoose";

connect(`${process.env.DB_URL}`)
  .then(() => {
    console.log("Success");
  })
  .catch((err) => {
    console.error(err);
  });
