import { IRoom } from "./IRoom";

export interface IBooking {
  room: IRoom
  no_guest: number;
  extras?: string;
  observations: string
  reserved: {
    from: Date;
    to: Date;
  };
  no_nights: number;
  final_price: number;
}