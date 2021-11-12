import { model, Schema } from "mongoose"

let UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true },
  nif: { type: Number, required: true, unique: true },
  user_type: ["GUEST", "ADMIN"]
})

let UserModel = model('Users', UserSchema)

export default UserModel