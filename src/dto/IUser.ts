import { IBooking } from "./IBooking";

export interface IUser {
  name: string
  email: string
  password: string
  birthday: Date
  phone_number: string
  nif: number
  address: IAddress
  bookings: IBooking
  role: [
    "GUEST" | "ADMIN"
  ]
}

interface IAddress {
  street: string
  city: string
  postal_code: string
  country: string
}