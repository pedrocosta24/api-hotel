export interface IUser {
  name: string,
  email: string
  password: string,
  birthday: Date,
  address: string,
  nif: number,
  role: [
    "GUEST" | "ADMIN"
  ]
}