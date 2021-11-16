import { IRoom, IReserved } from "./IRoom";

export interface IBooking {
  room: IRoom;
  no_guests: number;
  extras?: string[];
  observations: string;
  reserved: IReserved[];
  no_nights: number;
  final_price: number;
}
