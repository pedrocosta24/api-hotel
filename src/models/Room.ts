import { model, Schema } from "mongoose";
import { IRoom } from "../utils/IRoom";

let RoomSchema = new Schema<IRoom>({
  room_no: { type: Number, required: true },
  type: { type: String, enum: ["single", "double", "king", "deluxe"] },
  no_beds: { type: Number, required: true },
  capacity: { type: Number, required: true },
  characteristics: [{ type: String, required: true }],
  price_night: { type: Number, required: true },
  reserved: [
    {
      from: { type: Date },
      to: { type: Date },
    },
  ],
  images: [{ type: String, required: true }],
});

export let RoomModel = model("Rooms", RoomSchema);
