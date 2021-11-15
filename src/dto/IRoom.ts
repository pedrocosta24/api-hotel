import { IUser } from "./IUser";

export interface IRoom {
  room_no: number;
  type: ["single" | "double" | "king" | "deluxe"];
  no_beds: number;
  capacity: number;
  characteristics?: String;
  price_night: number;
  reserved: Reserved[]
  images?: string;
}

interface Reserved {
  from: Date
  to: Date
}