import { IRoom, IReserved } from "./IRoom";

export interface IBooking {
  room: string;
  no_guests: number;
  extras?: string[];
  observations?: string;
  dates: IReserved[];
  no_nights: number;
  final_price: number;
}
