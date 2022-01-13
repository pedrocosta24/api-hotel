import { model, Schema } from "mongoose";
import { IUser } from "../utils/IUser";
import { RoomSchema } from "./Room";

let UserSchema = new Schema<IUser>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    postal_code: { type: String },
    country: { type: String },
  },
  birthday: { type: Date },
  nif: { type: Number, maxlength: 9, unique: true },
  fav_rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  bookings: [
    {
      room: { type: Schema.Types.ObjectId, ref: "Room" },
      no_guests: { type: Number },
      extras: [{ type: String }],
      observations: { type: String },
      dates: {
        from: { type: Date },
        to: { type: Date },
      },
      no_nights: { type: Number },
      cancelled: { type: Boolean, default: false },
      final_price: { type: Number },
    },
  ],
  password: { type: String, required: true },
  role: { type: String, enum: ["GUEST", "ADMIN"], default: "GUEST" },
});

let UserModel = model("Users", UserSchema);
let Room = model("Room", RoomSchema);

export { UserModel, UserSchema };
