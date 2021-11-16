interface IRoom {
  room_no: number;
  type: "single" | "double" | "king" | "deluxe";
  no_beds: number;
  capacity: number;
  characteristics?: String[];
  price_night: number;
  reserved: IReserved[];
  images?: String[];
}

interface IReserved {
  from: Date;
  to: Date;
}

export { IRoom, IReserved };
