import { model, Schema } from "mongoose"

let RoomSchema = new Schema({
  room_no: { type: String, required: true },
  type: ["single", "double", "king", "deluxe"],
  no_beds: { type: Number, required: true },
  capacity: { type: Number, required: true },
  characteristics: [{ type: String, required: true }],
  price_night: { type: Number, required: true },
  images: { type: String, required: true },
  bookings: [{
    user: { 
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      birthday: { type: Date, required: true },
      address: { type: String, required: true },
      nif: { type: Number, required: true, unique: true },
     },
    guests_no: { type: Number, required: true },
    extras: [{ type: String }],
    reserved: {
      from: { type: Date },
      to: { type: Date }
    },
    nights_no: { type: Number, required: true },
    final_price: { type: Number, required: true },
  }]
})

export let RoomModel = model('Rooms', RoomSchema)