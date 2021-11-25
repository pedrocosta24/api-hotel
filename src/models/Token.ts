import { model, Schema } from "mongoose";

let TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 10 }
});

export let TokenModel = model("Token", TokenSchema);
