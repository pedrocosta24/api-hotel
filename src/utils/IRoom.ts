export interface IRoom {
  room_no: number;
  type: "single" | "double" | "king" | "deluxe";
  no_beds: number;
  capacity: number;
  area: number;
  amenities: {
    wifi: boolean;
    tv: boolean;
    crib: boolean;
    airConditioning: boolean;
    iron: boolean;
    smokeAlarm: boolean;
  };
  price_night: number;
  reserved: IReserved[];
  images?: String[];
}

export interface IReserved {
  from: Date;
  to: Date;
}
