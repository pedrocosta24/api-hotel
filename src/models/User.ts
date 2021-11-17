import { model, Schema } from "mongoose";
import { IUser } from "../utils/IUser";

let UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
  },
  birthday: { type: Date, required: true },
  nif: { type: Number, required: true, unique: true },
  bookings: [
    {
      room: {
        room_no: { type: String, required: true },
        type: { type: String, enum: ["single", "double", "king", "deluxe"] },
        no_beds: { type: Number, required: true },
        capacity: { type: Number, required: true },
        ammenities: {
          wifi: { type: Boolean, required: true, default: false },
          tv: { type: Boolean, required: true, default: false },
          crib: { type: Boolean, required: true, default: false },
          airConditioning: { type: Boolean, required: true, default: false },
          iron: { type: Boolean, required: true, default: false },
          smokeAlarm: { type: Boolean, required: true, default: false },
        },
        price_night: { type: Number, required: true },
        images: [{ type: String, required: false }],
      },
      no_guests: { type: Number, required: true },
      extras: [{ type: String }],
      observations: { type: String },
      reserved: [
        {
          from: { type: Date },
          to: { type: Date },
        },
      ],
      no_nights: { type: Number, required: true },
      final_price: { type: Number, required: true },
    },
  ],
  password: { type: String, required: true },
  role: { type: String, enum: ["GUEST", "ADMIN"], default: "GUEST" },
});

let UserModel = model("Users", UserSchema);

export { UserModel, UserSchema };
