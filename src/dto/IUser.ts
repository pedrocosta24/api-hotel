import { IBooking } from "./IBooking";

export interface IUser {
  name: string;
  email: string;
  phone_number: string;
  address: IAddress;
  birthday: Date;
  nif: number;
  bookings?: IBooking[];
  password: string;
  role: "GUEST" | "ADMIN";
}

interface IAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}
