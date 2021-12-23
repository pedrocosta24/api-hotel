import express from "express";
import { router } from "./routes/router";
import "./database/connection";

const app = express();
app.use(express.json());

app.use(router);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running 🚀");
});
