import { model, Schema } from "mongoose";
import { IRoom } from "../utils/IRoom";

export let RoomSchema = new Schema<IRoom>({
  room_no: { type: Number, required: true, unique: true },
  type: { type: String, enum: ["single", "double", "king", "deluxe"] },
  no_beds: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: {
    wifi: { type: Boolean, required: true, default: false },
    tv: { type: Boolean, required: true, default: false },
    crib: { type: Boolean, required: true, default: false },
    airConditioning: { type: Boolean, required: true, default: false },
    iron: { type: Boolean, required: true, default: false },
    smokeAlarm: { type: Boolean, required: true, default: false },
  },
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
