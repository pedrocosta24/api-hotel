import { model, Schema } from "mongoose"
import { IUser } from "src/utils/IUser"

import UserModel from "./User"

const user: IUser = new UserModel()

let RoomSchema = new Schema({
  room_no: { type: String, required: true },
  type: ["single", "double", "king", "deluxe"],
  bed_no: { type: String, required: true },
  capacity: { type: Date, required: true },
  characteristics: { type: String, required: true },
  price_night: { type: Number, required: true },
  images: { type: String, required: true },
  bookings: [{
    user: { type: user },
    guests_no: { type: Number, required: true },
    extras: [{ type: String }],
    nights_no: { type: Number, required: true },
    final_price: { type: Number, required: true }
  }]
})

let RoomModel = model('Rooms', RoomSchema)

export default RoomModel
