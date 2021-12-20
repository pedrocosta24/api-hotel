import { IBooking } from "./IBooking";

export interface IUser {
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  phone_number: string;
  address: IAddress;
  birthday: Date;
  nif: number;
  bookings?: IBooking[];
  password: string;
  role: "GUEST" | "ADMIN";
  token: string;
}

interface IAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}
