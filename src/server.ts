import express from "express";
import { router } from "./routes/router";
import "./database/connection";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    exposedHeaders: ["x-total-count"],
    origin: "*",
  })
);

app.use(router);

app.listen(process.env.PORT || 3333, () => {
  console.log("Server running 🚀");
});
