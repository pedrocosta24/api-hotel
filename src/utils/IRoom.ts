import { IUser } from "./IUser";

export interface IRoom {
  room_no: number;
  type: ["single" | "double" | "king" | "deluxe"];
  no_beds: number;
  capacity: number;
  characteristics?: String;
  price_night: number;
  images?: string;
  bookings: Booking[];
}

interface Booking {
  user: IUser;
  no_guest: number;
  extras?: string;
  reserved: {
    from: Date;
    to: Date;
  };
  no_nights: number;
  final_price: number;
}
